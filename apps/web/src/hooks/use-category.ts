import { useQuery } from "@tanstack/react-query";
import type { CategoryType } from "@repo/types";
import { listBookByCategoryQuery } from "#/queries/book.query";


export function useListCategory(){
    return useQuery<CategoryType.categoryType[]>(listBookByCategoryQuery)
}
export type UseListCategoryResult = ReturnType<typeof useListCategory>;