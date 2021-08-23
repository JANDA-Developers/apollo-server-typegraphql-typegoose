import { ExpressContext } from "apollo-server-express";
import {
 Resolver,
 Mutation,
 Arg,
 Ctx,
 Field,
 InputType,
 ObjectType,
} from "type-graphql";
import { User, UserModel } from "../model/user.model";
import { WithMongoSession } from "../utils/MongoSession.decorator";

@InputType()
class SignUpInput {
 @Field()
 name: string;
}

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
  @Arg("input", () => SignUpInput) input: SignUpInput
 ): Promise<SignUpResponse> {
  const response = new SignUpResponse();

  // what is transaction of database ?

  try {
   const useInstance = new UserModel();
   useInstance.name = input.name;
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
