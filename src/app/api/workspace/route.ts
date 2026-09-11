import { NextResponse } from 'next/server';
import { db } from '@/db';
import { employees, tickets, workspace } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { initializeWorkspace } from '@/lib/workspace';

export const dynamic = 'force-dynamic';

const defaults = {
  agency: 'Philippine Fiber Industry Development Authority',
  headerGovernment: 'Republic of the Philippines',
  headerDepartment: 'Department of Agriculture',
  headerAgency: 'PHILIPPINE FIBER INDUSTRY DEVELOPMENT AUTHORITY',
  headerAddress: 'Purok 1A, Pigdaulan, Butuan City',
  headerEmail: 'robutuan@philfida.da.gov.ph',
  headerWebsite: 'www.philfida.da.gov.ph',
  ticketTitle: 'REPAIR REQUEST TICKET',
  itPersonnelName: 'IT Personnel',
  itPersonnelPosition: 'IT Personnel',
};

const categories = ['Hardware', 'Software', 'Network', 'Account & Access', 'Other'];
const statuses = ['Pending', 'In progress', 'Resolved', 'Cancelled'];
const priorities = ['Low', 'Normal', 'High', 'Urgent'];
const clean = (value: unknown, max = 5000) => typeof value === 'string' ? value.trim().slice(0, max) : '';

