import { CodeLanguage } from ".prisma/client";
import { useMutation, useQueryClient } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { useFetcher } from "../useFetcher";

interface Variables {
  title: string;
  description: string;
  content: string;
  codeLanguage: CodeLanguage;
  tagId: number;
}

export const usePostEditMutation = (id: number) => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();

  return useMutation(
    (variables: Variables) => fetcher.updatePost(id, variables),
    {
      async onSettled() {
        await queryClient.invalidateQueries(clientCacheKey.createPostKey(id));
        await queryClient.invalidateQueries(clientCacheKey.feedBaseKey);
      },
    }
  );
};
