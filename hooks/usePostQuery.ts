import { useQuery } from "react-query";
import { fetchPost } from "../request/fetchPost";

export const usePostQuery = (id: number) => {
  return useQuery(["post", id], () => fetchPost(id), {
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};
