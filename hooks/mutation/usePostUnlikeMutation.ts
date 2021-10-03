import { useMutation, useQueryClient } from "react-query";
import { unlikePost } from "../../request/unlikePost";
import { createUseFeedQueryCacheKey } from "../query/useFeedQuery";

export const usePostUnlikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, unknown, { postId: number }>(
    ({ postId }) => unlikePost(postId),
    {
      onSettled() {
        queryClient.invalidateQueries(createUseFeedQueryCacheKey());
      },
    }
  );
};
