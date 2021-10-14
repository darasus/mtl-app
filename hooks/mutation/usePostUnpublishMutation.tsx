import { Text } from "@chakra-ui/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { Post } from "../../types/Post";

export const usePostUnpublishMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation<Post>(
    () =>
      toast.promise(
        axios(`/api/post/${id}/unpublish`, {
          method: "PUT",
        }).then((res) => res.data),
        {
          loading: <Text fontSize="sm">{"Unpublishing library..."}</Text>,
          success: <Text fontSize="sm">{"Library is unpublished!"}</Text>,
          error: <Text fontSize="sm">{"Library is not unpublished."}</Text>,
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
