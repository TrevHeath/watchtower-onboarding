import config from "../config";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import cookie from "react-cookies";

const httpLink = createHttpLink({ uri: config.GRAPHQL_URL });

const authLink = setContext((_, { headers }) => {
  // get the authentication token from cookie if it exists
  const token = cookie.load("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default client;
