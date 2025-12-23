import gql from 'graphql-tag';

export const typeDefs = gql`
 # ============= User Types =============
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    organizationId: ID
    organization: Organization
    role: UserRole!
    isActive: Boolean!
    lastLoginAt: String
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  enum UserRole {
    admin
    manager
    member
  }

  # ============= Organization Types =============
  type Organization {
    id: ID!
    name: String!
    slug: String!
    contactEmail: String!
    users: [User!]!
    projects: [Project!]!
    createdAt: String!
    updatedAt: String!
  }

  type Project {
    id: ID!
    organizationId: ID!
    organization: Organization!
    name: String!
    status: ProjectStatus!
    description: String
    dueDate: String
    tasks: [Task!]!
    taskStats: TaskStats!
    createdAt: String!
    updatedAt: String!
  }

  type Task {
    id: ID!
    projectId: ID!
    project: Project!
    title: String!
    description: String
    status: TaskStatus!
    assigneeEmail: String
    comments: [TaskComment!]!
    createdAt: String!
    updatedAt: String!
  }

  type TaskComment {
    id: ID!
    taskId: ID!
    task: Task!
    content: String!
    authorEmail: String!
    createdAt: String!
    updatedAt: String!
  }

  type TaskStats {
    total: Int!
    completed: Int!
    completionRate: Float!
  }

  enum ProjectStatus {
    planning
    active
    on_hold
    completed
  }

  enum TaskStatus {
    todo
    in_progress
    done
  }

  type Query {
   # Auth queries
    me: User

    # User queries
    user(id: ID!): User
    users: [User!]!
    organizationUsers(organizationId: ID!): [User!]!

    # Organization queries
    organization(id: ID!): Organization
    organizations: [Organization!]!

    # Project queries
    project(id: ID!): Project
    projects(organizationId: ID!): [Project!]!

    # Task queries
    task(id: ID!): Task
    tasks(projectId: ID!): [Task!]!

    # Comment queries
    comments(taskId: ID!): [TaskComment!]!
  }

  type Mutation {
  # Auth mutations
    signup(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
      organizationName: String
      organizationSlug: String
    ): AuthPayload!

    signin(email: String!, password: String!): AuthPayload!

    updateProfile(firstName: String, lastName: String): User!

    changePassword(currentPassword: String!, newPassword: String!): Boolean!
    
    # Organization mutations
    createOrganization(
      name: String!
      slug: String!
      contactEmail: String!
    ): Organization!
    
    updateOrganization(
      id: ID!
      name: String
      contactEmail: String
    ): Organization!
    
    deleteOrganization(id: ID!): Boolean!

    # Project mutations
    createProject(
      organizationId: ID!
      name: String!
      status: ProjectStatus
      description: String
      dueDate: String
    ): Project!
    
    updateProject(
      id: ID!
      name: String
      status: ProjectStatus
      description: String
      dueDate: String
    ): Project!
    
    deleteProject(id: ID!): Boolean!

    # Task mutations
    createTask(
      projectId: ID!
      title: String!
      description: String
      status: TaskStatus
      assigneeEmail: String
    ): Task!
    
    updateTask(
      id: ID!
      title: String
      description: String
      status: TaskStatus
      assigneeEmail: String
    ): Task!
    
    deleteTask(id: ID!): Boolean!

    # Comment mutations
    addComment(
      taskId: ID!
      content: String!
      authorEmail: String!
    ): TaskComment!
    
    deleteComment(id: ID!): Boolean!
  }
`;