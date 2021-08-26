import { Field, InterfaceType } from "type-graphql";
import { Prop } from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";

@InterfaceType({
 resolveType: (value) => value.constructor.name,
})
export class CollectionDataInterface extends Base {
 constructor(args?: any) {
  super();
  if (args) {
   for (const key in args) {
    const element = args[key];
    this[key] = element;
   }
  }
 }

 @Prop()
 createdAt: Date;
 // readonly

 @Prop()
 updatedAt: Date;

 @Prop()
 isDeleted?: boolean;
}

{
 Field(() => String)(CollectionDataInterface.prototype, "_id");

 Field(() => Date)(CollectionDataInterface.prototype, "updatedAt");

 Field(() => Date)(CollectionDataInterface.prototype, "createdAt");

 Field(() => Boolean, { nullable: true })(
  CollectionDataInterface.prototype,
  "isDeleted"
 );
}
