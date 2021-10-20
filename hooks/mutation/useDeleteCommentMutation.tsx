import { useMutation, useQueryClient } from "react-query";
import { commentsKey } from "../query/useCommentsQuery";
import { createUsePostQueryCacheKey } from "../query/usePostQuery";
import { toast } from "react-hot-toast";
import { Text } from "@chakra-ui/layout";
import { useFetcher } from "../useFetcher";

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();

  return useMutation(
    ({ commentId }: { commentId: number; postId: number }) =>
      toast.promise(fetcher.deleteComment(commentId), {
        loading: <Text fontSize="sm">{"Deleting comment..."}</Text>,
        success: <Text fontSize="sm">{"Comment deleted!"}</Text>,
        error: <Text fontSize="sm">{"Comment is not deleted."}</Text>,
      }),
    {
      onMutate: async ({ postId, commentId }) => {
        await queryClient.cancelQueries(commentsKey.postComments(postId));

        const prev = queryClient.getQueryData(commentsKey.postComments(postId));

        queryClient.setQueryData(
          commentsKey.postComments(postId),
          (old: any) => {
            return {
              ...old,
              items: old.items.filter(
                (comment: any) => comment.id !== commentId
              ),
            };
          }
        );

        return { prev };
      },
      onError: (_, { postId }, context: any) => {
        if (context?.prev) {
          queryClient.setQueryData(
            commentsKey.postComments(postId),
            context.prev
          );
        }
      },
      onSettled(_, __, { postId }) {
        queryClient.invalidateQueries(commentsKey.postComments(postId));
        queryClient.invalidateQueries(createUsePostQueryCacheKey(postId));
      },
    }
  );
};
