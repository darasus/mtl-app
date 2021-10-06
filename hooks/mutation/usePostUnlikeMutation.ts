import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { unlikePost } from "../../request/unlikePost";
import { createUseFeedQueryCacheKey } from "../query/useFeedQuery";
import { createUsePostQueryCacheKey } from "../query/usePostQuery";

export const usePostUnlikeMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<unknown, unknown, { postId: number }>(
    ({ postId }) => unlikePost(postId),
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
