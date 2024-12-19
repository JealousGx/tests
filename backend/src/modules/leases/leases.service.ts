import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { contacts } from '../../common/schema/contacts.schema';
import { leases } from '../../common/schema/leases.schema';
import { units } from '../../common/schema/units.schema';
import { db } from '../../config/database.config';
import { UpdateUnitDto } from '../units/dto/update-unit.dto';
import { CreateLeaseDto } from './dto/create-lease.dto';
import { UpdateLeaseDto } from './dto/update-lease.dto';

@Injectable()
export class LeasesService {
  async create(createLeaseDto: CreateLeaseDto) {
    // Verify unit exists and is vacant
    const [unit] = await db
      .select()
      .from(units)
      .where(eq(units.id, createLeaseDto.unitId));

    if (!unit) {
      throw new NotFoundException(
        `Unit with ID ${createLeaseDto.unitId} not found`,
      );
    }

    if (unit.status === 'OCCUPIED') {
      throw new BadRequestException('Unit is already occupied');
    }

    // Verify tenant exists and is actually a tenant
    const [tenant] = await db
      .select()
      .from(contacts)
      .where(
        and(
          eq(contacts.id, createLeaseDto.tenantId),
          eq(contacts.type, 'TENANT'),
        ),
      );

    if (!tenant) {
      throw new NotFoundException(
        `Tenant with ID ${createLeaseDto.tenantId} not found`,
      );
    }

    const _createLeaseDto = {
      ...createLeaseDto,
      monthlyRent: createLeaseDto.monthlyRent.toString(),
      securityDeposit: createLeaseDto.securityDeposit?.toString(),
    };

    const _updateUnit: UpdateUnitDto = {
      status: 'OCCUPIED' as const,
    };

    const [lease] = await db.transaction(async (tx) => {
      const [newLease] = await tx
        .insert(leases)
        .values(_createLeaseDto)
        .returning();

      await tx
        .update(units)
        .set(_updateUnit)
        .where(eq(units.id, createLeaseDto.unitId));

      return [newLease];
    });

    return lease;
  }

  async findAll() {
    return db
      .select({
        lease: leases,
        unit: {
          id: units.id,
          address: units.address,
          type: units.type,
        },
        tenant: {
          id: contacts.id,
          firstName: contacts.firstName,
          lastName: contacts.lastName,
          email: contacts.email,
        },
      })
      .from(leases)
      .leftJoin(units, eq(leases.unitId, units.id))
      .leftJoin(contacts, eq(leases.tenantId, contacts.id));
  }

  async findOne(id: number) {
    const [result] = await db
      .select({
        lease: leases,
        unit: {
          id: units.id,
          address: units.address,
          type: units.type,
        },
        tenant: {
          id: contacts.id,
          firstName: contacts.firstName,
          lastName: contacts.lastName,
          email: contacts.email,
        },
      })
      .from(leases)
      .leftJoin(units, eq(leases.unitId, units.id))
      .leftJoin(contacts, eq(leases.tenantId, contacts.id))
      .where(eq(leases.id, id));

    if (!result) {
      throw new NotFoundException(`Lease with ID ${id} not found`);
    }

    return result;
  }

  async update(id: number, updateLeaseDto: UpdateLeaseDto) {
    const [lease] = await db.select().from(leases).where(eq(leases.id, id));

    if (!lease) {
      throw new NotFoundException(`Lease with ID ${id} not found`);
    }

    // If changing unit, verify new unit exists and is vacant
    if (updateLeaseDto.unitId && updateLeaseDto.unitId !== lease.unitId) {
      const [newUnit] = await db
        .select()
        .from(units)
        .where(eq(units.id, updateLeaseDto.unitId));

      if (!newUnit) {
        throw new NotFoundException(
          `Unit with ID ${updateLeaseDto.unitId} not found`,
        );
      }

      if (newUnit.status === 'OCCUPIED') {
        throw new BadRequestException('New unit is already occupied');
      }
    }

    // If changing tenant, verify new tenant exists and is a tenant
    if (updateLeaseDto.tenantId && updateLeaseDto.tenantId !== lease.tenantId) {
      const [newTenant] = await db
        .select()
        .from(contacts)
        .where(
          and(
            eq(contacts.id, updateLeaseDto.tenantId),
            eq(contacts.type, 'TENANT'),
          ),
        );

      if (!newTenant) {
        throw new NotFoundException(
          `Tenant with ID ${updateLeaseDto.tenantId} not found`,
        );
      }
    }

    const _updateLeaseDto = {
      ...updateLeaseDto,
      monthlyRent: updateLeaseDto.monthlyRent.toString(),
      updatedAt: new Date(),
    };

    const [updated] = await db
      .update(leases)
      .set(_updateLeaseDto)
      .where(eq(leases.id, id))
      .returning();

    return updated;
  }

  async remove(id: number) {
    const [lease] = await db.select().from(leases).where(eq(leases.id, id));

    if (!lease) {
      throw new NotFoundException(`Lease with ID ${id} not found`);
    }

    const _updateUnit: UpdateUnitDto = { status: 'VACANT' as const };

    return db.transaction(async (tx) => {
      const [deleted] = await tx
        .delete(leases)
        .where(eq(leases.id, id))
        .returning();

      await tx.update(units).set(_updateUnit).where(eq(units.id, lease.unitId));

      return deleted;
    });
  }
}
