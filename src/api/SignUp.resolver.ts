import {Resolver, Mutation, Arg, Ctx} from "type-graphql";
import {GenerateResponse} from "../helper/BaseResponse.type";
import {User, UserModel} from "../model/user.model";
import {WithMongoSession} from "../utils/MongoSession.decorator";
import {Context} from "./SignIn.resolver";

const SignUpResponse = GenerateResponse(User, "SignUp");
type TSignUpResponse = InstanceType<typeof SignUpResponse>;


@Resolver()
export class SignUpResolver {
    @WithMongoSession()
    @Mutation(() => SignUpResponse)
    async SignUp(
        @Ctx() context: Context,
        @Arg("input", () => User) input: User
    ): Promise<TSignUpResponse> {
        const response = new SignUpResponse();

        try {
            const newUser = new User(input);
            const useInstance = new UserModel(newUser);
 
            await useInstance.save({
                session: context.session,
            });

            response.ok = true;
            response.setData(useInstance);
        } catch (e) {
            console.log({e});
            response.ok = false;
            response.error = JSON.stringify(e);
        }


        console.log("response.data");
        console.log(response.data);
        return response;
    }
}
