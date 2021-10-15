import { Text } from "@chakra-ui/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { Fetcher } from "../../lib/Fetcher";
import { createUseFeedQueryCacheKey } from "../query/useFeedQuery";
import { createUsePostQueryCacheKey } from "../query/usePostQuery";

export const usePostDeleteMutation = (id: number) => {
  const queryClient = useQueryClient();
  const fetcher = new Fetcher();

  return useMutation(
    () =>
      toast.promise(fetcher.deletePost(id), {
        loading: <Text fontSize="sm">{"Deleting library..."}</Text>,
        success: <Text fontSize="sm">{"Library is deleted!"}</Text>,
        error: <Text fontSize="sm">{"Library is not deleted."}</Text>,
      }),
    {
      async onSettled() {
        await queryClient.invalidateQueries(createUsePostQueryCacheKey(id));
        await queryClient.invalidateQueries(createUseFeedQueryCacheKey());
      },
    }
  );
};
