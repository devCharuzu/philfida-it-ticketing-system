import Image from 'next/image';

type PrintSettings = {
  headerGovernment: string; headerDepartment: string; headerAgency: string;
  headerAddress: string; headerEmail: string; headerWebsite: string; ticketTitle: string;
  itPersonnelName: string; itPersonnelPosition: string;
};
type PrintTicket = {
  id: number; requestedAt: string; employeeName: string; position: string; office: string;
  deviceKind?: string; brand: string | null; model: string | null; issue: string;
  description: string; priority: string; initialAction: string; resolvedAction: string; status: string;
};

// Coordinates are in millimetres, measured against the supplied A4 Word reference.
// Keep this isolated from the application's dashboard and analytics print styles.
export function RepairTicketCopy({ ticket, data }: { ticket: PrintTicket; data: PrintSettings }) {
  const number = `IT-${new Date(ticket.requestedAt).getFullYear()}-${String(ticket.id).padStart(4, '0')}`;
  const field = (name: string, value: string | null | undefined, top: number, extra = '') =>
    <div className={`rq-field ${extra}`} style={{ top: `${top}mm` }}><span>{name}</span>{value && <span className="rq-value">{value}</span>}</div>;
  return <section className="rq-copy">
    <Image className="rq-logo" src="/philfida-logo.png" alt="" width={109} height={103} unoptimized loading="eager"/>
    <header className="rq-header">
      <div>{data.headerGovernment}</div>
      <div>{data.headerDepartment}</div>
      <div className="rq-agency">{data.headerAgency}</div>
      <div>{data.headerAddress}</div>
      <div>{data.headerEmail && <>Email: <span className="rq-link">{data.headerEmail}</span></>}{data.headerEmail && data.headerWebsite && ', '}{data.headerWebsite && <>Website: <span className="rq-link">{data.headerWebsite}</span></>}</div>
    </header>
    <h1 className="rq-title">{data.ticketTitle}</h1>
    <div className="rq-body">
      {field('No.', number, 0, 'rq-number')}
      {field('Date:', new Date(ticket.requestedAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }), 0, 'rq-date')}
      {field('Requester:', ticket.employeeName, 13.6)}
      {field('Position:', ticket.position, 18.2)}
      {field('Unit/Office:', ticket.office, 22.7)}
      {field('Device Kind:', ticket.deviceKind, 31.8)}
      {field('Brand:', ticket.brand, 40.9, 'rq-brand')}
      {field('Model:', ticket.model, 40.9, 'rq-model')}
      {field('Issue:', ticket.issue, 50, 'rq-issue')}
      {field('Description:', ticket.description, 63.6, 'rq-description')}
      {field('Priority:', ticket.priority, 81.8)}
      {field('Initial Action:', ticket.initialAction, 90.9, 'rq-initial')}
      {field('Status:', ticket.status, 100, ticket.status === 'Resolved' ? 'rq-resolved-status' : '')}
      {field('Resolved Action:', ticket.status === 'Resolved' ? ticket.resolvedAction : '', 109.1, 'rq-resolution')}
      <div className="rq-signatures"><div>{ticket.employeeName || '[Requesting Employee Name]'}<br/>{ticket.position || 'Position'}</div><div>{data.itPersonnelName || '[IT Personnel Name]'}<br/>{data.itPersonnelPosition || 'Position'}</div></div>
    </div>
  </section>;
}
