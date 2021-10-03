import React from "react";
import { usePostUnpublishMutation } from "./mutation/usePostUnpublishMutation";

export const usePostUnpublish = (id: number) => {
  const unpublishPostMutation = usePostUnpublishMutation(id);

  const unpublishPost = React.useCallback(() => {
    return unpublishPostMutation.mutate();
  }, []);

  return { unpublishPost, isLoading: unpublishPostMutation.isLoading };
};
