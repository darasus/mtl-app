import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { Post } from "../types/Post";

export const usePostUnpublishMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation<Post>(
    () =>
      axios(`/api/post/${id}/unpublish`, {
        method: "PUT",
      }).then((resd) => resd.data),
    {
      async onSettled() {
        await queryClient.invalidateQueries(["post", id]);
        await queryClient.invalidateQueries("feed");
      },
    }
  );
};
