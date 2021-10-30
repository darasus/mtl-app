import { CodeLanguage } from ".prisma/client";
import { Text } from "@chakra-ui/react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { useFetcher } from "../useFetcher";

interface Variables {
  title: string;
  description: string;
  content: string;
  codeLanguage: CodeLanguage;
  tagId: number;
  isPublished: boolean;
}

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();

  return useMutation(
    (variables: Variables) =>
      toast.promise(fetcher.createPost(variables), {
        loading: <Text fontSize="sm">{"Creating library..."}</Text>,
        success: <Text fontSize="sm">{"Library created!"}</Text>,
        error: <Text fontSize="sm">{"Library is not created."}</Text>,
      }),
    {
      async onSettled() {
        await queryClient.invalidateQueries("feed");
      },
    }
  );
};
