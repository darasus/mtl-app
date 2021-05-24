import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

export const usePostDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (id: number) =>
      axios(`/api/post/${id}/delete`, {
        method: "DELETE",
      }),
    {
      async onSettled(_, __, id) {
        await queryClient.invalidateQueries(["post", id]);
        await queryClient.invalidateQueries("feed");
      },
    }
  );
};
