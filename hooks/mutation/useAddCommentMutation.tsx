import { Text } from "@chakra-ui/react";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { CommentService } from "../../lib/api/CommentService";
import { commentsKey } from "../query/useCommentsQuery";
import { useFetcher } from "../useFetcher";
import { useMe } from "../useMe";

type Page = ReturnType<CommentService["getCommentsByPostId"]>;

type Comments = {
  pages: Page[];
};

type Variables = { postId: number; content: string; take: number };

export const useAddCommentMutation = () => {
  const queryClient = useQueryClient();
  const { me, isLoading } = useMe();
  const fetcher = useFetcher();

  return useMutation(
    ({ postId, content }: Variables) =>
      toast.promise(fetcher.addComment(postId, content), {
        loading: <Text fontSize="sm">{"Posting comment..."}</Text>,
        success: <Text fontSize="sm">{"Comment posted!"}</Text>,
        error: <Text fontSize="sm">{"Comment is not posted."}</Text>,
      }),
    {
      onMutate: async ({ postId, content }) => {
        await queryClient.cancelQueries(commentsKey.postComments(postId));

        const prev = queryClient.getQueryData<Comments>(
          commentsKey.postComments(postId)
        );

        queryClient.setQueryData(
          commentsKey.postComments(postId),
          (old: any) => {
            return {
              ...old,
              items: [
                ...old.items,
                {
                  author: me,
                  authorId: me?.id,
                  content,
                  createdAt: new Date().toISOString(),
                  id: Math.random(),
                  postId,
                  updatedAt: new Date().toISOString(),
                },
              ],
            };
          }
        );

        return { prev };
      },
      onError: (_, { postId }, context: any) => {
        if (context?.prev) {
          queryClient.setQueryData<Comments>(
            commentsKey.postComments(postId),
            context.prev
          );
        }
      },
      onSettled(_, __, { postId }) {
        queryClient.invalidateQueries(commentsKey.postComments(postId));
      },
    }
  );
};
