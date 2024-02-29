const express = require("express");
const app = express();
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");

async function startGqlServer() {
  // create graphQL server
  const gqlServer = new ApolloServer({
    typeDefs: `
      type Query{
        hello: String,
        intro(name: String): String 
      }
    `,
    resolvers: {
      Query: {
        hello: () => "Hello GraphQL Server",
        intro: (_, { name }) => `My Name is ${name}`,
      },
    },
  });

  // start gql server
  await gqlServer.start();

  app.use(express.json());

  // if any req starts with '/graphql' then send it to ApolloServer to handle.
  app.use("/graphql", expressMiddleware(gqlServer));

  app.get("/", (req, res) => {
    res.status(200).send("Hello World");
  });

  const port = 5000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startGqlServer();
