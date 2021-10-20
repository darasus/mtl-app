import { useMutation, useQueryClient } from "react-query";
import { createUsePostQueryCacheKey } from "../query/usePostQuery";
import { toast } from "react-hot-toast";
import { Text } from "@chakra-ui/react";
import { useFetcher } from "../useFetcher";

export const usePostLikeMutation = () => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();

  return useMutation(
    ({ postId }: { postId: number }) =>
      toast.promise(fetcher.likePost(postId), {
        loading: <Text fontSize="sm">{"Liking..."}</Text>,
        success: <Text fontSize="sm">{"Liked!"}</Text>,
        error: <Text fontSize="sm">{"Did not like."}</Text>,
      }),
    {
      onMutate: async ({ postId }) => {
        await queryClient.cancelQueries(createUsePostQueryCacheKey(postId));

        const prev = queryClient.getQueryData(
          createUsePostQueryCacheKey(postId)
        );

        queryClient.setQueryData(
          createUsePostQueryCacheKey(postId),
          (old: any) => {
            return {
              ...old,
              likesCount: old.likesCount + 1,
              isLikedByMe: true,
            };
          }
        );

        return { prev };
      },
      onError: (_, { postId }, context: any) => {
        if (context?.prev) {
          queryClient.setQueryData(
            createUsePostQueryCacheKey(postId),
            context.prev
          );
        }
      },
      onSettled(_, __, { postId }) {
        queryClient.invalidateQueries(createUsePostQueryCacheKey(postId));
      },
    }
  );
};
