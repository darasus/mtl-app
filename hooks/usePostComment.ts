import React from "react";
import { usePostCommentMutation } from "./mutation/usePostCommentMutation";
import { usePostLikeMutation } from "./mutation/usePostLikeMutation";

export const usePostComment = () => {
  const commentPostMutation = usePostCommentMutation();

  const commentPost = React.useCallback((postId: number, content: string) => {
    return commentPostMutation.mutateAsync({ postId, content });
  }, []);

  return { commentPost, isLoading: commentPostMutation.isLoading };
};
