import { useMutation, useQueryClient } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { useFetcher } from "../useFetcher";
import { useMe } from "../useMe";

export const useMarkActivityAsReadMutation = (activityId: number) => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();
  const { user } = useMe();

  return useMutation(() => fetcher.markActivityAsRead(activityId), {
    async onSettled() {
      await queryClient.invalidateQueries(
        clientCacheKey.createUserActivityKey(user?.id as string)
      );
    },
  });
};
