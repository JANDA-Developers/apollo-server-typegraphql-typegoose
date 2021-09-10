import { getModelForClass, Prop } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ObjectType } from "type-graphql";
import { ValueFilter } from "../helper/decorators/filter/FilterDecorators";
import { Sorting } from "../helper/decorators/sort/SortDecorator";
import { CollectionDataInterface } from "./abs/CollectionDataInterface";

@ObjectType()
export class Car extends CollectionDataInterface {
 @Field()
 @Prop()
 @ValueFilter(["contains", "eq"])
 name: string;

 @Prop()
 ownerId: ObjectId;

 @Field({ nullable: true })
 type?: string; // null

 @Field({ defaultValue: "red" })
 @Prop({ default: "" })
 @Sorting()
 @ValueFilter(["contains", "eq", "gte", "gt"])
 color: string;

 @Field()
 callDate: Date;

 @Prop()
 @ValueFilter(["eq"])
 isProduction: boolean;
}
// 3가지
// Graphql Schema
// Typescript Code
// Mongodb Schema

export const CarModel = getModelForClass(Car, {
 schemaOptions: {
  timestamps: true,
 },
});
CarModel.createCollection();

export default CarModel;
