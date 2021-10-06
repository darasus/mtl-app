import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { createUseFeedQueryCacheKey } from "../query/useFeedQuery";
import { createUsePostQueryCacheKey } from "../query/usePostQuery";

export const usePostDeleteMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    () =>
      axios(`/api/post/${id}/delete`, {
        method: "DELETE",
      }),
    {
      async onSettled() {
        await queryClient.invalidateQueries(createUsePostQueryCacheKey(id));
        await queryClient.invalidateQueries(createUseFeedQueryCacheKey());
      },
    }
  );
};
