import axios from "axios";
import { useMutation } from "react-query";

interface Variables {
  title: string;
  description: string;
  content: string;
}

export const usePostCreateMutation = () => {
  return useMutation<{}, {}, Variables>((variables) =>
    axios(`/api/createPost`, {
      method: "POST",
      data: variables,
    })
  );
};
