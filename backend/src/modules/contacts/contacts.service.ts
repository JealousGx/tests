import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { contacts } from '../../common/schema/contacts.schema';
import { db } from '../../config/database.config';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  async create(createContactDto: CreateContactDto) {
    const [contact] = await db
      .insert(contacts)
      .values(createContactDto)
      .returning();
    return contact;
  }

  async findAll() {
    return db.select().from(contacts);
  }

  async findOne(id: number) {
    const [contact] = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, id));
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return contact;
  }

  async update(id: number, updateContactDto: UpdateContactDto) {
    const _updateContactDto = { ...updateContactDto, updatedAt: new Date() };

    const [updated] = await db
      .update(contacts)
      .set(_updateContactDto)
      .where(eq(contacts.id, id))
      .returning();

    if (!updated) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return updated;
  }

  async remove(id: number) {
    const [deleted] = await db
      .delete(contacts)
      .where(eq(contacts.id, id))
      .returning();

    if (!deleted) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return deleted;
  }
}
