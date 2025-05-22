import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:8080/v1/graphql', // Envio's Hasura endpoint
  cache: new InMemoryCache(),
});

export default client;