import { CodeLanguage } from ".prisma/client";
import { useMutation, useQueryClient } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { withToast } from "../../utils/withToast";
import { useFetcher } from "../useFetcher";

interface Variables {
  title: string;
  description: string;
  content: string;
  codeLanguage: CodeLanguage;
  tagId: number;
}

const toastConfig = {
  success: "Post is updated.",
  loading: "Post is updating...",
  error: "Post is not updated.",
};

export const usePostEditMutation = (id: number) => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();

  return useMutation(
    (variables: Variables) =>
      withToast(fetcher.updatePost(id, variables), toastConfig),
    {
      async onSettled() {
        await queryClient.invalidateQueries(clientCacheKey.createPostKey(id));
        await queryClient.invalidateQueries(clientCacheKey.feedBaseKey);
      },
    }
  );
};
