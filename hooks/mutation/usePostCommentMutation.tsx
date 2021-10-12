import { Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { addComment } from "../../request/addComment";
import { commentsKey } from "../query/useCommentsQuery";
import { createUseFeedQueryCacheKey } from "../query/useFeedQuery";
import { useMeQuery } from "../query/useMeQuery";
import { createUsePostQueryCacheKey } from "../query/usePostQuery";

export const usePostCommentMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const me = useMeQuery();

  return useMutation<unknown, unknown, { postId: number; content: string }>(
    ({ postId, content }) =>
      toast.promise(addComment(postId, content), {
        loading: <Text fontSize="sm">{"Commenting..."}</Text>,
        success: <Text fontSize="sm">{"Comment posted!"}</Text>,
        error: <Text fontSize="sm">{"Comment is not posted."}</Text>,
      }),
    {
      onMutate: async ({ postId, content }) => {
        await queryClient.cancelQueries(commentsKey.base);
        const previousComments = queryClient.getQueryData(
          commentsKey.postComments(postId)
        );
        queryClient.setQueryData(
          commentsKey.postComments(postId),
          (old: any) => {
            const lastPage = old.pages[old.pages.length - 1];
            const lastComment = lastPage.items[lastPage.items.length - 1];
            const lastCommentId = lastComment.id;
            return {
              pages: [
                {
                  count: 1,
                  cursor: 0,
                  total: 1,
                  items: [
                    {
                      author: me.data,
                      authorId: me.data?.id,
                      content,
                      createdAt: new Date().toISOString(),
                      id: lastCommentId + 1,
                      postId,
                      updatedAt: new Date().toISOString(),
                    },
                  ],
                },
                ...old.pages,
              ],
            };
          }
        );
        return { previousComments };
      },
      // onSuccess() {
      //   queryClient.invalidateQueries(createUseFeedQueryCacheKey());

      //   const postId = Number(router.query.id);

      //   if (postId) {
      //     queryClient.invalidateQueries(createUsePostQueryCacheKey(postId));
      //   }
      // },
    }
  );
};
