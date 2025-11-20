import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// We use an environment variable so we can point to different backends
// - In production (Render Static Site): https://devhub-backend-7iri.onrender.com/graphql
// - In development (local): http://localhost:3000/graphql
const GRAPHQL_ENDPOINT =
  process.env.REACT_APP_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: "include", // important to send cookies (sessions) with every request
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
