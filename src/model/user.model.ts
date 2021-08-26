import { getModelForClass, Prop } from "@typegoose/typegoose";
import { Field, InputType, ObjectType, registerEnumType } from "type-graphql";

enum UserRole {
 Admin = "Admin",
 Member = "Member",
}

registerEnumType(UserRole, {
 name: "UserRole",
});

@InputType("UserInput")
@ObjectType()
export class User {
<<<<<<< HEAD
 @Field()
 @Prop()
 name: string;

 @Field()
 @Prop()
 phoneNumber: string;

 @Field(() => UserRole) // We don't know what is UserRole . from type-graqhl
 @Prop()
 userRole: UserRole;
=======
@Field()
@Prop()
id: string;
 
@Field()
@Prop()
name: string;
>>>>>>> master
}




export const UserModel = getModelForClass(User);
UserModel.createCollection();
