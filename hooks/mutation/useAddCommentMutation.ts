import { useMutation, useQueryClient } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { CommentService } from "../../lib/prismaServices/CommentService";
import { withToast } from "../../utils/withToast";
import { useFetcher } from "../useFetcher";
import { useMe } from "../useMe";

type Page = ReturnType<CommentService["getCommentsByPostId"]>;

type Comments = {
  pages: Page[];
};

type Variables = { postId: string; content: string; take: number };

const toastConfig = {
  loading: "Posting comment...",
  success: "Comment posted!",
  error: "Comment is not posted.",
};

export const useAddCommentMutation = () => {
  const queryClient = useQueryClient();
  const me = useMe();
  const fetcher = useFetcher();

  return useMutation(
    ({ postId, content }: Variables) =>
      withToast(fetcher.addComment(postId, content), toastConfig),
    {
      onMutate: async ({ postId, content }) => {
        await queryClient.cancelQueries(
          clientCacheKey.createPostCommentsKey(postId)
        );

        const prev = queryClient.getQueryData<Comments>(
          clientCacheKey.createPostCommentsKey(postId)
        );

        queryClient.setQueryData(
          clientCacheKey.createPostCommentsKey(postId),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (old: any) => {
            return {
              ...old,
              items: [
                ...old.items,
                {
                  author: me,
                  authorId: me?.user?.id,
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (_, { postId }, context: any) => {
        if (context?.prev) {
          queryClient.setQueryData<Comments>(
            clientCacheKey.createPostCommentsKey(postId),
            context.prev
          );
        }
      },
      onSettled(_, __, { postId }) {
        queryClient.invalidateQueries(
          clientCacheKey.createPostCommentsKey(postId)
        );
      },
    }
  );
};
