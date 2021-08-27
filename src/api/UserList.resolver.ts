import { Resolver, Query, Arg } from "type-graphql";
import { generateFilterType } from "../helper/decorators/filter/generateFilterType";
import { generateSortType } from "../helper/decorators/sort/generateSortType";
import {
 OffsetPaginatedData,
 OffsetPagingInput,
} from "../helper/paging/PaginationWithOffset.type";
import { User, UserModel } from "../model/user.model";

export const UserFilterType = generateFilterType(User);
export const UserSortType = generateSortType(User);

const UserOffsetPaginatedData = OffsetPaginatedData(User);
type UserOffsetPaginatedData = typeof UserOffsetPaginatedData;

@Resolver()
export class UserListResolver {
 @Query(() => UserOffsetPaginatedData)
 async UserList(
  @Arg("pagingInput", () => OffsetPagingInput)
  { pageIndex, pageItemCount }: OffsetPagingInput,
  @Arg("filter", UserFilterType) filter: any,
  @Arg("sort", UserSortType) sort: any
 ): Promise<any> {
  const pagingResult = new UserOffsetPaginatedData();
  await pagingResult.setData(UserModel, {
   pageIndex,
   pageItemCount,
   filter,
   sort,
  });
  return pagingResult;
 }
}
