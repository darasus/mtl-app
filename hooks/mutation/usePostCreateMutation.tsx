import { CodeLanguage } from ".prisma/client";
import { Text } from "@chakra-ui/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { Post } from "../../types/Post";

interface Variables {
  title: string;
  description: string;
  content: string;
  codeLanguage: CodeLanguage;
}

export const usePostCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Post, {}, Variables>(
    (variables) =>
      toast.promise(
        axios(`/api/post/create`, {
          method: "POST",
          data: variables,
        }).then((res) => res.data),
        {
          loading: <Text fontSize="sm">{"Creating library..."}</Text>,
          success: <Text fontSize="sm">{"Library created!"}</Text>,
          error: <Text fontSize="sm">{"Library is not created."}</Text>,
        }
      ),
    {
      async onSettled(_, __, id) {
        await queryClient.invalidateQueries("feed");
      },
    }
  );
};
