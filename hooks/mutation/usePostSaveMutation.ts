import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { Post } from "../../types/Post";

interface Variables {
  title: string;
  description: string;
  content: string;
}

export const usePostSaveMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Post, {}, Variables>(
    (variables) =>
      axios(`/api/post/save`, {
        method: "POST",
        data: variables,
      }).then((res) => res.data),
    {
      async onSettled(_, __, id) {
        await queryClient.invalidateQueries("feed");
      },
    }
  );
};
