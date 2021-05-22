import axios from "axios";
import { useMutation } from "react-query";

export const usePostCreateMutation = () => {
  return useMutation((variables) =>
    axios(`/api/createPost`, {
      method: "PUT",
      data: variables,
    })
  );
};
