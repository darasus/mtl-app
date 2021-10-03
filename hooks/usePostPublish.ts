import React from "react";
import { usePostPublishMutation } from "./mutation/usePostPublishMutation";

export const usePostPublish = (id: number) => {
  const publishPostMutation = usePostPublishMutation(id);

  const publishPost = React.useCallback(() => {
    return publishPostMutation.mutate();
  }, []);

  return { publishPost, isLoading: publishPostMutation.isLoading };
};
