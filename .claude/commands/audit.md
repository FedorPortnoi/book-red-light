Run a quick spot-check of the Obsidian brain vs the current codebase.
Do not do a full audit — just check for drift since the last audit.

1. Read CLAUDE.md in the current directory to find the project vault folder.
2. Check the project's History/ folder for the most recent Audit Report to know what was verified last time.
3. Check only files modified since the last audit date using: git log --oneline --after="[last audit date]"
4. For each changed file, check if the relevant Obsidian note is still accurate.
5. List any drift found.
6. Fix any drift automatically.
7. Append findings to the most recent Audit Report under a new dated section (or create one if none exists).

Output: "🔍 Audit complete — [X] drifts found, [Y] fixed"
