# Project Management System - Backend

A robust, multi-tenant project management system built with Node.js, TypeScript, GraphQL, and PostgreSQL.

## 🚀 Features

- **Multi-tenant Architecture**: Organization-based data isolation
- **GraphQL API**: Flexible and efficient data queries
- **TypeScript**: Full type safety throughout the codebase
- **PostgreSQL**: Robust relational database with Sequelize ORM
- **Function-based Services**: Clean separation of concerns
- **Validation**: Input validation on all operations
- **Error Handling**: Comprehensive error management

## 📋 Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 13.x
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**

```bash
   git clone <repository-url>
   cd backend
```

2. **Install dependencies**

```bash
   npm install
```

3. **Setup environment variables**

```bash
   cp .env.example .env
```

Edit `.env` with your configuration:

```env
   NODE_ENV=development
   PORT=4000

   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=project_management
   DB_USER=postgres
   DB_PASSWORD=your_password

   JWT_SECRET=your-secret-key
   CORS_ORIGIN=http://localhost:5173
```

4. **Create database**

```bash
   createdb project_management
```

5. **Run migrations and seed data**

```bash
   npm run seed
```

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

The server will start at `http://localhost:4000`
GraphQL Playground: `http://localhost:4000/graphql`

## 📚 API Documentation

### GraphQL Endpoints

#### Organizations

**Query: Get all organizations**

```graphql
query {
  organizations {
    id
    name
    slug
    contactEmail
    projects {
      id
      name
    }
  }
}
```

**Mutation: Create organization**

```graphql
mutation {
  createOrganization(
    name: "My Company"
    slug: "my-company"
    contactEmail: "contact@mycompany.com"
  ) {
    id
    name
  }
}
```

#### Projects

**Query: Get projects for an organization**

```graphql
query {
  projects(organizationId: "org-id-here") {
    id
    name
    status
    description
    dueDate
    taskStats {
      total
      completed
      completionRate
    }
  }
}
```

**Mutation: Create project**

```graphql
mutation {
  createProject(
    organizationId: "org-id-here"
    name: "New Project"
    status: active
    description: "Project description"
    dueDate: "2025-12-31"
  ) {
    id
    name
    status
  }
}
```

**Mutation: Update project**

```graphql
mutation {
  updateProject(
    id: "project-id-here"
    name: "Updated Project Name"
    status: completed
  ) {
    id
    name
    status
  }
}
```

#### Tasks

**Query: Get tasks for a project**

```graphql
query {
  tasks(projectId: "project-id-here") {
    id
    title
    description
    status
    assigneeEmail
    comments {
      id
      content
      authorEmail
    }
  }
}
```

**Mutation: Create task**

```graphql
mutation {
  createTask(
    projectId: "project-id-here"
    title: "New Task"
    description: "Task description"
    status: todo
    assigneeEmail: "user@example.com"
  ) {
    id
    title
    status
  }
}
```

**Mutation: Update task**

```graphql
mutation {
  updateTask(id: "task-id-here", status: done) {
    id
    status
  }
}
```

#### Comments

**Mutation: Add comment to task**

```graphql
mutation {
  addComment(
    taskId: "task-id-here"
    content: "This is a comment"
    authorEmail: "user@example.com"
  ) {
    id
    content
    authorEmail
    createdAt
  }
}
```

## 🏗️ Project Structure

````

backend/
├── src/
│   ├── config/
│   ├── graphql/
│   │   ├── typeDefs.ts
│   │   └── resolvers.ts
│   ├── models/
│   ├── services/
│   ├── middleware/
│   ├── utils/
│   └── server.ts
├── Dockerfile
├── package.json
└── README.md

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend` directory.

```env
NODE_ENV=development
PORT=4000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=project_management
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:5173
````

---

## ▶️ Run Locally

```bash
cd backend
npm install
npm run dev
```

GraphQL Playground:

```
http://localhost:4000/graphql
```

---

## ▶️ Run with Docker

```bash
docker build -t project-management-backend .
docker run -p 4000:4000 project-management-backend
```

---

## 🔑 Authentication

- JWT-based authentication
- Token must be sent in headers:

```
Authorization: Bearer <token>
```

---

## 📌 GraphQL Features

### Queries

- `me`
- `organizations`
- `projects`
- `tasks`
- `comments`

### Mutations

- `signup`, `signin`
- `createOrganization`
- `createProject`, `updateProject`
- `createTask`, `updateTask`
- `addComment`

---

## 🗄️ Database

- PostgreSQL
- Sequelize with `timestamps` and `underscored`
- `TIMESTAMPTZ` used for all date fields

---

## 📄 License

MIT License
