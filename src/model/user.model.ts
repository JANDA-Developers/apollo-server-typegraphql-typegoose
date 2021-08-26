import { getModelForClass, Prop } from "@typegoose/typegoose";
import { Field, InputType, ObjectType, registerEnumType } from "type-graphql";
import { compare, hash } from "bcryptjs";
import { CollectionDataInterface } from "./abs/CollectionDataInterface";

enum UserRole {
 Admin = "Admin",
 Member = "Member",
}

registerEnumType(UserRole, {
 name: "UserRole",
});

@InputType("UserInput")
@ObjectType({
 implements: CollectionDataInterface,
})
export class User extends CollectionDataInterface {
 @Field()
 @Prop()
 name: string;

 @Field()
 @Prop({
  unique: true,
 })
 email: string;

 @Field()
 @Prop()
 phoneNumber: string;

 @Prop()
 _password: string;

 @Field(() => UserRole) // We don't know what is UserRole . from type-graqhl
 @Prop()
 userRole: UserRole;

 async hashPassword() {
  this._password = await this.hash(this._password);
 }

 async comparePassword(password: string): Promise<boolean> {
  return await compare(password, this._password || "");
 }

 private async hash(password: string) {
  return await hash(password, 3);
 }
}

export const UserModel = getModelForClass(User);
UserModel.createCollection();
