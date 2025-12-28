# TaskFlow SaaS: Multi-Tenant Collaborative Task Management

## Project Overview

TaskFlow SaaS is a full-stack, multi-tenant task management application built with the MERN stack (MongoDB, Express.js, React, Node.js). It allows multiple independent organizations to manage their tasks and collaborate with their respective members within an isolated environment. Each user belongs to one organization, and all tasks are scoped to that organization, ensuring data separation and security.

This application demonstrates core SaaS principles including secure authentication, organization creation, member management, and full CRUD (Create, Read, Update, Delete) operations for tasks.

## Key Features

### Authentication & Authorization
•   **User Registration & Login:** Secure user accounts with JWT (JSON Web Tokens) for authentication.
•   **Protected Routes:** Ensures only authenticated users can access core application features.
•   **Context API:** Global authentication state management in the frontend.

### Multi-Tenancy & Organization Management
•   **Organization Creation:** Users can create their own organization, becoming its owner.
•   **Organization Isolation:** All data (tasks, members) is strictly isolated and scoped to the user's organization.
•   **Member Invitation:** Organization owners can invite other registered users to join their organization by email.
•   **Member Removal:** Owners can remove members from their organization.
•   **Role Management (Basic):** Owner role for organization creator, member role for invited users.
•   **Dynamic Dashboard:** Users are prompted to create an organization if they don't belong to one.

### Task Management (CRUD)
•   **Create Tasks:** Add new tasks with title, description, status (To Do, In Progress, Done, Archived), priority (Low, Medium, High), due date, and assign them to any organization member.
•   **View Tasks:** Display all tasks belonging to the user's organization on the dashboard.
•   **Edit Tasks:** Update task details (title, description, status, priority, due date, assignee) via an intuitive modal interface.
•   **Delete Tasks:** Remove tasks from the organization.
•   **Task Details:** Each task displays its current status, priority, due date, assigned member, and creator.

### User Interface
•   **Modern & Responsive Design:** Built with **Tailwind CSS** for a sleek, responsive, and mobile-friendly user experience.
•   **Intuitive Forms:** User-friendly forms for registration, login, organization creation, and task management.
•   **Real-time Updates:** Task list updates instantly upon creation, update, or deletion without requiring a full page refresh.

## Technology Stack

### Backend
•   **Node.js:** JavaScript runtime environment.
•   **Express.js:** Web application framework for building RESTful APIs.
•   **MongoDB:** NoSQL database for flexible data storage.
•   **Mongoose:** ODM (Object Data Modeling) library for MongoDB and Node.js.
•   **JWT (jsonwebtoken):** For secure user authentication.
•   **Bcrypt.js:** For password hashing.
•   **Dotenv:** For managing environment variables.
•   **Nodemon:** For automatic server restarts during development.

### Frontend
•   **React:** JavaScript library for building user interfaces.
•   **React Router DOM:** For declarative routing in React applications.
•   **Tailwind CSS:** Utility-first CSS framework for rapid UI development.
•   **Axios:** Promise-based HTTP client for making API requests.
•   **date-fns:** Lightweight date utility library for formatting dates.
•   **Vite:** Fast build tool for modern web projects.

## Prerequisites

Before you begin, ensure you have met the following requirements:
•   Node.js (LTS version recommended)
•   npm (Node Package Manager) or Yarn
•   MongoDB (local installation or a cloud service like MongoDB Atlas)

## Installation & Setup

Follow these steps to get the TaskFlow SaaS application running on your local machine.

### 1. Clone the Repository
bash
git clone https://github.com/Ekram2004/task-manager-saas-collaborative/new/main?filename=README.md
```

▌2. Backend Setup

Navigate to the backend directory, install dependencies, and configure environment variables.

```
bash
cd backend
npm install # or yarn install
```

Create a .env file in the backend directory with the following content:


```
env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflowdb # Replace with your MongoDB connection string
JWT_SECRET=your_jwt_secret_key # Use a strong, random string
NODE_ENV=development # or production
```

Note:
•  Replace your_jwt_secret_key with a strong, complex secret.
•  Adjust MONGO_URI if you are using a cloud MongoDB Atlas instance or a different local setup.

▌3. Frontend Setup

Navigate to the frontend directory and install dependencies.


```
bash
cd ../frontend # Go back to root, then into frontend
npm install # or yarn install


