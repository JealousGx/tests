import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { contacts } from '../../common/schema/contacts.schema';
import { units } from '../../common/schema/units.schema';
import { db } from '../../config/database.config';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitsService {
  async create(createUnitDto: CreateUnitDto) {
    // Verify owner exists and is a landlord
    const [owner] = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, createUnitDto.ownerId));

    if (!owner) {
      throw new NotFoundException(
        `Owner with ID ${createUnitDto.ownerId} not found`,
      );
    }

    if (owner.type !== 'LANDLORD') {
      throw new Error('Owner must be a landlord');
    }

    const [unit] = await db.insert(units).values(createUnitDto).returning();
    return unit;
  }

  async findAll() {
    return db
      .select({
        unit: units,
        owner: {
          id: contacts.id,
          firstName: contacts.firstName,
          lastName: contacts.lastName,
          email: contacts.email,
        },
      })
      .from(units)
      .leftJoin(contacts, eq(units.ownerId, contacts.id));
  }

  async findOne(id: number) {
    const [result] = await db
      .select({
        unit: units,
        owner: {
          id: contacts.id,
          firstName: contacts.firstName,
          lastName: contacts.lastName,
          email: contacts.email,
        },
      })
      .from(units)
      .leftJoin(contacts, eq(units.ownerId, contacts.id))
      .where(eq(units.id, id));

    if (!result) {
      throw new NotFoundException(`Unit with ID ${id} not found`);
    }

    return result;
  }

  async findByOwner(ownerId: number) {
    return db.select().from(units).where(eq(units.ownerId, ownerId));
  }

  async update(id: number, updateUnitDto: UpdateUnitDto) {
    if (updateUnitDto.ownerId) {
      const [owner] = await db
        .select()
        .from(contacts)
        .where(eq(contacts.id, updateUnitDto.ownerId));

      if (!owner) {
        throw new NotFoundException(
          `Owner with ID ${updateUnitDto.ownerId} not found`,
        );
      }

      if (owner.type !== 'LANDLORD') {
        throw new Error('Owner must be a landlord');
      }
    }

    const _updateUnitDto = {
      ...updateUnitDto,
      updatedAt: new Date(),
    };

    const [updated] = await db
      .update(units)
      .set(_updateUnitDto)
      .where(eq(units.id, id))
      .returning();

    if (!updated) {
      throw new NotFoundException(`Unit with ID ${id} not found`);
    }

    return updated;
  }

  async remove(id: number) {
    const [deleted] = await db
      .delete(units)
      .where(eq(units.id, id))
      .returning();

    if (!deleted) {
      throw new NotFoundException(`Unit with ID ${id} not found`);
    }

    return deleted;
  }
}
