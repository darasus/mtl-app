import { CodeLanguage } from ".prisma/client";
import React from "react";
import { usePostEditMutation } from "./mutation/usePostEditMutation";

interface Data {
  title: string;
  description: string;
  content: string;
  codeLanguage: CodeLanguage;
  tagId: number;
}

export const usePostEdit = (id: number) => {
  const editPostMutation = usePostEditMutation(id);

  const editPost = React.useCallback(
    (data: Data) => {
      return editPostMutation.mutateAsync(data);
    },
    [editPostMutation]
  );

  return { editPost, isLoading: editPostMutation.isLoading };
};
