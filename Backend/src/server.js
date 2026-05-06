const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./API/schema');
const buildResolvers = require('./API/resolvers');
const { buildContainer } = require('./Infra/Container');

async function start() {
  const app = express();
  const container = buildContainer();

  const server = new ApolloServer({
    typeDefs,
    resolvers: buildResolvers(container),
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`GraphQL ready at http://localhost:${port}${server.graphqlPath}`);
  });
}

start().catch(err => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
