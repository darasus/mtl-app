import { useUser } from "@clerk/nextjs";
import { v4 } from "uuid";
import { useMutation, useQueryClient } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { CommentService } from "../../lib/prismaServices/CommentService";
import { Comment } from "../../types/Comment";
import { withToast } from "../../utils/withToast";
import { useFetcher } from "../useFetcher";

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
  const me = useUser();
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
          (old: any) => {
            const comment: Comment = {
              author: {
                id: me.id,
                fullname: me.fullName as string,
                image: me.profileImageUrl,
                username: me.username as string,
                createdAt: me.createdAt,
                email: me.primaryEmailAddress?.emailAddress as string,
                updatedAt: me.updatedAt,
              },
              isMyComment: true,
              authorId: me?.id,
              content,
              createdAt: new Date(),
              id: v4(),
              postId,
              updatedAt: new Date(),
            };
            return {
              ...old,
              items: [...old.items, comment],
            };
          }
        );

        return { prev };
      },
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
