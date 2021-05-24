import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { Post } from "../types/Post";

interface Variables {
  title: string;
  description: string;
  content: string;
}

export const usePostEditMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation<Post, {}, Variables>(
    (variables) =>
      axios(`/api/post/${id}/update`, {
        method: "PUT",
        data: variables,
      }).then((res) => res.data),
    {
      async onSettled() {
        await queryClient.invalidateQueries(["post", id]);
        await queryClient.invalidateQueries("feed");
      },
    }
  );
};
