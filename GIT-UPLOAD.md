# Upload the Project to GitHub Using the Terminal

This guide uploads the project source code to a **private GitHub repository**. It does not upload the local PostgreSQL database, `.env` password file, installed packages, or database backups.

You need a free [GitHub account](https://github.com/) and an internet connection.

## 1. Install Git and GitHub CLI

### Windows Command Prompt or PowerShell

Open Command Prompt or PowerShell as administrator and run:

```powershell
winget install --id Git.Git --exact --accept-package-agreements --accept-source-agreements
winget install --id GitHub.cli --exact --accept-package-agreements --accept-source-agreements
```

Close and reopen the terminal, then check the installation:

```powershell
git --version
gh --version
```

### Mac Terminal

If Homebrew was installed during the app setup, run:

```bash
brew install git gh
```

Close and reopen Terminal, then check the installation:

```bash
git --version
gh --version
```

## 2. Open the project folder in the terminal

### Windows

Open the project folder in File Explorer, click the address bar, type `powershell`, and press Enter.

Alternatively:

```powershell
cd C:\PhilFIDA\philfida-it-ticketing-system
```

Change the path if the folder is stored elsewhere.

### Mac

Open Terminal, type `cd ` with a space, drag the project folder into Terminal, and press Return.

For example:

```bash
cd ~/Documents/philfida-it-ticketing-system
```

## 3. Set your Git name and email

Replace the sample details with your own:

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

Use the email connected to your GitHub account. If you do not want your personal email displayed in commits, use the private `noreply` email shown in GitHub → **Settings → Emails**.

## 4. Sign in to GitHub from the terminal

Run:

```bash
gh auth login
```

Choose these options when asked:

1. **GitHub.com**
2. **HTTPS**
3. Authenticate Git with your GitHub credentials: **Yes**
4. **Login with a web browser**

GitHub will display a temporary code. Copy it, press Enter to open the browser, paste the code, and approve access. Never give this code to another person.

Confirm that sign-in worked:

```bash
gh auth status
```

## 5. Prepare the project for its first upload

Run these commands inside the project folder:

```bash
git init
git branch -M main
git add .
git status
```

Carefully inspect the `git status` list before continuing. `.env`, `node_modules`, `.next`, database backups, and database dump files should **not** appear because `.gitignore` excludes them. `.env.example` should appear; it contains only the sample configuration needed by another installer.

Create the first saved version:

```bash
git commit -m "Initial PhilFIDA IT ticketing system"
```

## 6. Create the GitHub repository and upload

Run:

```bash
gh repo create philfida-it-ticketing-system --private --source=. --remote=origin --push
```

This command:

- Creates a private GitHub repository named `philfida-it-ticketing-system`.
- Connects the local project to that repository.
- Uploads the `main` branch.

When it finishes, show the repository address with:

```bash
gh repo view --web
```

Use `--public` instead of `--private` only if the agency has approved making the source code public. The application has no login system and must not be deployed directly to the public internet.

## Upload future changes

After editing the system, open the project folder in the terminal and run:

```bash
git status
git add .
git status
git commit -m "Describe what was changed"
git push
```

Replace the commit message with a short description, for example:

```bash
git commit -m "Update ticket print layout"
```

If Git says `nothing to commit`, there are no new saved changes to upload.

## Download the project on another computer

After installing Git and signing in with `gh auth login`, run:

```bash
gh repo clone YOUR-GITHUB-USERNAME/philfida-it-ticketing-system
cd philfida-it-ticketing-system
```

Replace `YOUR-GITHUB-USERNAME` with the username shown by `gh auth status`. Then follow the first-time setup in `README.md` to create `.env`, install packages, and start a new local database.

> GitHub stores the source code, not the existing ticket records. Transfer records separately using the database backup procedure in `README.md`.

## Common problems

| Message or problem | Solution |
| --- | --- |
| `git` or `gh` is not recognized | Close and reopen the terminal. If it still fails, repeat the installation command. |
| `not a git repository` | Use `cd` to enter the project folder, then retry. |
| `Author identity unknown` | Run the two `git config --global` commands in Step 3. |
| Authentication failed | Run `gh auth login` again and complete browser authorization. |
| Repository name already exists | Choose another name in the `gh repo create` command, or connect the existing repository manually. |
| Push was rejected | Run `git pull --rebase`, resolve any reported conflict, and then run `git push`. Ask IT for help if Git reports a conflict. |

