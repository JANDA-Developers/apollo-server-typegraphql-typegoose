import { ExpressContext } from "apollo-server-express";
import { User } from "../model/user.model";

export interface Context extends ExpressContext {
 user?: User;
 context: any;
 req: any;
}
