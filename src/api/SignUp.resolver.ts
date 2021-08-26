import { ExpressContext } from "apollo-server-express";
import { Resolver, Mutation, Arg, Ctx, Field, ObjectType } from "type-graphql";
import { User, UserModel } from "../model/user.model";
import { merge } from "../utils/merge";
import { WithMongoSession } from "../utils/MongoSession.decorator";

@ObjectType()
class SignUpResponse {
 @Field(() => Boolean)
 ok: boolean;

 @Field({ nullable: true })
 error: string;

 @Field(() => User, { nullable: true })
 user?: User;
}

@Resolver()
export class SignUpResolver {
 @WithMongoSession()
 @Mutation(() => SignUpResponse)
 async SignUp(
  @Ctx() context: ExpressContext,
  @Arg("input", () => User) input: User
 ): Promise<SignUpResponse> {
  const response = new SignUpResponse();

  // what is transaction of database ?

  try {
   const useInstance = new UserModel();
   merge(useInstance, input);

   await useInstance.save();
   // error ouccred !!!

   response.ok = true;
   response.user = useInstance;
  } catch (e) {
   response.ok = false;
   response.error = JSON.stringify(e);
  }

  return response;
 }
}
