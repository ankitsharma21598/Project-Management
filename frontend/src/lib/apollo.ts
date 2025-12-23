import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { store } from "@/store";
import { logout } from "@/store/authSlice";

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT || "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorLink = onError((errorResponse: any) => {
  const { graphQLErrors, networkError } = errorResponse;
  if (graphQLErrors) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const err of graphQLErrors as any[]) {
      if (err.extensions?.code === "UNAUTHENTICATED") {
        store.dispatch(logout());
        window.location.href = "/auth";
      }
      console.error(`[GraphQL error]: ${err.message}`);
    }
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          projects: {
            merge(_, incoming) {
              return incoming;
            },
          },
          tasks: {
            merge(_, incoming) {
              return incoming;
            },
          },
        },
      },
      Project: {
        fields: {
          tasks: {
            merge(_, incoming) {
              return incoming;
            },
          },
        },
      },
      Task: {
        fields: {
          comments: {
            merge(_, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});

export const resetApolloClient = () => {
  apolloClient.resetStore();
};
