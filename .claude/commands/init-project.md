You are initializing a brand new project called $ARGUMENTS.
Follow these steps in exact order. Do not skip any step.

STEP 1 — READ TEAM BRAIN
Read C:\Users\fedor\Documents\Fedor's Brain\00 - Team Brain\AGENTS.md
Confirm you understand the shared workflow before proceeding.

STEP 2 — CREATE LOCAL PROJECT FOLDER
Create C:\Users\fedor\$ARGUMENTS\
Run: git init C:\Users\fedor\$ARGUMENTS\
Create C:\Users\fedor\$ARGUMENTS\.gitignore with:
.env
.env.local
node_modules/
__pycache__/
*.pyc
.DS_Store
*.session
data/leaks/
dist/
build/
*.db
*.heapsnapshot

STEP 3 — CREATE GITHUB REPO VIA API
Read GITHUB_TOKEN from C:\Users\fedor\.claude\.env
Make this API call:
curl -X POST https://api.github.com/user/repos \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"$ARGUMENTS","private":true,"description":"Initialized via Fedor Brain system","auto_init":false}'
If successful note the SSH clone URL.
If it fails report the exact error and stop — do not continue.

STEP 4 — WIRE GIT REMOTE
cd C:\Users\fedor\$ARGUMENTS
git remote add origin git@github.com:FedorPortnoi/$ARGUMENTS.git

STEP 5 — SETUP SSH KEY IF NEEDED
Check if C:\Users\fedor\.ssh\id_ed25519 exists.
If it does not exist, generate it:
ssh-keygen -t ed25519 -C "axtinas@yandex.ru" -f C:\Users\fedor\.ssh\id_ed25519 -N ""
Then display the public key and instruct Fedor to add it to GitHub at:
https://github.com/settings/keys
Wait for confirmation before continuing.

STEP 6 — DETERMINE NEXT VAULT FOLDER NUMBER
List all folders in C:\Users\fedor\Documents\Fedor's Brain\
Find the highest XX number prefix across all folders (00, 01, 02, 03...)
Assign NEXT_NUMBER = highest + 1, zero-padded to 2 digits
Example: if 03 - VIKITAY is the highest, NEXT_NUMBER = 04

STEP 7 — CREATE MINIMAL CLAUDE.md IN PROJECT
Create C:\Users\fedor\$ARGUMENTS\CLAUDE.md:

## Team Brain
Read before starting any session:
1. C:\Users\fedor\Documents\Fedor's Brain\00 - Team Brain\AGENTS.md
2. C:\Users\fedor\Documents\Fedor's Brain\00 - Team Brain\Off-Repo Truth Handoff.md
Follow the shared workflow in AGENTS.md.

## Brain
Vault: C:\Users\fedor\Documents\Fedor's Brain\
Project vault folder: [NEXT_NUMBER] - $ARGUMENTS\
Before any task: run /brain
After any significant change: run /log
Never ask what we're working on — read the vault first

## Key Info
Local path: C:\Users\fedor\$ARGUMENTS\
GitHub: https://github.com/FedorPortnoi/$ARGUMENTS

STEP 8 — CREATE OBSIDIAN VAULT FOLDER
Create this exact structure:
C:\Users\fedor\Documents\Fedor's Brain\[NEXT_NUMBER] - $ARGUMENTS\
C:\Users\fedor\Documents\Fedor's Brain\[NEXT_NUMBER] - $ARGUMENTS\Architecture\
C:\Users\fedor\Documents\Fedor's Brain\[NEXT_NUMBER] - $ARGUMENTS\Dev Logs\
C:\Users\fedor\Documents\Fedor's Brain\[NEXT_NUMBER] - $ARGUMENTS\Roadmap\
C:\Users\fedor\Documents\Fedor's Brain\[NEXT_NUMBER] - $ARGUMENTS\History\

Create these files:

FILE: [NEXT_NUMBER] - $ARGUMENTS\$ARGUMENTS HQ.md
---
# $ARGUMENTS HQ

