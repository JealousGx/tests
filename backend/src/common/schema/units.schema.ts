import {
  decimal,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { contacts } from './contacts.schema';

export const unitStatusEnum = pgEnum('unit_status', ['VACANT', 'OCCUPIED']);
export const unitTypeEnum = pgEnum('unit_type', [
  'APARTMENT',
  'HOUSE',
  'COMMERCIAL',
]);

export const units = pgTable('units', {
  id: serial('id').primaryKey(),
  type: unitTypeEnum('type').notNull(),
  ownerId: integer('owner_id').references(() => contacts.id),
  address: text('address').notNull(),
  value: decimal('value', { precision: 10, scale: 2 }),
  status: unitStatusEnum('status').default('VACANT'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
