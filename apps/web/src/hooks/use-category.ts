import { useQuery } from "@tanstack/react-query";
import type { categoryType } from "../../../../packages/types/category.type";
import { listBookByCategoryQuery } from "#/queries/book.query";


export function useListCategory(){
    return useQuery<categoryType[]>(listBookByCategoryQuery)
}
export type UseListCategoryResult = ReturnType<typeof useListCategory>;