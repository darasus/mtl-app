import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { addComment } from "../../request/addComment";
import { createUseFeedQueryCacheKey } from "../query/useFeedQuery";
import { createUsePostQueryCacheKey } from "../query/usePostQuery";

export const usePostCommentMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<unknown, unknown, { postId: number; content: string }>(
    ({ postId, content }) => addComment(postId, content),
    {
      onSuccess() {
        queryClient.invalidateQueries(createUseFeedQueryCacheKey());

        const postId = Number(router.query.id);

        if (postId) {
          queryClient.invalidateQueries(createUsePostQueryCacheKey(postId));
        }
      },
    }
  );
};
