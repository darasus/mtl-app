import { useMutation, useQueryClient } from "react-query";
import { deleteComment } from "../../request/deleteComment";
import { commentsKey } from "../query/useCommentsQuery";
import { createUsePostQueryCacheKey } from "../query/usePostQuery";
import { toast } from "react-hot-toast";
import { Text } from "@chakra-ui/layout";

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ commentId }: { commentId: number; postId: number }) =>
      toast.promise(deleteComment(commentId), {
        loading: <Text fontSize="sm">{"Posting comment..."}</Text>,
        success: <Text fontSize="sm">{"Comment posted!"}</Text>,
        error: <Text fontSize="sm">{"Comment is not posted."}</Text>,
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
