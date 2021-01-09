import { ApolloServer } from "apollo-server-micro";
import { makeSchema } from "graphql-spotify";
import { typeDefs } from "./schemas";
import { resolvers } from "./resolvers";

const token = "9dca658fc08a495c8134e626b4889234";
const schema = makeSchema(token);

const apolloServer = new ApolloServer(schema);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: "/api/graphql" });
