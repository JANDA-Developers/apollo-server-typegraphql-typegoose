import { mongoose } from "@typegoose/typegoose";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import dotenv from "dotenv";
import express from "express";
import { createSchema } from "./initi/schema";
import path from "path";
import session from "express-session";
import { TimeUnit } from "./type/const";
import { UserModel } from "./model/user.model";
const MongoStore = require("connect-mongo")(session);

const envPath = path.join(__dirname, "../.env");
dotenv.config({ path: envPath });

if (!process.env.ATLAS_URI) {
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
  const expressApp = express();
  server.applyMiddleware({
   app: expressApp,
  });

  expressApp.use(
   session({
    name: "jb_qid",
    secret: process.env.JD_TIMESPACE_SECRET || "",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
     mongooseConnection: mongoose.connection,
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

  expressApp.listen(4000, () => {
   console.log("server is running on 4000");
  });
 });
