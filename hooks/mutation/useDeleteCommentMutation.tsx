import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-hot-toast";
import { Text } from "@chakra-ui/layout";
import { useFetcher } from "../useFetcher";
import { clientCacheKey } from "../../lib/ClientCacheKey";

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
        await queryClient.cancelQueries(
          clientCacheKey.createPostCommentsKey(postId)
        );

        const prev = queryClient.getQueryData(
          clientCacheKey.createPostCommentsKey(postId)
        );

        queryClient.setQueryData(
          clientCacheKey.createPostCommentsKey(postId),
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
            clientCacheKey.createPostCommentsKey(postId),
            context.prev
          );
        }
      },
      onSettled(_, __, { postId }) {
        queryClient.invalidateQueries(
          clientCacheKey.createPostCommentsKey(postId)
        );
        queryClient.invalidateQueries(clientCacheKey.createPostKey(postId));
      },
    }
  );
};
