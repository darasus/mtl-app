import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { deleteComment } from "../request/deleteComment";
import { createUseFeedQueryCacheKey } from "./query/useFeedQuery";
import { createUsePostQueryCacheKey } from "./query/usePostQuery";

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<unknown, unknown, { commentId: number }>(
    ({ commentId }) => deleteComment(commentId),
    {
      onSuccess() {
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
