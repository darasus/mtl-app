import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { useFetcher } from "../useFetcher";

export const useMarkActivityAsReadMutation = (activityId: string) => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();
  const me = useUser();

  return useMutation(() => fetcher.markActivityAsRead(activityId), {
    async onSettled() {
      await queryClient.invalidateQueries(
        clientCacheKey.createUserActivityKey(me.id)
      );
    },
  });
};
