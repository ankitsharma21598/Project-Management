import { gql } from "@apollo/client";

export const ME_QUERY = gql`
  query Me {
    me {
      id
      firstName
      lastName
      email
      organizationId
      role
    }
  }
`;

export const MY_ORGANIZATIONS_QUERY = gql`
  query organization($organizationId: ID!) {
    organization(id: $organizationId) {
      id
      name
      contactEmail
    }
  }
`;

export const PROJECTS_QUERY = gql`
  query Projects($organizationId: ID!) {
    projects(organizationId: $organizationId) {
      id
      name
      description
      status
      dueDate
      tasks {
        id
        title
        description
        status
        assigneeEmail
      }
    }
  }
`;

export const PROJECT_QUERY = gql`
  query Project($projectId: ID!) {
    project(id: $projectId) {
      id
      name
      description
      status
      dueDate
      tasks {
        id
        title
        description
        status
        assigneeEmail
      }
    }
  }
`;

export const TASKS_QUERY = gql`
  query Tasks($projectId: ID!) {
    tasks(projectId: $projectId) {
      id
      title
      description
      status
      assigneeEmail
    }
  }
`;

export const TASK_QUERY = gql`
  query Task($taskId: ID!) {
    task(id: $taskId) {
      id
      title
      description
      status
      assigneeEmail
      comments {
        id
        content
        authorEmail
        createdAt
      }
    }
  }
`;
