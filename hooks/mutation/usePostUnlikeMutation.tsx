import { Text } from "@chakra-ui/react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { Fetcher } from "../../lib/Fetcher";
import { createUsePostQueryCacheKey } from "../query/usePostQuery";

export const usePostUnlikeMutation = () => {
  const queryClient = useQueryClient();
  const fetcher = new Fetcher();

  return useMutation<unknown, unknown, { postId: number }>(
    ({ postId }) =>
      toast.promise(fetcher.unlikePost(postId), {
        loading: <Text fontSize="sm">{"Unliking..."}</Text>,
        success: <Text fontSize="sm">{"Unliked!"}</Text>,
        error: <Text fontSize="sm">{"Did not unlike."}</Text>,
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
              likesCount: old.likesCount - 1,
              isLikedByMe: false,
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
