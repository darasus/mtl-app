import { useMutation, useQueryClient } from "react-query";
import { deleteComment } from "../request/deleteComment";
import { createUseFeedQueryCacheKey } from "./useFeedQuery";

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, unknown, { commentId: number }>(
    ({ commentId }) => deleteComment(commentId),
    {
      onSuccess() {
        queryClient.invalidateQueries(createUseFeedQueryCacheKey());
      },
    }
  );
};
