import { Prop } from "@typegoose/typegoose";
import { Field, InputType, ObjectType } from "type-graphql";

@InputType("CompanyInput")
@ObjectType()
export class Company {
 @Field()
 @Prop()
 name: string;

 @Field()
 @Prop()
 contact: number;
}
