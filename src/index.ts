import { mongoose } from "@typegoose/typegoose";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import dotenv from "dotenv";
import express from "express";
import { createSchema } from "./initi/schema";
import path from "path";
import session from "express-session";
import { TimeUnit } from "./type/const";
import { UserModel } from "./model/user.model";
import MongoStore from "connect-mongo";
import "./model/car.model";

const envPath = path.join(__dirname, "../.env");
dotenv.config({ path: envPath });

if (!process.env.ATLAS_URI) {
 throw Error("Atlas Uri is not in env file");
}
if (!process.env.SESSION_KEY) {
 throw Error("SESSION_KEY is not in env file");
}

mongoose
 .connect(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
 })
 .then(async () => {
  const expressApp = express();

  expressApp.use(
   session({
    name: "jb_qid",
    secret: process.env.SESSION_KEY || "",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
     mongoUrl: process.env.ATLAS_URI,
    }),
    cookie: {
     // Production, local 개발일때 환경 나눠야됨
     httpOnly: true,
     maxAge: TimeUnit.ONE_DAY * 14,
     // domain: ".stayjanda.cloud", // Production에서 사용
     ...(process.env.NODE_ENV === "prod"
      ? {
         domain: ".stayjanda.cloud",
         sameSite: "none",
         secure: true,
        }
      : {
         sameSite: "lax", // excatly same domain or subdomains,
         secure: false,
        }),
    },
   })
  );

  const server = new ApolloServer({
   schema: await createSchema(),
   playground: {},
   introspection: true,
   context: async (context): Promise<ExpressContext> => {
    const session = context.req["session"];
    const userid = session["userId"];
    if (userid) {
     const user = await UserModel.findById(userid);
     if (user) {
      context["user"] = user;
     }
    }
    return context;
   },
  });

  server.applyMiddleware({
   app: expressApp,
  });

  expressApp.listen(4000, () => {
   console.log("server is running on 4000");
  });
 });
