import { CodeLanguage } from ".prisma/client";
import { useMutation, useQueryClient } from "react-query";
import { Fetcher } from "../../lib/Fetcher";

interface Variables {
  title: string;
  description: string;
  content: string;
  codeLanguage: CodeLanguage;
  tagId: number;
}

export const usePostEditMutation = (id: number) => {
  const queryClient = useQueryClient();
  const fetcher = new Fetcher();

  return useMutation(
    (variables: Variables) => fetcher.updatePost(id, variables),
    {
      async onSettled() {
        await queryClient.invalidateQueries(["post", id]);
        await queryClient.invalidateQueries("feed");
      },
    }
  );
};
