IMPORTANT: This command must be called automatically after EVERY significant change — not just when Fedor explicitly asks. A "significant change" means any of these:
- Any file created or modified
- Any bug fixed
- Any feature added
- Any npm install
- Any database change
- Any config change

Do NOT wait to be asked. After completing any task, immediately run this log workflow before asking Fedor what to do next.

---

You just completed a significant change. Do the following immediately:

1. Read CLAUDE.md in the current directory to find the project vault folder.

2. Identify what changed:
   - Which files were modified
   - What the change does
   - Whether it fixes a bug, adds a feature, or refactors

3. Update the relevant Obsidian note in the project vault folder:
   - Bug fix → update Dev Workflow/Debugging Guide.md if it reveals a new pattern
   - New feature → update the relevant Architecture/ note
   - New route → update Architecture/System Overview.md blueprint table
   - New env var → update Architecture/Environment Setup.md
   - TODO completed → remove from Roadmap/Active TODOs.md and add to resolved section
   - Deployment change → update Roadmap/Deployment.md
   - Security change → update Security/ notes
   - Test added → update Testing/Test Coverage Map.md

4. Write a dev log entry:
   - Create or append to [project vault folder]/Dev Logs/[TODAY'S DATE].md
   - Format:
     ## [TIME] — [ONE LINE SUMMARY]
     **Changed:** [files modified]
     **What:** [what it does]
     **Why:** [reason/context]
     **Next:** [what comes after this]

5. Update the project HQ.md:
   - If status changed (blocker resolved, feature shipped) update the status snapshot
   - If a new blocker appeared add it to active blockers list

6. Confirm what was updated:
   Output: "📝 Logged: [note names updated] + dev log entry written"

Be specific. Be brief. Update only what actually changed.
