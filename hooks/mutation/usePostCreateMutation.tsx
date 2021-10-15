import { CodeLanguage } from ".prisma/client";
import { Text } from "@chakra-ui/react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { Fetcher } from "../../lib/Fetcher";
import { Post } from "../../types/Post";

interface Variables {
  title: string;
  description: string;
  content: string;
  codeLanguage: CodeLanguage;
  tagId: number;
}

export const usePostCreateMutation = () => {
  const queryClient = useQueryClient();
  const fetcher = new Fetcher();

  return useMutation<Post, {}, Variables>(
    (variables) =>
      toast.promise(fetcher.createPost(variables), {
        loading: <Text fontSize="sm">{"Creating library..."}</Text>,
        success: <Text fontSize="sm">{"Library created!"}</Text>,
        error: <Text fontSize="sm">{"Library is not created."}</Text>,
      }),
    {
      async onSettled(_, __, id) {
        await queryClient.invalidateQueries("feed");
      },
    }
  );
};
