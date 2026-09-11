import { pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

export const employees = pgTable('employees', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  office: text('office').notNull(),
  position: text('position').notNull(),
  email: text('email'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const tickets = pgTable('tickets', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id').references(() => employees.id).notNull(),
  employeeName: text('employee_name').notNull(),
  office: text('office').notNull(),
  position: text('position').notNull(),
  requestedAt: timestamp('requested_at').notNull(),
  issue: text('issue').notNull(),
  category: text('category').notNull().default('Hardware'),
  deviceKind: text('device_kind').notNull().default(''),
  brand: text('brand'),
  model: text('model'),
  description: text('description').notNull(),
  initialAction: text('initial_action').notNull().default(''),
  resolvedAction: text('resolved_action').notNull().default(''),
  // Kept for backward compatibility with records created before the split action fields.
  action: text('action').notNull().default(''),
  technician: text('technician').notNull().default(''),
  priority: text('priority').notNull().default('Normal'),
  status: text('status').notNull().default('Pending'),
  resolvedAt: timestamp('resolved_at'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export const workspace = pgTable('workspace', {
  id: integer('id').primaryKey(),
  demo: boolean('demo').notNull().default(true),
  agency: text('agency').notNull().default('Philippine Fiber Industry Development Authority'),
  headerGovernment: text('header_government').notNull().default('Republic of the Philippines'),
  headerDepartment: text('header_department').notNull().default('Department of Agriculture'),
  headerAgency: text('header_agency').notNull().default('PHILIPPINE FIBER INDUSTRY DEVELOPMENT AUTHORITY'),
  headerAddress: text('header_address').notNull().default('Purok 1A, Pigdaulan, Butuan City'),
  headerEmail: text('header_email').notNull().default('robutuan@philfida.da.gov.ph'),
  headerWebsite: text('header_website').notNull().default('www.philfida.da.gov.ph'),
  ticketTitle: text('ticket_title').notNull().default('REPAIR REQUEST TICKET'),
  itPersonnelName: text('it_personnel_name').notNull().default('IT Personnel'),
  itPersonnelPosition: text('it_personnel_position').notNull().default('IT Personnel'),
});
