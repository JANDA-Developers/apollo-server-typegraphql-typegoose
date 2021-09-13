import { buildSchema } from "type-graphql";
import { GraphQLSchema } from "graphql";
import { TypegooseMiddleware } from "../middleware/typegooseMiddleware";
import { ObjectIdScalar } from "../type/scalar/ObjectId.scalar";
import { ObjectId } from "mongodb";

// going to ApolloServer
export const createSchema = async (): Promise<GraphQLSchema> =>
 buildSchema({
  emitSchemaFile: true,
  resolvers: [__dirname + "/../**/*.{resolver,model}.{ts,js}"],
  globalMiddlewares: [TypegooseMiddleware],
  scalarsMap: [
   {
    type: ObjectId,
    scalar: ObjectIdScalar,
   },
  ],
 });
