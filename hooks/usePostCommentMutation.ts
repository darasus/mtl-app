import { useMutation, useQueryClient } from "react-query";
import { addComment } from "../request/addComment";
import { createUseFeedQueryCacheKey } from "./useFeedQuery";

export const usePostCommentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, unknown, { postId: number; content: string }>(
    ({ postId, content }) => addComment(postId, content),
    {
      onSettled() {
        queryClient.invalidateQueries(createUseFeedQueryCacheKey());
      },
    }
  );
};
