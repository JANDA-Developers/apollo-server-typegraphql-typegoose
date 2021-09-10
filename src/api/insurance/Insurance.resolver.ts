import { Resolver, Ctx, Arg, Mutation, Query } from "type-graphql";
import { generateFilterType } from "../../helper/decorators/filter/generateFilterType";
import { generateInputDataType } from "../../helper/decorators/filter/generateInputType";
import { generateSortType } from "../../helper/decorators/sort/generateSortType";
import {
 OffsetPaginatedData,
 OffsetPagingInput,
} from "../../helper/paging/PaginationWithOffset.type";
import InsuranceModel, { Insurance } from "../../model/insurance.model";
import { Context } from "../../type/context";
import { merge } from "../../utils/merge";

const InsuranceInput = generateInputDataType(Insurance, {
 purpose: "create",
 name: "InsuranceInput",
});
type InsuranceInput = typeof InsuranceInput;
export const UserFilterType = generateFilterType(Insurance); // for graphql
export const UserSortType = generateSortType(Insurance);

const UserOffsetPaginatedData = OffsetPaginatedData(Insurance); // for graphql
type UserOffsetPaginatedData = typeof UserOffsetPaginatedData;

@Resolver()
export class InsuranceResolver {
 @Mutation(() => Insurance)
 async InsuranceCreate(
  @Ctx() context: Context,
  @Arg("input", () => InsuranceInput) input: InsuranceInput
 ): Promise<any> {
  if (!context.user) throw Error("");
  const newDocument = new InsuranceModel();
  merge(newDocument, input);
  await newDocument.save(); // database에 저장합니다.

  return newDocument;
 }

 @Mutation(() => Insurance)
 async InsuranceUpdate(
  @Ctx() context: Context,
  @Arg("id") id: string,
  @Arg("name") name: string
 ): Promise<any> {
  const insurance = await InsuranceModel.findById(id);
  if (insurance?.isDeleted)
   throw Error(`Insurance is already deleted id:${id}`);
  if (!insurance) throw Error(`Insurance is not exsit with id ${id}`);
  insurance.name = name;
  return insurance;
 }

 @Mutation(() => Insurance)
 async InsuranceDelete(
  @Ctx() context: Context,
  @Arg("id") id: string
 ): Promise<any> {
  const insurance = await InsuranceModel.findById(id);
  if (!insurance) throw Error(`Insurance is not exsit with id ${id}`);
  insurance.isDeleted = true;
  await insurance.save();
  return insurance;
 }

 @Query(() => Insurance)
 async InsuranceFindById(
  @Ctx() context: Context,
  @Arg("id") id: string
 ): Promise<any> {
  const insurance = await InsuranceModel.findById(id);
  if (!insurance) throw Error(`Insurance is not exsit with id ${id}`);
  return insurance;
 }

 @Query(() => UserOffsetPaginatedData)
 async InsuranceList(
  @Arg("pagingInput", () => OffsetPagingInput)
  { pageIndex, pageItemCount }: OffsetPagingInput,
  @Arg("filter", UserFilterType, { nullable: true }) filter: any,
  @Arg("sort", UserSortType, { nullable: true }) sort: any
 ): Promise<any> {
  const pagingResult = new UserOffsetPaginatedData();
  await pagingResult.setData(InsuranceModel, {
   pageIndex,
   pageItemCount,
   filter,
   sort,
  });
  return pagingResult;
 }
}

// Grapql Schema
