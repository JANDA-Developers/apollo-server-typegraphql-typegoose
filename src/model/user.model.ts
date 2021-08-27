import { getModelForClass, Prop } from "@typegoose/typegoose";
import { Field, InputType, ObjectType, registerEnumType } from "type-graphql";
import { compare, hash } from "bcryptjs";
import { CollectionDataInterface } from "./abs/CollectionDataInterface";
import { ValueFilter } from "../helper/decorators/filter/FilterDecorators";
import { Sorting } from "../helper/decorators/sort/SortDecorator";

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
 @ValueFilter(["contains", "eq"])
 @Sorting()
 @Prop()
 name: string;

 @Field()
 @ValueFilter(["contains", "eq"])
 @Sorting()
 @Prop({
  unique: true,
 })
 email: string;

 @Field()
 @ValueFilter(["contains", "eq"])
 @Prop()
 phoneNumber: string;

 @Prop()
 _password: string;

 @Field(() => UserRole) // We don't know what is UserRole . from type-graqhl
 @ValueFilter(["contains", "eq"])
 @Prop()
 userRole: UserRole;

 // async saveUsers(test) {
 //  console.log(test);
 // }

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

