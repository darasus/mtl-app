import { Box, Flex, IconButton } from "@chakra-ui/react";
import { TrashIcon } from "@heroicons/react/outline";
import React from "react";
import { useColors } from "../../hooks/useColors";
import { useDeleteCommentMutation } from "../../hooks/mutation/useDeleteCommentMutation";
import { useCommentsQuery } from "../../hooks/query/useCommentsQuery";

interface Props {
  commentId: number;
  postId: number;
}

export const DeleteCommentButton: React.FC<Props> = ({ commentId, postId }) => {
  const { secondaryButtonTextColor } = useColors();
  const { mutateAsync: deleteComment, isLoading: isDeletingComment } =
    useDeleteCommentMutation();

  const handleDeleteComment = React.useCallback(async () => {
    await deleteComment({ commentId, postId });
  }, []);

  return (
    <Flex>
      <IconButton
        size="xs"
        variant="ghost"
        aria-label="Delete comment"
        isLoading={isDeletingComment}
        onClick={handleDeleteComment}
        icon={
          <Box color={secondaryButtonTextColor}>
            <TrashIcon width="15" height="15" />
          </Box>
        }
      />
    </Flex>
  );
};