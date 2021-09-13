import { getModelForClass, Prop } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ObjectType, registerEnumType } from "type-graphql";
import { ValueFilter } from "../../helper/decorators/filter/FilterDecorators";
import { Sorting } from "../../helper/decorators/sort/SortDecorator";
import { CollectionDataInterface } from "../abs/CollectionDataInterface";
import { User, UserModel } from "../user.model";
import { Company } from "./company.model";

export enum CarType {
 Vehecle = "Vehecle",
 Bus = "Bus",
 Airplan = "Airplan",
}

registerEnumType(CarType, {
 name: "CarType",
});

@ObjectType()
export class Car extends CollectionDataInterface {
 @Field()
 @Prop()
 @ValueFilter(["contains", "eq"])
 name: string;

 @Prop()
 onwerId: ObjectId;

 @Prop()
 onwerName: string;

 @Field(() => CarType)
 @Prop()
 type?: CarType; // null

 @Field({ defaultValue: "red" })
 @Prop({ default: "" })
 @Sorting()
 @ValueFilter(["contains", "eq", "gte", "gt"])
 color: string;

 @Field()
 callDate: Date;

 @Field(() => [Company], { nullable: true })
 @Prop()
 comapny: Company[];

 @Field(() => User)
 async onwer() {
  return await UserModel.findById(this.onwerId);
 }

 // 임베딩
 // 필드 리솔버

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
