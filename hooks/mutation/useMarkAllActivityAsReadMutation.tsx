import { useMutation, useQueryClient } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { useFetcher } from "../useFetcher";
import { useMe } from "../useMe";

export const useMarkAllActivityAsReadMutation = () => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();
  const { me } = useMe();

  return useMutation(() => fetcher.markAllActivityAsRead(), {
    async onSuccess() {
      await queryClient.invalidateQueries(
        clientCacheKey.createUserActivityKey(me?.id as number)
      );
    },
  });
};
