import { mongoose } from "@typegoose/typegoose";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import dotenv from "dotenv";
import express from "express";
import { createSchema } from "./initi/schema";
import path from 'path'
const envPath = path.join(__dirname, '../.env')
dotenv.config({ path:envPath });

if(!process.env.ATLAS_URI) {
    throw Error("Atlas Uri is not in env file");
}

mongoose
 .connect(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
 })
 .then(async () => {
  const server = new ApolloServer({
   schema: await createSchema(),
   introspection: true,
   context: async (context): Promise<ExpressContext> => {
    return context;
   },
  });
  const expressApp = express();
  server.applyMiddleware({
   app: expressApp,
  });

  expressApp.listen(4000, () => {
   console.log("server is running on 4000");
  });
 });
