import { useMutation, useQueryClient } from "react-query";
import { likePost } from "../request/likePost";
import { createUseFeedQueryCacheKey } from "./useFeedQuery";

export const usePostLikeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, unknown, { postId: number }>(
    "feed",
    ({ postId }) => likePost(postId),
    {
      onSettled() {
        queryClient.invalidateQueries(createUseFeedQueryCacheKey());
      },
    }
  );
};
