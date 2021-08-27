import { ExpressContext } from "apollo-server-express";
import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { GenerateResponse } from "../helper/BaseResponse.type";
import { User, UserModel } from "../model/user.model";
import { merge } from "../utils/merge";
import { WithMongoSession } from "../utils/MongoSession.decorator";

const SignUpResponse = GenerateResponse(User, "SignUp");
type TSignUpResponse = InstanceType<typeof SignUpResponse>;

@Resolver()
export class SignUpResolver {
 @WithMongoSession()
 @Mutation(() => SignUpResponse)
 async SignUp(
  @Ctx() context: ExpressContext,
  @Arg("input", () => User) input: User
 ): Promise<TSignUpResponse> {
  const response = new SignUpResponse();

  // what is transaction of database ?

  try {
   const useInstance = new UserModel();
   merge(useInstance, input);

   await useInstance.save();
   response.ok = true;
   response.data = useInstance;
  } catch (e) {
   response.ok = false;
   response.error = JSON.stringify(e);
  }

  return response;
 }
}
