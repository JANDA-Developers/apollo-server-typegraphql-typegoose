import { ClassType, ObjectType, Field, Int, InputType } from "type-graphql";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { toMongoQuery } from "../decorators/filter/FilterDecoratorFunctions";
import { FilterQuery } from "mongoose";

@ObjectType()
export class OffsetPagingInfo {
 constructor(input: {
  totalDocumentCount: number;
  pageItemCount: number;
  page: number;
  currentItemCount: number;
 }) {
  const { page, currentItemCount, pageItemCount, totalDocumentCount } = input;
  this.pageIndex = page;
  this.pageItemCount = pageItemCount;
  this.totalPageCount = Math.ceil(totalDocumentCount / pageItemCount);
  this.currentItemCount = currentItemCount;
  this.totalDocumentCount = totalDocumentCount;
 }

 @Field(() => Int, { description: "선택한 페이지 번호" })
 pageIndex: number;

 @Field(() => Int, { description: "페이지당 기준 데이터 수" })
 pageItemCount: number;

 @Field(() => Int, { description: "현재 페이지에서 출력한 데이터 수" })
 currentItemCount: number;

 @Field(() => Int, { description: "전체 페이지 수" })
 totalPageCount: number;

 @Field(() => Int, { description: "전체 아이템 수" })
 totalDocumentCount: number;
}

@InputType()
export class OffsetPagingInput {
 @Field(() => Int)
 pageIndex: number;

 @Field(() => Int)
 pageItemCount: number;
}

export const OffsetPaginatedData = <TItem>(TItemClass: ClassType<TItem>) => {
 @ObjectType(`OffsetPagenated${TItemClass.name}Data`)
 class OffsetPagenatedData {
  @Field(() => OffsetPagingInfo, { nullable: true })
  pageInfo: OffsetPagingInfo;

  @Field(() => [TItemClass])
  items: TItem[];

  public async setData(
   model: ModelType<TItem>,
   pageInfo: {
    pageIndex: number;
    pageItemCount: number;
    query?: FilterQuery<TItem>;
    filter?: FilterQuery<TItem>;
    sort?: string[];
   }
  ): Promise<void> {
   const { filter = {}, pageIndex, pageItemCount, sort, query = {} } = pageInfo;
   const filterQuery = toMongoQuery(filter);
   const sortQuery = toMongoSort(sort);

   console.log({ filter });
   console.log({ filterQuery });

   const [totalDocumentCount, items] = await Promise.all([
    model.find(filterQuery).find(query).countDocuments(),
    model
     .find(query)
     .find(filterQuery)
     .skip(pageIndex * pageItemCount)
     .limit(pageItemCount)
     .sort(sortQuery)
     .exec(),
   ]);
   this.items = items;
   this.pageInfo = new OffsetPagingInfo({
    page: pageIndex,
    currentItemCount: items.length,
    totalDocumentCount,
    pageItemCount: pageItemCount,
   });
  }
 }
 return OffsetPagenatedData;
};

const toMongoSort = (rawSort?: string[]) => {
 if (!rawSort) {
  return undefined;
 }
 const temp = {} as any;
 rawSort.forEach((r) => {
  const d = r.split("__");
  temp[d[0]] = d[1] === "asc" ? 1 : -1;
 });
 return temp;
};
