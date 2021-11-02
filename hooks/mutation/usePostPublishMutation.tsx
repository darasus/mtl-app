import { Text } from "@chakra-ui/react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { useFetcher } from "../useFetcher";

export const usePostPublishMutation = (id: number) => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();

  return useMutation(
    () =>
      toast.promise(fetcher.publishPost(id), {
        loading: <Text fontSize="sm">{"Publishing library..."}</Text>,
        success: <Text fontSize="sm">{"Library is published!"}</Text>,
        error: <Text fontSize="sm">{"Library is not published."}</Text>,
      }),
    {
      async onSettled() {
        await queryClient.invalidateQueries(clientCacheKey.createPostKey(id));
        await queryClient.invalidateQueries(clientCacheKey.feedBaseKey);
      },
    }
  );
};
