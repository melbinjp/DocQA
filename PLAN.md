1. *Explore the existing codebase and API.* (Done)
    * I have reviewed the existing `index.html` and `README.md`.
    * I have analyzed the `openapi.json` to understand the API endpoints.

2. *Create `PLAN.md` and `AGENT.md`.* (In Progress)
    * I will create a detailed `PLAN.md` file containing the full, granular project plan.
    * I will create an `AGENT.md` file with a high-level summary of the plan, the chosen architecture, and a link to `PLAN.md`.

3. *Set up the React development environment.*
    * I will use `create-react-app` to bootstrap a new React project.
    * I will install necessary dependencies, such as `axios` for making API requests and `i18next` for internationalization.
    * I will remove the existing `index.html` and other root files that are no longer needed.

4. *Implement the core application structure and layout.*
    * I will create a main `App` component.
    * I will implement routing using `react-router-dom` to handle different views (e.g., upload, query, documents).
    * I will create a global context for managing the user's session ID.

5. *Implement API connection and session management.*
    * I will create a service module for all API calls.
    * On application load, I will check for an existing `session_id` in local storage.
    * If no `session_id` exists, I will call the `POST /sessions` endpoint to create a new session and store the returned `session_id`.

6. *Build the document upload component.*
    * I will create a component for uploading files.
    * The component will use the `POST /sessions/{session_id}/ingest` endpoint.
    * It will support both file uploads and URL ingestion.
    * It will provide clear feedback to the user on the status of the upload.

7. *Build the query component.*
    * I will create a component for asking questions.
    * The component will use the `POST /sessions/{session_id}/query` endpoint.
    * It will display the answer and the sources.

8. *Build the documents list component.*
    * I will create a component for listing and managing uploaded documents.
    * Since the API does not provide an endpoint to list documents, I will manage the list of documents on the client side.
    * The component will allow users to delete documents using the `DELETE /sessions/{session_id}/documents/{doc_id}` endpoint.

9. *Implement Internationalization (i18n).*
    * I will set up `i18next` to handle translations.
    * I will create translation files for at least two languages (e.g., English and Spanish) to demonstrate the functionality.

10. *Refine the UI and styling.*
    * I will apply a clean and modern design to all components.
    * I will ensure the application is responsive and works well on different screen sizes.

11. *Visual Verification.*
    * I will use the `frontend_verification_instructions` tool to get instructions on how to write a Playwright script.
    * I will write and run a script to take a screenshot of the new frontend skeleton.

12. *Update Documentation.*
    * I will update the `README.md` with clear instructions on how to build and run the new frontend.

13. *Final Review and Submission.*
    * I will request a code review using `request_code_review`.
    * I will address any feedback from the review.
    * I will use `initiate_memory_recording()` to save key learnings.
    * I will submit the foundational skeleton as a pull request.
