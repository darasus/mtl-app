import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { likePost } from "../../request/likePost";
import { createUseFeedQueryCacheKey } from "../query/useFeedQuery";
import { createUsePostQueryCacheKey } from "../query/usePostQuery";

export const usePostLikeMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<unknown, unknown, { postId: number }>(
    ({ postId }) => likePost(postId),
    {
      onSettled() {
        queryClient.invalidateQueries(createUseFeedQueryCacheKey());
        if (router.query.id) {
          queryClient.invalidateQueries(
            createUsePostQueryCacheKey(Number(router.query.id))
          );
        }
      },
    }
  );
};
