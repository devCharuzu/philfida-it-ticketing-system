# PhilFIDA IT Ticketing System

A private, local web application for recording employees, managing IT support requests, monitoring ticket status, and printing the official IT Request Form. The web app and PostgreSQL database run on the same computer; no cloud database or online account is required.

> Internet access is needed only during the first installation to download Node.js, Docker, and the app packages. Do not publish this app to the public internet because it has no login screen.

## What the system can do

- Register employees and their office, position, and contact details.
- Create, search, filter, edit, and monitor IT requests.
- Record the device, concern, priority, technician, initial action, and status.
- Allow a Resolved Action only when the ticket status is **Resolved**.
- Show dashboard and analytics summaries and export reports as CSV.
- Print two copies of the official request form on one A4 landscape page.
- Highlight the resolved status and action on resolved printed tickets.
- Change the regional/office print header and IT personnel name and position in **Settings**.
- Export a JSON copy of the stored records.

## Prerequisites

Install these two programs before running the system:

1. **Node.js 22 or newer (LTS)** — runs the web application and includes `npm`.
2. **Docker Desktop** — runs the local PostgreSQL database.

Recommended computer requirements are Windows 10/11 or a currently supported macOS version, 8 GB RAM, several GB of free disk space, and permission to install applications.

## Install the prerequisites on Windows

Use **Command Prompt** or **PowerShell**. To open one, press the Windows key, type `cmd` or `PowerShell`, then choose **Run as administrator**.

### 1. Install Node.js and Docker Desktop

Enter these commands one at a time:

```powershell
winget install --id OpenJS.NodeJS.LTS --exact --accept-package-agreements --accept-source-agreements
winget install --id Docker.DockerDesktop --exact --accept-package-agreements --accept-source-agreements
```

Approve any Windows permission message that appears. Restart the computer if Docker requests it. Then open **Docker Desktop**, accept its terms, use the recommended **WSL 2** option, and wait until Docker reports that it is running.

