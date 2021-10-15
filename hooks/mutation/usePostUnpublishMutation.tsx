import { Text } from "@chakra-ui/react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { Fetcher } from "../../lib/Fetcher";

export const usePostUnpublishMutation = (id: number) => {
  const queryClient = useQueryClient();
  const fetcher = new Fetcher();

  return useMutation(
    () =>
      toast.promise(fetcher.unpublishPost(id), {
        loading: <Text fontSize="sm">{"Unpublishing library..."}</Text>,
        success: <Text fontSize="sm">{"Library is unpublished!"}</Text>,
        error: <Text fontSize="sm">{"Library is not unpublished."}</Text>,
      }),
    {
      async onSettled() {
        await queryClient.invalidateQueries(["post", id]);
        await queryClient.invalidateQueries("feed");
      },
    }
  );
};
