import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-hot-toast";
import { Text } from "@chakra-ui/react";
import { useFetcher } from "../useFetcher";
import { clientCacheKey } from "../../lib/ClientCacheKey";

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
        await queryClient.cancelQueries(clientCacheKey.createPostKey(postId));

        const prev = queryClient.getQueryData(
          clientCacheKey.createPostKey(postId)
        );

        queryClient.setQueryData(
          clientCacheKey.createPostKey(postId),
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
