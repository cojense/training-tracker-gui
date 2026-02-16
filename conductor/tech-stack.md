# Tech Stack: Training Tracker GUI

## Frontend
*   **Framework:** React (with TypeScript) - v19
*   **Build Tool:** Vite
*   **UI Library:** Material UI (MUI) - v7
*   **Routing:** React Router DOM
*   **Form Management:** React Hook Form
*   **Package Manager:** Bun - v1.3.9

## Debugging & Quality Protocol
* **Console Logs:** When debugging logic, use `console.log` freely, but you MUST remove them before the final commit.
* **UI Verification:** Since this is a GUI, "passing tests" is not enough. If the user says "It looks wrong," assume the unit test is a false positive and request a screenshot or HTML dump.
* **MUI Guidelines:** unexpected UI behavior is often due to conflicting Material UI props. Prefer `sx` props for one-off styles over external CSS files.
