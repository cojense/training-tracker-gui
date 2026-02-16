# **Project Workflow (Root)**

## **Guiding Principles**

1. **The Staging Buffer:** We use git add to save work, but we *never* commit until the track is closed.  
2. **Stop & Ask:** If a task is complex, ambiguous, or fails verification twice, STOP and ask the user for guidance.  
3. **Responsiveness:** If the user intervenes, prioritize their instruction over this workflow.

## **Phase 1: Context & Planning**

1. **Context Load:** Read product.md and tech-stack.md.  
2. **Draft Specs:** Create/Update spec.md based on the user's request.  
3. **Draft Plan:** Create/Update plan.md with granular tasks.  
4. **GATE 1 (Responsiveness Check):**  
   * **STOP.** Display the generated plan.  
       *   **ASK:** "I have drafted the plan. Does this match your intent? (Type 'yes' to proceed or provide corrections)."  
       *   **Wait** for explicit confirmation.
    
   5. **Out-of-Scope Capture Protocol:**  
      * **Context:** After `spec.md` is approved, check for an "Out of Scope" section.
      * **Action:** If "Out of Scope" items exist, ask the user: "The spec for this track includes 'Out of Scope' items. Would you like to add these to the `track_ideas.json` queue for future consideration? (yes/no)"
      * **Logic:**  
        * If 'yes', read `conductor/track_ideas.json`, generate a unique key (e.g., `<track_id>_out_of_scope`), append the items, write the file, and confirm.
        * If 'no', proceed.

## **Phase 2: Implementation (The Staging Loop)**

*Iterate through tasks in plan.md:*

1. **Task Select:** Pick next \[ \] task. Mark as \[\~\].  
2. **Implement:** Write code/docs.  
3. **Verify:** Run applicable tests/checks.  
4. **Stage (Checkpoint):**  
   * If successful, run git add \<modified\_files\>.  
   * **CRITICAL:** Do NOT run git commit.  
5. **Update Plan:** Mark task as \[x\].

## **Phase 3: Track Completion (The Atomic Commit)**

**Trigger:** All tasks are \[x\].

1. **Full Verification:** Run full test suite.  
2. **Review:**  
   * Run git status to show all staged files.  
   * Run git diff \--staged \--stat to show a summary of changes.  
3. **Draft Message:**  
   * Create a commit message in conductor/COMMIT\_EDITMSG.txt following the format:  
     feat/fix(scope): \<concise summary\>  
     * \<Detail 1\>  
     * \<Detail 2\>  
       Closes Track: \<Track ID\> 
4. **Idea Capture Protocol (The Queue):**  
   * **Context:** We maintain a backlog of future work in conductor/track\_ideas.json.  
   * **Action:** Ask the user: "Track complete. Do you have any new ideas or tasks to add to the track\_ideas.json queue? (Type 'no' to skip)."  
   * **Logic:**  
     * If User says 'no': Proceed to Cleanup.  
     * If User provides text:  
       1. Read conductor/track\_ideas.json.  
       2. Generate a unique, slugified key for the new idea (e.g., feature\_login\_refactor\_2026).  
       3. Append the user's input as a list of strings under that key.  
       4. Write the updated JSON back to the file.  
       5. Confirm: "Added \[Idea Key\] to the queue." 
5. **GATE 2 (Final Sign-off):**  
   * **STOP.** Display the draft commit message and file list.  
   * **ASK:** "Ready to commit this track with the message above?"  
   * **Wait** for explicit confirmation.  
6. **Execute:**  
   * On 'YES': Display git commit \-F conductor/COMMIT\_EDITMSG.txt instructions.  
   * On 'NO': Ask for instructions (e.g., "Modify message" or "Revert specific files").