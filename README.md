# Chat with a Doc - Frontend

This is a modern, responsive, and internationalized frontend for the "Chat with a Doc" application. It is built with React, Vite, and i18next.

## Features

*   **Modern UI:** A clean and user-friendly interface for interacting with the DocQA API.
*   **Responsive Design:** Works great on all screen sizes.
*   **Internationalization:** Supports multiple languages, with English and Spanish provided out of the box.
*   **Session Management:** Automatically creates and manages user sessions with the backend.

## Quick Start

### Prerequisites

*   Node.js (v18 or higher)
*   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

To start the development server, run the following command:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

To build the application for production, run the following command:

```bash
npm run build
```

The production-ready files will be located in the `dist` directory.

## Architecture

The frontend is a single-page application (SPA) built with React. It uses `axios` for API communication, `react-router-dom` for routing, and `i18next` for internationalization. The application is structured with a clear separation of concerns, with components, services, and contexts organized into separate directories.

A detailed, step-by-step plan for this project can be found in [PLAN.md](PLAN.md).
An overview of the architecture can be found in [AGENT.md](AGENT.md).
