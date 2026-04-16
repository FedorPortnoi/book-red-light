# New Project Init — Codex Instructions

When Fedor says "init new project [name]" or "create project [name]"
follow these exact steps:

BEFORE STARTING: Read C:\Users\fedor\Documents\Fedor's Brain\00 - Team Brain\AGENTS.md

1. CREATE LOCAL FOLDER
   mkdir C:\Users\fedor\[name]
   cd C:\Users\fedor\[name] && git init
   Create .gitignore: .env, .env.local, node_modules/, __pycache__/, *.pyc,
   .DS_Store, *.session, data/leaks/, dist/, build/, *.db

2. CREATE GITHUB REPO
   Read GITHUB_TOKEN from C:\Users\fedor\.claude\.env
   POST https://api.github.com/user/repos
   Body: {"name":"[name]","private":true,"auto_init":false}
   Auth: Bearer $GITHUB_TOKEN
   Stop and report if this fails.

3. WIRE REMOTE
   git remote add origin git@github.com:FedorPortnoi/[name].git

4. FIND NEXT VAULT NUMBER
   List C:\Users\fedor\Documents\Fedor's Brain\
   Find highest XX prefix, add 1, zero-pad to 2 digits

5. CREATE CLAUDE.md IN PROJECT ROOT
   Point to Team Brain vault and project vault folder

6. CREATE OBSIDIAN STRUCTURE
   C:\Users\fedor\Documents\Fedor's Brain\[XX] - [name]\
   Subfolders: Architecture/ Dev Logs/ Roadmap/ History/
   Files: [name] HQ.md, Architecture/System Overview.md,
          Roadmap/Active TODOs.md, History/Changelog.md,
          Dev Logs/[TODAY].md

7. UPDATE AGENTS.md
   Add project row to Projects table

8. INITIAL COMMIT
   git add -A
   git commit -m "init: [name] initialized with Fedor Brain system"
   git push -u origin master

9. REPORT
   Project name, local path, GitHub URL, Obsidian folder, date

ONGOING WORKFLOW (every session):
- Read AGENTS.md + project HQ + latest dev log before starting
- After every significant change: update relevant Obsidian note + push to GitHub
- Write dev log entry at end of session
- Never commit: .env, *.session, data/leaks/, *.db production files
- Follow truth hierarchy from Off-Repo Truth Handoff
