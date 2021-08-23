import { getModelForClass, Prop } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
class User {
 @Field()
 @Prop()
 name: string;
}

export const UserModel = getModelForClass(User);
UserModel.createCollection();
