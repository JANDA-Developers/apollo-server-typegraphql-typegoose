import { mongoose } from "@typegoose/typegoose";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import env from "dotenv";
import path from "path";
import express from "express";
import { createSchema } from "./initi/schema";
const envPath = path.join(__dirname, `../.env`);
env.config({ path: envPath });

mongoose
 .connect(process.env.DB_URI_CLOUD!, {
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
