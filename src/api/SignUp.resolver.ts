import {Resolver, Mutation, Arg, Ctx} from "type-graphql";
import {GenerateResponse} from "../helper/BaseResponse.type";
import {User, UserModel} from "../model/user.model";
import {merge} from "../utils/merge";
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
            const user = new User();
            const useInstance = new UserModel(user);
            console.log({useInstance});
            merge(useInstance, input);
            console.log({input})
            console.log({useInstance})

            // await useInstance.save({
            //     session: context.session,
            // });

            await UserModel.create({
                name: input.name,
                email: input.email,
                phoneNumber: input.phoneNumber,
                userRole: input.userRole
            })
                .then(data => {
                    console.log(data);
                    console.log('Successfully inserted');
                })
                .catch(err => {
                    console.log('ERROR on Typegoose Create: ', err);
                });

            response.ok = true;
            response.setData(useInstance);
        } catch (e) {
            console.log({e});
            response.ok = false;
            response.error = JSON.stringify(e);
        }

        return response;
    }
}
