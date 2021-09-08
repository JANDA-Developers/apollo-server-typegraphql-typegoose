import { getModelForClass, Prop } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Car {
 @Field()
 @Prop()
 name: string;

 @Prop()
 ownerId: string;

 @Field()
 type: string; // null

 @Field()
 @Prop()
 color: string;

 @Field()
 callDate: Date;

 @Prop()
 isProduction: boolean;
}
// 3가지
// Graphql Schema
// Typescript Code
// Mongodb Schema ???

export const CarModel = getModelForClass(Car);
CarModel.createCollection();

export default CarModel;
