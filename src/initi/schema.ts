import { buildSchema } from "type-graphql";
import { GraphQLSchema } from "graphql";

// going to ApolloServer
export const createSchema = async (): Promise<GraphQLSchema> =>
 buildSchema({
  emitSchemaFile: true,
  resolvers: [__dirname + "/../**/*.{resolver,model}.{ts,js}"],
  globalMiddlewares: [],
  scalarsMap: [],
 });
