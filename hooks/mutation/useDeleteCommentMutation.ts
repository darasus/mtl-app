import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { deleteComment } from "../../request/deleteComment";
import { commentsKey } from "../query/useCommentsQuery";
import { createUseFeedQueryCacheKey } from "../query/useFeedQuery";
import { createUsePostQueryCacheKey } from "../query/usePostQuery";

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<unknown, unknown, { commentId: number }>(
    ({ commentId }) => deleteComment(commentId),
    {
      onSuccess() {
        queryClient.invalidateQueries(createUseFeedQueryCacheKey());
        queryClient.invalidateQueries(commentsKey.base);

        const postId = Number(router.query.id);

        if (postId) {
          queryClient.invalidateQueries(createUsePostQueryCacheKey(postId));
        }
      },
    }
  );
};
