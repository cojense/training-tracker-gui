# Project Workflow (Frontend)

## Guiding Principles
1. **UI/UX First:** If the code passes tests but looks wrong, it is wrong.
2. **Atomic Commits:** One track = One commit. Use `git add` to checkpoint.
3. **Interactive Linting:** Do not guess on lint errors; ask the user.

## Phase 1: Planning
1. **Analyze:** Check `tech-stack.md` (MUI/React 19).
2. **Plan:** Generate `plan.md`.
3. **GATE 1:** STOP. Ask user to confirm the plan.

## Phase 2: Implementation (Staging Loop)
*For each task in `plan.md`:*

1. **Development:** Implement Component/Hook.
2. **Linting Loop:**
   - Run: `bun run lint:fix`.
   - **If errors persist:** STOP. Show errors. Ask user: "Fix, Disable, or Config?"
3. **Verification:**
   - Run: `bun test` (if applicable).
4. **Stage:**
   - Command: `git add.`
   - **DO NOT COMMIT.**
5. **Update Plan:** Mark `[x]`.

## Phase 3: Completion
1. **Final Verification:**
   - Run `bun run typecheck` (or equivalent).
   - Run `bun run test`.
2. **Review:** Show `git status`.
3. **Draft Commit:** Write to `conductor/COMMIT_EDITMSG.txt`.
5. **GATE 2:** STOP. Ask: "Ready to commit?:`git commit -F conductor/COMMIT_EDITMSG.txt`"