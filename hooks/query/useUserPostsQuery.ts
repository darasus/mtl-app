import { useQuery } from "react-query";
import { fetchUserPosts } from "../../request/fetchUserPosts";

export const useUserPostsQuery = (id: number) => {
  return useQuery(["feed", id], () => fetchUserPosts(id), {
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};