export async function GET() {
  try {
    await initializeWorkspace();
    const [people, requests, settings] = await Promise.all([
      db.select().from(employees).orderBy(employees.name),
      db.select().from(tickets).orderBy(desc(tickets.requestedAt), desc(tickets.id)),
      db.select().from(workspace),
    ]);
    const config = settings[0];
    const normalizedRequests = requests.map(ticket => ({
      ...ticket,
      initialAction: ticket.initialAction || (ticket.status === 'Resolved' ? '' : ticket.action),
      resolvedAction: ticket.resolvedAction || (ticket.status === 'Resolved' ? ticket.action : ''),
    }));
    return NextResponse.json({
      employees: people,
      tickets: normalizedRequests,
      demo: config?.demo ?? false,
      agency: config?.headerAgency ?? config?.agency ?? defaults.agency,
      headerGovernment: config?.headerGovernment ?? defaults.headerGovernment,
      headerDepartment: config?.headerDepartment ?? defaults.headerDepartment,
      headerAgency: config?.headerAgency ?? defaults.headerAgency,
      headerAddress: config?.headerAddress ?? defaults.headerAddress,
      headerEmail: config?.headerEmail || defaults.headerEmail,
      headerWebsite: config?.headerWebsite ?? defaults.headerWebsite,
      ticketTitle: config?.ticketTitle ?? defaults.ticketTitle,
      itPersonnelName: config?.itPersonnelName ?? defaults.itPersonnelName,
      itPersonnelPosition: config?.itPersonnelPosition ?? defaults.itPersonnelPosition,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Unable to connect to the local database. Please try again.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
    }

    if (body.entity === 'settings') {
      await initializeWorkspace();
      const values = {
        agency: clean(body.headerAgency, 250) || defaults.headerAgency,
        headerGovernment: clean(body.headerGovernment, 250) || defaults.headerGovernment,
        headerDepartment: clean(body.headerDepartment, 250) || defaults.headerDepartment,
        headerAgency: clean(body.headerAgency, 250) || defaults.headerAgency,
        headerAddress: clean(body.headerAddress, 250),
        headerEmail: clean(body.headerEmail, 250) || defaults.headerEmail,
        headerWebsite: clean(body.headerWebsite, 250),
        ticketTitle: clean(body.ticketTitle, 120) || defaults.ticketTitle,
        itPersonnelName: clean(body.itPersonnelName, 150) || defaults.itPersonnelName,
        itPersonnelPosition: clean(body.itPersonnelPosition, 150) || defaults.itPersonnelPosition,
      };
      const [result] = await db.update(workspace).set(values).where(eq(workspace.id, 1)).returning();
      if (!result) return NextResponse.json({ error: 'Workspace settings not found.' }, { status: 404 });
      return NextResponse.json(result);
    }

    if (body.entity === 'employee') {
      const values = { name: clean(body.name, 150), office: clean(body.office, 200), position: clean(body.position, 200), email: clean(body.email, 200) };
      if (!values.name || !values.office || !values.position) return NextResponse.json({ error: 'Name, office, and position are required.' }, { status: 400 });
      const result = body.id ? await db.update(employees).set(values).where(eq(employees.id, Number(body.id))).returning() : await db.insert(employees).values(values).returning();
      if (!result.length) return NextResponse.json({ error: 'Employee not found.' }, { status: 404 });
      return NextResponse.json(result[0]);
    }

    if (body.entity === 'ticket') {
      const [person] = await db.select().from(employees).where(eq(employees.id, Number(body.employeeId) || 0));
      if (!person) return NextResponse.json({ error: 'Please select a registered employee.' }, { status: 400 });
      const date = new Date(String(body.requestedAt ?? ''));
      if (!clean(body.issue, 200) || !clean(body.description) || isNaN(date.getTime())) return NextResponse.json({ error: 'Request date, issue, and description are required.' }, { status: 400 });

      const status = clean(body.status, 30) || 'Pending';
      if (!statuses.includes(status)) return NextResponse.json({ error: 'Invalid ticket status.' }, { status: 400 });
      const priority = clean(body.priority, 30) || 'Normal';
      if (!priorities.includes(priority)) return NextResponse.json({ error: 'Invalid priority.' }, { status: 400 });
      const category = clean(body.category, 50) || 'Hardware';
      if (!categories.includes(category)) return NextResponse.json({ error: 'Invalid request category.' }, { status: 400 });

      const legacyAction = clean(body.action);
      const initialAction = clean(body.initialAction ?? (status === 'Resolved' ? '' : legacyAction));
      const resolvedAction = status === 'Resolved' ? clean(body.resolvedAction ?? (body.initialAction === undefined ? legacyAction : '')) : '';
      if (status === 'Resolved' && !resolvedAction) return NextResponse.json({ error: 'Record the resolved action before resolving this request.' }, { status: 400 });

      const values = {
        employeeId: person.id,
        employeeName: person.name,
        office: person.office,
        position: person.position,
        requestedAt: date,
        issue: clean(body.issue, 200),
        description: clean(body.description),
        category,
        deviceKind: clean(body.deviceKind, 100),
        brand: clean(body.brand, 100),
        model: clean(body.model, 100),
        initialAction,
        resolvedAction,
        action: resolvedAction || initialAction,
        technician: clean(body.technician, 150),
        priority,
        status,
        updatedAt: new Date(),
        resolvedAt: status === 'Resolved' ? new Date() : null,
      };

      if (body.id) {
        const [old] = await db.select().from(tickets).where(eq(tickets.id, Number(body.id)));
        if (!old) return NextResponse.json({ error: 'Ticket not found.' }, { status: 404 });
        if (old.employeeId === person.id) {
          values.employeeName = old.employeeName;
          values.office = old.office;
          values.position = old.position;
        }
        if (old.status === 'Resolved' && status === 'Resolved') values.resolvedAt = old.resolvedAt;
        const [result] = await db.update(tickets).set(values).where(eq(tickets.id, old.id)).returning();
        return NextResponse.json(result);
      }

      const [result] = await db.insert(tickets).values(values).returning();
      return NextResponse.json(result);
    }

    if (body.entity === 'clear-demo') {
      await initializeWorkspace();
      await db.transaction(async tx => {
        const [settings] = await tx.select().from(workspace).where(eq(workspace.id, 1)).for('update');
        if (!settings?.demo) throw new Error('Sample workspace has already been cleared.');
        await tx.delete(tickets);
        await tx.delete(employees);
        await tx.update(workspace).set({ demo: false }).where(eq(workspace.id, 1));
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown operation.' }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Could not save your changes. Please refresh and try again.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const id = Number(new URL(request.url).searchParams.get('id'));
    if (!id) return NextResponse.json({ error: 'Employee ID is required.' }, { status: 400 });
    const related = await db.select({ id: tickets.id }).from(tickets).where(eq(tickets.employeeId, id)).limit(1);
    if (related.length) return NextResponse.json({ error: 'This employee has ticket history and cannot be deleted. You can still edit their details.' }, { status: 409 });
    const deleted = await db.delete(employees).where(eq(employees.id, id)).returning({ id: employees.id });
    if (!deleted.length) return NextResponse.json({ error: 'Employee not found.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Unable to delete employee.' }, { status: 500 });
  }
}
