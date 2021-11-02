import { useMutation, useQueryClient } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { withToast } from "../../utils/withToast";
import { useFetcher } from "../useFetcher";

const toastConfig = {
  loading: "Publishing library...",
  success: "Library is published!",
  error: "Library is not published.",
};

export const usePostPublishMutation = (id: number) => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();

  return useMutation(() => withToast(fetcher.publishPost(id), toastConfig), {
    async onSettled() {
      await queryClient.invalidateQueries(clientCacheKey.createPostKey(id));
      await queryClient.invalidateQueries(clientCacheKey.feedBaseKey);
    },
  });
};