```

The frontend is configured to connect to the backend running on http://localhost:5000 by default (via api.js using Axios). If your backend runs on a different port or URL, you might need to adjust frontend/src/api.js or use a .env file if you prefer (e.g., VITE_API_URL=http://localhost:5000). For this project, axios.defaults.baseURL is set directly.

▌4. Running the Applications

▍Start the Backend Server


```
bash
cd backend
npm start # or node server.js
# For development with nodemon:
# npm run dev
```
The backend server should start on http://localhost:5000 (or your configured PORT).

▍Start the Frontend Development Server


```

bash
cd frontend
npm run dev
The frontend application should open in your browser, typically at http://localhost:5173.

## Usage

1.  **Register a New User:** Navigate to /register and create a new account.
2.  **Create an Organization:** After registering, if you don't belong to an organization, the dashboard will prompt you to create one. Provide an organization name.
3.  **Manage Tasks:** On the dashboard, you can:
    *   Create new tasks with various details and assign them to members.
    *   View existing tasks.
    *   Edit task details by clicking the "Edit" button on a task card.
    *   Delete tasks by clicking the "Delete" button.
4.  **Manage Members:**
    *   Click the "Members" link in the navigation bar.
    *   From this page, you (as the organization owner) can invite new members by entering their registered email address.
    *   You can also remove existing members from the organization.
    *   **Note:** To invite, the user must already be registered in the system and not belong to another organization.
5.  **Collaborate:** Log in with another user who has been invited to your organization. They will now see the same tasks and can create/edit/delete tasks within that organization.

## API Endpoints (Backend Reference)

Here's a brief overview of the main API endpoints:

### Authentication
•   POST /api/auth/register: Register a new user.
•   POST /api/auth/login: Log in a user.

### Organizations (Requires Authorization: Bearer <token>)
•   POST /api/organizations: Create a new organization.
•   GET /api/organizations/my: Get the current user's organization details, including populated members.
•   GET /api/organizations/my/members: Get a list of all members (ID, name, email) for the current user's organization.
•   POST /api/organizations/:id/members: Invite a new member to an organization (owner only).
•   DELETE /api/organizations/:id/members/:memberId: Remove a member from an organization (owner only).

### Tasks (Requires Authorization: Bearer <token>)
•   GET /api/tasks: Get all tasks for the current user's organization.
•   GET /api/tasks/:id: Get a single task by ID.
•   POST /api/tasks: Create a new task.
•   PUT /api/tasks/:id: Update an existing task.
•   DELETE /api/tasks/:id: Delete a task.

## Project Structure
├── backend/
│  ├── config/       # Database connection setup
│  ├── controllers/    # Business logic for routes (auth, organization, task)
│  ├── middleware/     # Authentication middleware (JWT verification, orgId injection)
│  ├── models/       # Mongoose schemas (User, Organization, Task)
│  ├── routes/       # API routes definitions
│  ├── server.js      # Main Express server setup
│  └── package.json
├── frontend/
│  ├── public/
│  ├── src/
│  │  ├── api/      # Axios instance for API requests
│  │  ├── components/   # Reusable React components (Navbar, TaskCard, TaskForm, TaskEditModal, ProtectedRoute)
│  │  ├── context/    # React Context for authentication state
│  │  ├── pages/     # Main application pages (Login, Register, Dashboard, OrgCreate, OrgMembers)
│  │  ├── App.jsx     # Main React application component
│  │  ├── index.css    # Tailwind CSS setup and custom styles
│  │  └── main.jsx    # React root rendering
│  ├── index.html
│  └── package.json
└── README.md

▌Future Enhancements

•  Advanced Role-Based Access Control: Implement more granular permissions for different user roles (e.g., viewers, editors).
•  Organization Settings: Page to view/edit organization name, possibly manage billing (for a real SaaS).
•  Task Filtering & Sorting: Add UI controls to filter tasks by status, priority, assignee, and sort by various criteria.
•  User Profiles: Allow users to update their personal information.
•  Notifications: Implement in-app or email notifications for task assignments/updates.
•  Real-time Features: Use WebSockets for real-time task updates across all organization members.
•  Kanban Board: A visual, drag-and-drop board for task management.
•  Unit & Integration Tests: Add comprehensive tests for both frontend and backend logic.
•  Deployment Automation: CI/CD pipeline for automated testing and deployment.

▌License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. (You might need to create a LICENSE file if you haven't already).

▌Contact

If you have any questions or feedback, feel free to reach out:
•  GitHub Profile https://github.com/Ekram2004

---

```
