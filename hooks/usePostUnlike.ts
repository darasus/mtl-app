import React from "react";
import { usePostUnlikeMutation } from "./mutation/usePostUnlikeMutation";

export const usePostUnlike = () => {
  const unlikePostMutation = usePostUnlikeMutation();

  const unlikePost = React.useCallback((postId: number) => {
    return unlikePostMutation.mutateAsync({ postId });
  }, []);

  return { unlikePost, isLoading: unlikePostMutation.isLoading };
};
