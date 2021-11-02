import { Text } from "@chakra-ui/react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { useFetcher } from "../useFetcher";

export const usePostUnpublishMutation = (id: number) => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();

  return useMutation(
    () =>
      toast.promise(fetcher.unpublishPost(id), {
        loading: <Text fontSize="sm">{"Unpublishing library..."}</Text>,
        success: <Text fontSize="sm">{"Library is unpublished!"}</Text>,
        error: <Text fontSize="sm">{"Library is not unpublished."}</Text>,
      }),
    {
      async onSettled() {
        await queryClient.invalidateQueries(clientCacheKey.createPostKey(id));
        await queryClient.invalidateQueries(clientCacheKey.feedBaseKey);
      },
    }
  );
};
