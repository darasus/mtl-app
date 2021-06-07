import React from "react";
import { usePostEditMutation } from "./usePostEditMutation";

interface Data {
  title: string;
  description: string;
  content: string;
  isPublished?: boolean;
}

export const usePostEdit = (id: number) => {
  const editPostMutation = usePostEditMutation(id);

  const editPost = React.useCallback((data: Data) => {
    return editPostMutation.mutateAsync(data);
  }, []);

  return { editPost, isLoading: editPostMutation.isLoading };
};
