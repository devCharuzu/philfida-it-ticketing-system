# PhilFIDA IT Ticketing System

This is a local-only web application. The browser talks to a Next.js server running on the same computer, and that server stores records in PostgreSQL running on the same computer (directly or in a local Docker container). There are no accounts, cloud APIs, hosted database, or external runtime services.

## What the system does

- Opens with a PhilFIDA welcome page and a dashboard overview.
- Registers employees with their name, unit/office, position, and optional email.
- Creates IT requests for registered employees.
- Records request date, concern, category, device brand/model, description, priority, technician, initial action, resolved action, and status.
- Tracks requests as Pending, In progress, Resolved, or Cancelled.
- Preserves the employee details copied onto an existing ticket, so historical records remain accurate when the directory changes.
- Searches tickets and employees, filters requests by status or office, and pages longer lists.
- Shows pending-request notifications and refreshes from the local database every five seconds.
- Shows weekly and monthly dashboard/analytics views, request trends, status breakdowns, office totals, resolution rate, and service insights.
- Prints a saved ticket as two matching copies on one landscape A4 page using the supplied PhilFIDA logo and the reference layout from `TICKET REQ. FORMAT.docx`.
- Keeps the resolved action disabled until a request is set to Resolved, requires that action before saving a resolved request, and highlights the Status and Resolved Action areas in the printed ticket.
- Lets the operator edit the print header for another region or office, plus the IT personnel name and position, from Settings.
- Prints an analytics report and exports the selected reporting period as CSV.
- Exports a JSON archive of employees and tickets from Settings.
- Starts with clearly labelled fictional sample data and lets the operator clear it once before entering real records.
- Provides a Help panel, local connection status, and automatic reconnect messaging.

## Prerequisites

Required:

- Node.js 22 or newer and npm
- One local PostgreSQL 15+ server, either:
  - Docker Desktop or Colima (the easiest repeatable setup), or
  - PostgreSQL installed directly on the computer

The application is intentionally unauthenticated. Use it on the IT computer or a trusted internal network only. Do not expose it to the public internet.

## Recommended setup: local PostgreSQL in Docker

From the project folder:

```bash
cp .env.example .env
npm install
npm run db:up
npm run db:push
```

The `db:up` helper starts a local `postgres:16-alpine` container named `philfida-postgres`, binds it to `127.0.0.1:5432`, and stores its data in the named local Docker volume `philfida_pgdata`. The default development password is only for local setup. For real agency use, change `POSTGRES_PASSWORD` and the matching password in `DATABASE_URL` in `.env` before the first database start.

If port 5432 is already in use, either stop the other PostgreSQL service or change the published port in `scripts/local-db.mjs` and the port in `DATABASE_URL` in `.env` to match.

## Alternative setup: PostgreSQL installed directly

Start PostgreSQL, then create a dedicated local database user and database. For example, from a terminal where `psql` is available:

```bash
psql -h 127.0.0.1 -U postgres -d postgres
```

Run this SQL at the `psql` prompt, replacing the password with a strong local password:

```sql
CREATE USER philfida WITH PASSWORD 'replace-with-a-strong-local-password';
CREATE DATABASE philfida_it OWNER philfida;
\q
```

Then copy the environment template and update the connection string:

```bash
cp .env.example .env
```

Set `DATABASE_URL` in `.env` to:

```text
postgresql://philfida:replace-with-a-strong-local-password@127.0.0.1:5432/philfida_it
```

Install dependencies and create/update the application tables:

```bash
npm install
npm run db:push
```

## Run the web app

For development with automatic refresh:

```bash
npm run dev
```

For a production-style local run:

```bash
npm run build
npm run start -- --hostname 127.0.0.1
```

Open [http://127.0.0.1:3000/welcome](http://127.0.0.1:3000/welcome). The root address [http://127.0.0.1:3000](http://127.0.0.1:3000) opens the dashboard directly.

Keep the database and web process running together. After a computer restart, start Docker/PostgreSQL first and then start the web app.

## First launch

The first successful request to the app initializes the workspace row and inserts fictional sample employees and requests. The tables themselves are created by `npm run db:push`. Before entering actual employee information:

1. Open Settings.
2. Download the JSON archive if you want to keep the sample data.
3. Choose Clear sample workspace and confirm the exact record counts.
4. Add real employees, then create requests from the registered directory.

Clearing is permanent and will not recreate the sample data. It removes all employees and requests present while the workspace is in sample mode, including records manually added to that sample workspace.

## Configure the printed ticket

Open **Settings → Print header & IT personnel** and edit the government line, department line, agency line, address, email, website, ticket title, IT personnel name, and IT personnel position. Save the form before printing. The logo is bundled at `public/philfida-logo.png`; the application uses its green and orange palette throughout the interface and printed ticket.

The ticket printout follows the supplied Word reference: one A4 landscape sheet, two side-by-side copies, the dynamic government/agency header, request fields, separate Initial Action and Resolved Action areas, and plain requester/IT personnel names with positions. There are no added field borders, signature rules, copy captions, or app footers. The only divider is the vertical line in the reference. Resolved values use bold text; a non-resolved ticket prints an empty Resolved Action area. Device Kind is entered separately from the support category (for example, “Laptop” rather than “Hardware”).

## Useful commands

```bash
npm run typecheck  # TypeScript validation
npm run lint       # ESLint validation
npm run build      # Production build
npm run db:push    # Create/update local PostgreSQL tables
npm run db:down    # Stop the Docker PostgreSQL container; keeps its volume
```

To permanently remove the Docker database volume, use `docker volume rm philfida_pgdata`. This deletes local database data and should only be done when intentionally resetting the installation.

## Backup and restore

The Settings JSON download is useful for records and external processing, but it is not an in-app database restore file. It contains personnel information and must be stored securely.

For a complete PostgreSQL backup:

```bash
pg_dump -Fc -h 127.0.0.1 -U philfida -d philfida_it -f philfida-it.backup
```

Restore into a new empty database:

```bash
pg_restore -h 127.0.0.1 -U philfida -d philfida_it_restore philfida-it.backup
```

Update `DATABASE_URL` to the restored database and restart the web app. Back up regularly to agency-approved encrypted storage and test restores before relying on them.

## Printing

Open a saved request and choose **Print saved ticket**. Save edits before printing. Use A4 paper, landscape orientation, 100% scale, and no additional margins. The template includes its own spacing on the full sheet. Browser headers and footers should be disabled so the browser does not add a URL, date, title, or page number. The browser can also save the print preview as PDF. The bundled local fonts preserve the reference typography without an internet connection.

Analytics printing uses the currently selected weekly/monthly period and includes office totals plus the request register.
