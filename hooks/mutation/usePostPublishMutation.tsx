import { Text } from "@chakra-ui/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";

export const usePostPublishMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    () =>
      toast.promise(
        axios(`/api/post/${id}/publish`, {
          method: "PUT",
        }),
        {
          loading: <Text fontSize="sm">{"Publishing library..."}</Text>,
          success: <Text fontSize="sm">{"Library is published!"}</Text>,
          error: <Text fontSize="sm">{"Library is not published."}</Text>,
        }
      ),
    {
      async onSettled() {
        await queryClient.invalidateQueries(["post", id]);
        await queryClient.invalidateQueries("feed");
      },
    }
  );
};
