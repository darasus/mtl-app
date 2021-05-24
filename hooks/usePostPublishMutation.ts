import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

export const usePostPublishMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    () =>
      axios(`/api/post/${id}/publish`, {
        method: "PUT",
      }),
    {
      async onSettled() {
        await queryClient.invalidateQueries(["post", id]);
        await queryClient.invalidateQueries("feed");
      },
    }
  );
};
