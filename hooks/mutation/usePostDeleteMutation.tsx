import { Text } from "@chakra-ui/react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { useFetcher } from "../useFetcher";

export const usePostDeleteMutation = (id: number) => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();

  return useMutation(
    () =>
      toast.promise(fetcher.deletePost(id), {
        loading: <Text fontSize="sm">{"Deleting library..."}</Text>,
        success: <Text fontSize="sm">{"Library is deleted!"}</Text>,
        error: <Text fontSize="sm">{"Library is not deleted."}</Text>,
      }),
    {
      async onSettled() {
        await queryClient.removeQueries(clientCacheKey.createPostKey(id));
        await queryClient.removeQueries(clientCacheKey.feedBaseKey);
      },
    }
  );
};
