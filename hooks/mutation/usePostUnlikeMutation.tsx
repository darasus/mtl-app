import { Text } from "@chakra-ui/react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { useFetcher } from "../useFetcher";

export const usePostUnlikeMutation = () => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();

  return useMutation<unknown, unknown, { postId: number }>(
    ({ postId }) =>
      toast.promise(fetcher.unlikePost(postId), {
        loading: <Text fontSize="sm">{"Unliking..."}</Text>,
        success: <Text fontSize="sm">{"Unliked!"}</Text>,
        error: <Text fontSize="sm">{"Did not unlike."}</Text>,
      }),
    {
      onMutate: async ({ postId }) => {
        await queryClient.cancelQueries(clientCacheKey.createPostKey(postId));

        const prev = queryClient.getQueryData(
          clientCacheKey.createPostKey(postId)
        );

        queryClient.setQueryData(
          clientCacheKey.createPostKey(postId),
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
            clientCacheKey.createPostKey(postId),
            context.prev
          );
        }
      },
      onSettled(_, __, { postId }) {
        queryClient.invalidateQueries(clientCacheKey.createPostKey(postId));
      },
    }
  );
};