> Initialized: [TODAY'S DATE] | Status: 🚧 New Project

---

## Quick Navigation
| Section | Note |
|---|---|
| 🏗️ Architecture | [[Architecture/System Overview]] |
| 📋 Roadmap | [[Roadmap/Active TODOs]] |
| 📜 History | [[History/Changelog]] |
| 📅 Dev Logs | [[Dev Logs/[TODAY'S DATE]]] |

---

## Status Snapshot
- **Created:** [TODAY'S DATE]
- **GitHub:** https://github.com/FedorPortnoi/$ARGUMENTS
- **Local path:** C:\Users\fedor\$ARGUMENTS\
- **Stack:** [FEDOR TO FILL]
- **Purpose:** [FEDOR TO FILL]
- **Live URL:** [FEDOR TO FILL]

---

## Active Blockers
- None yet — project just initialized

---

## Team Brain
[[00 - Team Brain/AGENTS]] · [[00 - Team Brain/Off-Repo Truth Handoff]]
---

FILE: [NEXT_NUMBER] - $ARGUMENTS\Architecture\System Overview.md
---
# System Overview — $ARGUMENTS

> [!note] Auto-generated on init. Fill in as project develops.

## Purpose
[FEDOR TO FILL]

## Tech Stack
[FEDOR TO FILL]

## Structure
[Will auto-populate as CC works on the project]
---

FILE: [NEXT_NUMBER] - $ARGUMENTS\Roadmap\Active TODOs.md
---
# Active TODOs — $ARGUMENTS

## 🔴 High Priority
- [ ] Define project purpose and tech stack in [[Architecture/System Overview]]
- [ ] Set up development environment
- [ ] Create initial project structure

## 🟡 Medium Priority
- [ ] Write first tests
- [ ] Set up CI/CD pipeline

## 🔵 Low Priority
- [ ] Add to portfolio notes

## ✅ Resolved
- [x] Project initialized ([TODAY'S DATE])
- [x] GitHub repo created
- [x] Obsidian brain folder created
- [x] Brain system wired
---

FILE: [NEXT_NUMBER] - $ARGUMENTS\History\Changelog.md
---
# Changelog — $ARGUMENTS

## [TODAY'S DATE] — Project Init
- Project initialized via /init-project
- GitHub repo created: https://github.com/FedorPortnoi/$ARGUMENTS (private)
- Obsidian brain folder: [NEXT_NUMBER] - $ARGUMENTS/
- Brain system wired: /brain /log /pull /update /audit
---

FILE: [NEXT_NUMBER] - $ARGUMENTS\Dev Logs\[TODAY'S DATE].md
---
# Dev Log — [TODAY'S DATE]

## Init Session
- Project $ARGUMENTS created from scratch
- GitHub repo: https://github.com/FedorPortnoi/$ARGUMENTS
- Local: C:\Users\fedor\$ARGUMENTS\
- Obsidian: [NEXT_NUMBER] - $ARGUMENTS\

## Next Session Goals
- [FEDOR TO FILL — what are we building first?]
---

STEP 9 — COPY AND ADAPT SLASH COMMANDS
Copy all files from C:\Users\fedor\.claude\commands\ to
C:\Users\fedor\$ARGUMENTS\.claude\commands\

Then update brain.md in the new project:
- Replace any hardcoded vault folder paths with [NEXT_NUMBER] - $ARGUMENTS\
- Replace any project-specific language with $ARGUMENTS-specific language

STEP 10 — UPDATE AGENTS.md
Read C:\Users\fedor\Documents\Fedor's Brain\00 - Team Brain\AGENTS.md
Add new row to the Projects table:
| $ARGUMENTS | [[$ARGUMENTS HQ\|[NEXT_NUMBER] - $ARGUMENTS]] | C:\Users\fedor\$ARGUMENTS | https://github.com/FedorPortnoi/$ARGUMENTS |

STEP 11 — INITIAL COMMIT AND PUSH
cd C:\Users\fedor\$ARGUMENTS
git add -A
git commit -m "init: $ARGUMENTS initialized with Fedor Brain system"
git push -u origin master

If push fails due to SSH, display the SSH public key from C:\Users\fedor\.ssh\id_ed25519.pub
and instruct Fedor to add it at https://github.com/settings/keys then retry.

STEP 12 — FINAL OUTPUT
Print exactly this:

🚀 PROJECT INITIALIZED: $ARGUMENTS
📁 Local:   C:\Users\fedor\$ARGUMENTS\
🐙 GitHub:  https://github.com/FedorPortnoi/$ARGUMENTS (private)
🧠 Obsidian: Fedor's Brain\[NEXT_NUMBER] - $ARGUMENTS\
⚡ Commands: /brain /log /pull /update /audit /init-project
✅ Run /brain to load context and start building.
