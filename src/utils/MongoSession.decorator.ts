import { mongoose } from "@typegoose/typegoose";
import { createMethodDecorator } from "type-graphql";

export function WithMongoSession() {
 return createMethodDecorator<any>(async ({ context }, next) => {
  context.session = await mongoose.startSession();
  try {
   await context.session.startTransaction();
   const result = await next();
   if (result && !result?.ok) {
    await context.session.abortTransaction();
   } else {
    await context.session.commitTransaction();
   }
  } finally {
   context.session.endSession();
  }
 });
}