If Windows says `winget` is not recognized, install or update **App Installer** from the Microsoft Store, reopen Command Prompt, and retry. The manual fallback is the [Node.js download page](https://nodejs.org/en/download) and the [Docker Desktop Windows guide](https://docs.docker.com/desktop/setup/install/windows-install/).

### 2. Check the installation

Close and reopen Command Prompt or PowerShell, then enter:

```powershell
node --version
npm --version
docker --version
docker info
```

The first command should show `v22` or a higher version. `docker info` should finish without a “cannot connect” error.

## Install the prerequisites on Mac

Use the **Terminal** application. Open Spotlight with **Command+Space**, type `Terminal`, and press Return.

### 1. Install Homebrew

Homebrew is a trusted command-line installer for Mac applications. Paste this official installation command into Terminal and press Return:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

The installer explains what it will change before continuing. Enter the Mac administrator password if requested; the password will not appear while you type. At the end, Homebrew may display one or two commands under **Next steps**. Copy and run those commands so that `brew` works in new Terminal windows.

### 2. Install Node.js and Docker Desktop

Close and reopen Terminal, then run:

```bash
brew install node@22
brew install --cask docker-desktop
echo 'export PATH="$(brew --prefix node@22)/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

The last two commands make Node.js available in the current and future Terminal windows.

Open Docker Desktop from Terminal:

```bash
open -a Docker
```

Approve any macOS permission messages, accept Docker's terms, and wait until Docker reports that it is running. The manual fallback is the [Docker Desktop Mac guide](https://docs.docker.com/desktop/setup/install/mac-install/).

### 3. Check the installation

Open **Terminal** and enter:

```bash
node --version
npm --version
docker --version
docker info
```

The first command should show `v22` or a higher version. `docker info` should finish without a connection error.

## First-time system setup

Keep the project folder in a permanent location, for example:

- Windows: `C:\PhilFIDA\philfida-it-ticketing-system`
- Mac: `Documents/philfida-it-ticketing-system`

### Windows

1. Open the project folder in File Explorer.
2. Click the address bar, type `powershell`, and press Enter. PowerShell will open in that folder.
3. Run these commands one at a time:

```powershell
Copy-Item .env.example .env
npm install
npm run db:up
npm run db:push
npm run dev
```

### Mac

1. Open Terminal.
2. Type `cd ` including the space, drag the project folder into Terminal, and press Return.
3. Run these commands one at a time:

```bash
cp .env.example .env
npm install
npm run db:up
npm run db:push
npm run dev
```

What the commands do:

- Copy the app's local settings file.
- Download the required app packages.
- Start the local PostgreSQL database.
- Create or update the database tables.
- Start the web application.

When Terminal or PowerShell displays a local address, open [http://127.0.0.1:3000](http://127.0.0.1:3000) in Chrome, Edge, Safari, or Firefox. Keep that Terminal/PowerShell window open while using the app.

## First use

1. Open **Settings → Print header & IT personnel**.
2. Enter the correct region/office header, address, contact details, IT personnel name, and position; then save.
3. If fictional sample records are present, review them and use **Clear sample workspace** before adding real records. Clearing is permanent.
4. Open **Employees** and register the employees who may submit requests.
5. Open **Requests** and create the first ticket.

For each request, enter the Initial Action normally. To enter a Resolved Action, first change the status to **Resolved**; the resolved action then becomes required.

## Daily start and stop

First, open Docker Desktop and wait for it to start. Then open PowerShell/Terminal in the project folder and run:

```bash
npm run db:up
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

To stop the web app, return to PowerShell/Terminal and press **Ctrl+C**. To also stop the database, run:

```bash
npm run db:down
```

Stopping the database does **not** delete its records.

## Print a request ticket

1. Open a saved request and save any final changes.
2. Select **Print saved ticket**.
3. In the browser print window, use:
   - Paper: **A4**
   - Orientation: **Landscape**
   - Scale: **100%**
   - Margins: **None** or the browser's minimum setting
   - Browser headers and footers: **Off**
4. Print or choose **Save as PDF**.

The page contains only the two copies of the supplied reference form. A resolved ticket prints its Status and Resolved Action with emphasis.

## Back up the records

For the simplest record copy, open **Settings** and download the JSON archive. Store it in an agency-approved secure location because it may contain personnel information. The JSON file is an export for safekeeping and review; it is not currently an automatic in-app restore file.

For a complete database backup, run these commands from the project folder:

```bash
docker exec philfida-postgres pg_dump -U philfida -d philfida_it -Fc -f /tmp/philfida-it.backup
docker cp philfida-postgres:/tmp/philfida-it.backup ./philfida-it.backup
```

This creates `philfida-it.backup` in the project folder. Copy it to secure backup storage.

## Common problems

| Problem | What to do |
| --- | --- |
| `node` or `npm` is not recognized | Close and reopen PowerShell/Terminal. If it still fails, reinstall Node.js LTS. |
| Docker cannot connect | Open Docker Desktop and wait until it says Docker is running, then retry `npm run db:up`. |
| Database connection error | Run `npm run db:up`, wait a few seconds, and refresh the browser. |
| Port 3000 is already in use | Run `npm run dev -- --port 3001`, then open `http://127.0.0.1:3001`. |
| Port 5432 is already in use | Another PostgreSQL service is running. Stop that service or ask the local IT administrator to change the database port. |
| App was updated and no longer starts | Run `npm install`, then `npm run db:push`, then `npm run dev`. |
| Printout includes a URL, date, or page number | Turn off **Headers and footers** in the browser print settings. |

## Optional production-style run

For normal long-running use without development messages:

```bash
npm run build
npm run start -- --hostname 127.0.0.1
```

After a computer restart, start Docker Desktop, run `npm run db:up`, and then run the `npm run start` command again.

## Safety notes

- Keep the app on the assigned computer or a trusted internal network.
- Do not expose port 3000 or port 5432 to the public internet.
- Back up regularly before updates or major data changes.
- Never delete the Docker volume named `philfida_pgdata` unless you intentionally want to erase the database.

## Upload the source code to GitHub

See [GIT-UPLOAD.md](GIT-UPLOAD.md) for a beginner-friendly Windows and Mac tutorial that uses Command Prompt, PowerShell, or Terminal.
