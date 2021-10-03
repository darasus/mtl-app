import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

export const usePostDeleteMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    () =>
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
