import { ExpressContext } from "apollo-server-express";
import { Resolver, Ctx, Query } from "type-graphql";
import { User } from "../model/user.model";

@Resolver()
export class SignUpResolver {
 @Query(() => User)
 async User(@Ctx() context: ExpressContext): Promise<any> {
  return 1;
 }
}
