import { db } from '@/db';
import { employees, tickets, workspace } from '@/db/schema';

export async function initializeWorkspace() {
  await db.transaction(async tx => {
    const inserted = await tx.insert(workspace).values({
      id: 1,
      demo: true,
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
    }).onConflictDoNothing().returning();
    if (!inserted.length) return;
    const people = await tx.insert(employees).values([
      { name: 'Maria Santos', office: 'Administrative Division', position: 'Administrative Officer IV', email: 'maria.santos@example.com' },
      { name: 'Juan Dela Cruz', office: 'Technical Assistance Division', position: 'Fiber Development Officer II' },
      { name: 'Ana Reyes', office: 'Finance Division', position: 'Accountant II' },
      { name: 'Mark Villanueva', office: 'Planning Division', position: 'Planning Officer III' },
      { name: 'Patricia Garcia', office: 'Office of the Executive Director', position: 'Executive Assistant II' },
      { name: 'Jose Mendoza', office: 'Administrative Division', position: 'Administrative Assistant III' },
      { name: 'Carla Bautista', office: 'Finance Division', position: 'Budget Officer II' },
      { name: 'Rafael Ramos', office: 'Technical Assistance Division', position: 'Agriculturist II' },
      { name: 'Isabel Torres', office: 'Planning Division', position: 'Statistician II' },
      { name: 'Miguel Flores', office: 'Research Division', position: 'Science Research Specialist I' },
      { name: 'Sofia Aquino', office: 'Research Division', position: 'Science Research Specialist II' },
      { name: 'Paolo Rivera', office: 'Administrative Division', position: 'Supply Officer II' },
    ]).returning();
    const issues = [
      ['Unable to connect to office Wi-Fi', 'Network', 'Laptop cannot connect to the office wireless network. Other devices are connected normally.', 'Lenovo', 'ThinkPad E14'],
      ['Printer not responding', 'Hardware', 'Shared printer does not respond to print jobs. Please check the connection and print queue.', 'Epson', 'L3210'],
      ['Desktop running slowly', 'Hardware', 'Workstation takes a long time to start and freezes while opening documents.', 'Dell', 'OptiPlex 3080'],
      ['Microsoft Office activation', 'Software', 'Office applications show an activation notification and cannot edit documents.', '', ''],
      ['Email access assistance', 'Account & Access', 'Unable to access agency email. Password reset assistance is requested.', '', ''],
      ['Monitor display flickering', 'Hardware', 'External monitor intermittently flickers during regular use.', 'Samsung', 'S24R350'],
      ['Document scanner setup', 'Software', 'Install and configure the scanner application on the workstation.', 'Canon', 'LiDE 300'],
    ];
    await tx.insert(tickets).values(Array.from({ length: 48 }, (_, i) => {
      const p = people[i % people.length];
      const issue = issues[i % issues.length];
      const date = new Date(); date.setDate(date.getDate() - Math.floor((47 - i) * 0.57)); date.setHours(8 + i % 8, (i * 13) % 60, 0, 0);
      if(date > new Date()) date.setTime(Date.now() - (48-i)*60000);
      const status = i < 30 ? 'Resolved' : i < 38 ? 'In progress' : i === 38 ? 'Cancelled' : 'Pending';
      const initialAction = status === 'In progress' ? 'Initial assessment completed. Troubleshooting is in progress.' : '';
      const resolvedAction = status === 'Resolved' ? 'Inspected the device, applied the appropriate configuration, and tested functionality with the requesting employee. Issue resolved.' : '';
      return { employeeId: p.id, employeeName: p.name, office: p.office, position: p.position, requestedAt: date, issue: issue[0], category: issue[1], description: issue[2], brand: issue[3], model: issue[4], status, priority: i % 7 === 0 ? 'High' : 'Normal', initialAction, resolvedAction, action: resolvedAction || initialAction, technician: status === 'Pending' ? '' : 'IT Support', resolvedAt: status === 'Resolved' ? new Date(date.getTime() + 7200000) : null };
    }));
  });
}
