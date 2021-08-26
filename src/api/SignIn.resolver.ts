import { ExpressContext } from "apollo-server-express";
import { Resolver, Ctx, Query, Arg } from "type-graphql";
import { BuildContext } from "type-graphql/dist/schema/build-context";
import { User, UserModel } from "../model/user.model";

export interface Context extends ExpressContext {
 context: any;
 req: any;
}

@Resolver()
export class SignUpResolver {
 @Query(() => User)
 async SignIn(
  @Ctx() context: Context,
  @Arg("email") email: string,
  @Arg("pssword") password: string
 ): Promise<any> {
  const user = await UserModel.findOne({
   email,
  });

  if (!user) {
  }
  const result = await user?.comparePassword(password);

  if (result) {
   context.req.session["userId"] = user?._id.toString();
   context.req.session.save();
   return user;
  } else {
  }

  return true;
 }
}
