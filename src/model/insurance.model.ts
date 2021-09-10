import { getModelForClass, Prop } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { ValueFilter } from "../helper/decorators/filter/FilterDecorators";
import { ObjectId } from "mongodb";
import { CollectionDataInterface } from "./abs/CollectionDataInterface";
import { Sorting } from "../helper/decorators/sort/SortDecorator";
import { Input } from "../helper/decorators/filter/InputDecoratorFunction";

@ObjectType()
export class Insurance extends CollectionDataInterface {
 @Prop()
 @Field()
 @Input()
 @ValueFilter(["contains", "eq"])
 name: string;

 @Field()
 @Prop()
 @Sorting()
 @Input()
 @ValueFilter(["contains", "eq", "gte", "lte"])
 price: number;

 @Field()
 @Prop()
 untill: Date;

 @Field()
 @Prop()
 carType: string;

 @Field(() => String)
 @Prop()
 carId: ObjectId;

 @Field()
 @Prop()
 carName: string;

 @Field()
 @Prop()
 onwerId: string;

 @Field()
 @Prop()
 onwerName: string;
}

export const InsuranceModel = getModelForClass(Insurance, {
 schemaOptions: {
  timestamps: true,
 },
});

InsuranceModel.createCollection();

export default InsuranceModel;
