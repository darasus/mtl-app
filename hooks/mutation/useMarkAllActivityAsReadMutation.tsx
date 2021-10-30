import { useMutation, useQueryClient } from "react-query";
import { createUseUserActivityQueryCacheKey } from "../query/useUserActivityQuery";
import { useFetcher } from "../useFetcher";
import { useMe } from "../useMe";

export const useMarkAllActivityAsReadMutation = () => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();
  const { me } = useMe();

  return useMutation(() => fetcher.markAllActivityAsRead(), {
    async onSuccess() {
      await queryClient.invalidateQueries(
        createUseUserActivityQueryCacheKey(me?.id as number)
      );
    },
  });
};
