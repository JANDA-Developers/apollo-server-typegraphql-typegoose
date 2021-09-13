import { Resolver, Ctx, Arg, Mutation, Query } from "type-graphql";
import { generateFilterType } from "../../helper/decorators/filter/generateFilterType";
import { generateSortType } from "../../helper/decorators/sort/generateSortType";
import {
 OffsetPaginatedData,
 OffsetPagingInput,
} from "../../helper/paging/PaginationWithOffset.type";
import CarModel, { Car, CarType } from "../../model/car/car.model";
import { Context } from "../../type/context";

export const UserFilterType = generateFilterType(Car); // for graphql
export const UserSortType = generateSortType(Car);

const UserOffsetPaginatedData = OffsetPaginatedData(Car); // for graphql
type UserOffsetPaginatedData = typeof UserOffsetPaginatedData;

@Resolver()
export class CarResolver {
 @Mutation(() => Car)
 async CarCreate(
  @Ctx() context: Context,
  @Arg("namesss") name: string
 ): Promise<any> {
  if (!context.user) throw Error("");
  const newDocument = new CarModel();
  newDocument.onwerId = context.user?._id;

  newDocument.name = name;
  newDocument.type = CarType.Bus;
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
  if (car?.isDeleted) throw Error(`Car is already deleted id:${id}`);
  if (!car) throw Error(`Car is not exsit with id ${id}`);
  car.name = name;
  return car;
 }

 @Mutation(() => Car)
 async CarDelete(@Ctx() context: Context, @Arg("id") id: string): Promise<any> {
  const car = await CarModel.findById(id);
  if (!car) throw Error(`Car is not exsit with id ${id}`);
  car.isDeleted = true;
  await car.save();
  return car;
 }

 @Query(() => Car)
 async CarFindById(
  @Ctx() context: Context,
  @Arg("id") id: string
 ): Promise<any> {
  const car = await CarModel.findById(id);
  if (!car) throw Error(`Car is not exsit with id ${id}`);

  car.onwerId;

  return car;
 }

 @Query(() => UserOffsetPaginatedData)
 async CarList(
  @Arg("pagingInput", () => OffsetPagingInput)
  { pageIndex, pageItemCount }: OffsetPagingInput,
  @Arg("filter", UserFilterType, { nullable: true }) filter: any,
  @Arg("sort", UserSortType, { nullable: true }) sort: any
 ): Promise<any> {
  const pagingResult = new UserOffsetPaginatedData();
  await pagingResult.setData(CarModel, {
   pageIndex,
   pageItemCount,
   filter,
   sort,
  });
  return pagingResult;
 }
}

// Grapql Schema
