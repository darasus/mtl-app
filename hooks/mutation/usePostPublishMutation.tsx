import { Text } from "@chakra-ui/react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { Fetcher } from "../../lib/Fetcher";

export const usePostPublishMutation = (id: number) => {
  const queryClient = useQueryClient();
  const fetcher = new Fetcher();

  return useMutation(
    () =>
      toast.promise(fetcher.publishPost(id), {
        loading: <Text fontSize="sm">{"Publishing library..."}</Text>,
        success: <Text fontSize="sm">{"Library is published!"}</Text>,
        error: <Text fontSize="sm">{"Library is not published."}</Text>,
      }),
    {
      async onSettled() {
        await queryClient.invalidateQueries(["post", id]);
        await queryClient.invalidateQueries("feed");
      },
    }
  );
};
