/* eslint-disable @typescript-eslint/ban-types */
import { ObjectType, Field } from "type-graphql";

export const GenerateResponse = <T>(tClass: Function, name: string) => {
 @ObjectType(`${name || tClass.name}Response`)
 class BaseResponseClass extends PlainResponse {
  constructor(ok?: boolean) {
   super(ok);
  }

  @Field(() => tClass, { nullable: true })
  data?: T;

  setData(data: T) {
   this.data = data;
  }

  setError(error: string, ok?: boolean) {
   if (error) {
    this.error = error;
   }
   this.ok = ok != null ? ok : false;
  }
 }
 return BaseResponseClass;
};

export const GenerateArrayReturnResponse = <T>(
 tClass: Function,
 name: string
) => {
 @ObjectType(`${name || tClass.name}Response`)
 class BaseArrayResponseClass extends PlainResponse {
  constructor(ok?: boolean) {
   super(ok);
  }

  @Field(() => [tClass])
  data?: T[] = [];

  setData(data: T[]) {
   this.data = data;
  }
 }
 return BaseArrayResponseClass;
};

export interface PlainResponse {
 setData(args: any): void;
}
@ObjectType("Response")
export class PlainResponse {
 constructor(ok?: boolean) {
  this.ok = ok === false ? false : true;
 }

 @Field(() => Boolean)
 ok: boolean;

 @Field(() => String, { nullable: true })
 error?: string;

 setError(error: string, ok?: boolean) {
  this.error = error;
  this.ok = ok != null ? ok : false;
 }
}
