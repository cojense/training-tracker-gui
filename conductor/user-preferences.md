# User Preferences & Lessons Learned

**Agent Instruction:** Append to this file whenever the user gives style guidance or corrects a recurring mistake. Read this file before starting any new task.

## Linting & Code Style
* [Example] Prefer `const` over `let` wherever possible.
* [Example] Use "Early Return" pattern in React components.

## Workflow Preferences
* **Commits:** Do not create intermediate commits. Squash everything into one commit at the end of the track.
* **Linting:** Always run `bun run lint:fix` before asking for review. Ask for guidance on specific lint rule violations.