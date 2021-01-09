const makeSchema = require("graphql-spotify").makeSchema;
const graphqlExpress = require("apollo-server-express").graphqlExpress;
const graphiqlExpress = require("apollo-server-express").graphiqlExpress;
const express = require("express");
const bodyParser = require("body-parser");
// Initialize the app
const port = 3000;
const app = express();
// bodyParser is needed just for POST.
app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress((req) => {
    let token;
    //... somewhere the spotify token is gotten from the context
    const schema = makeSchema(token);
    return { schema };
  })
);
// GraphiQL, a visual editor for queries
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));
app.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${port}/graphql`);
});
