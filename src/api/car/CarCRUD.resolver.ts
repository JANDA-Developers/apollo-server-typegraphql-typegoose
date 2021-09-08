import { Resolver, Ctx, Arg, Mutation, Query } from "type-graphql";
import CarModel, { Car } from "../../model/car.model";
import { Context } from "../SignIn.resolver";

@Resolver()
export class CarResolver {
 @Mutation(() => Car)
 async CarCreate(
  @Ctx() context: Context,
  @Arg("namesss") name: string
 ): Promise<any> {
  const newDocument = new CarModel();
  newDocument.name = name;
  newDocument.type = "자동차";
  newDocument.isProduction = false;
  await newDocument.save(); // database에 저장합니다.

  return newDocument;
 }

 @Mutation(() => Car)
 async CarUpdate(
  @Ctx() context: Context,
  @Arg("id") id: string,
  @Arg("name") name: string
 ): Promise<any> {
  const car = await CarModel.findById(id);
  if (!car) throw Error(`Car is not exsit with id ${id}`);
  car.name = name;
  return car;
 }

 @Mutation(() => Car)
 async CarDelete(@Ctx() context: Context, @Arg("id") id: string): Promise<any> {
  const car = await CarModel.findById(id);
  if (!car) throw Error(`Car is not exsit with id ${id}`);
  await car.remove();
  return car;
 }

 @Query(() => Car)
 async CarFindById(
  @Ctx() context: Context,
  @Arg("id") id: string
 ): Promise<any> {
  const car = await CarModel.findById(id);
  if (!car) throw Error(`Car is not exsit with id ${id}`);
  return car;
 }
}

// Grapql Schema
