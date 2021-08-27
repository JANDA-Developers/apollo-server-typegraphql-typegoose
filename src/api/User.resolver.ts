import { Resolver, Query, Arg } from "type-graphql";
import { User, UserModel } from "../model/user.model";
import { documentNotFound } from "../utils/error";

@Resolver()
export class UserFindByIdResolver {
 @Query(() => User)
 async UserFindById(@Arg("userId") userId: string): Promise<any> {
  const user = await UserModel.findById(userId);
  if (!user) throw documentNotFound("user");
  return user;
 }
}
