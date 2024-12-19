import {
  decimal,
  integer,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { contacts } from './contacts.schema';
import { units } from './units.schema';

export const leases = pgTable('leases', {
  id: serial('id').primaryKey(),
  unitId: integer('unit_id')
    .references(() => units.id)
    .notNull(),
  tenantId: integer('tenant_id')
    .references(() => contacts.id)
    .notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  monthlyRent: decimal('monthly_rent', { precision: 10, scale: 2 }).notNull(),
  securityDeposit: decimal('security_deposit', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
