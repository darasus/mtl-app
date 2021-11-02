import { useMutation, useQueryClient } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { withToast } from "../../utils/withToast";
import { useFetcher } from "../useFetcher";

const toastConfig = {
  loading: "Deleting library...",
  success: "Library is deleted!",
  error: "Library is not deleted.",
};

export const usePostDeleteMutation = (id: number) => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();

  return useMutation(() => withToast(fetcher.deletePost(id), toastConfig), {
    async onSettled() {
      await queryClient.removeQueries(clientCacheKey.createPostKey(id));
      await queryClient.removeQueries(clientCacheKey.feedBaseKey);
    },
  });
};
