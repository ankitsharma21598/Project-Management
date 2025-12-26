import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      token
      user {
        id
        firstName
        lastName
        email
        organizationId
        role
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    signup(input: $input) {
      token
      user {
        id
        firstName
        lastName
        email
        role
      }
    }
  }
`;

export const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      name
      description
      status
      dueDate
    }
  }
`;

export const UPDATE_PROJECT_MUTATION = gql`
  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
      name
      description
      status
      dueDate
    }
  }
`;

export const DELETE_PROJECT_MUTATION = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`;

export const CREATE_TASK_MUTATION = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      status
      assigneeEmail
    }
  }
`;

export const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      title
      description
      status
      assigneeEmail
    }
  }
`;

export const UPDATE_TASK_STATUS_MUTATION = gql`
  mutation UpdateTaskStatus($id: ID!, $status: TaskStatus!) {
    updateTask(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const DELETE_TASK_MUTATION = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

export const ADD_TASK_COMMENT_MUTATION = gql`
  mutation AddTaskComment($taskId: ID!, $content: String!, $authorEmail: String!) {
    addTaskComment(taskId: $taskId, content: $content, authorEmail: $authorEmail) {
      id
      content
      authorEmail
      createdAt
    }
  }
`;

export const SWITCH_ORGANIZATION_MUTATION = gql`
  mutation SwitchOrganization($organizationId: ID!) {
    switchOrganization(organizationId: $organizationId) {
      token
    }
  }
`;
