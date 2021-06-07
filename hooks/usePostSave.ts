import React from "react";
import { usePostSaveMutation } from "./usePostSaveMutation";

interface Data {
  title: string;
  description: string;
  content: string;
}

export const usePostSave = () => {
  const savePostMutation = usePostSaveMutation();

  const savePost = React.useCallback((data: Data) => {
    return savePostMutation.mutateAsync(data);
  }, []);

  return { savePost, isLoading: savePostMutation.isLoading };
};
