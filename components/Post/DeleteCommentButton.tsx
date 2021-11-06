import { Box, Flex, IconButton } from "@chakra-ui/react";
import { TrashIcon } from "@heroicons/react/outline";
import React from "react";
import { useColors } from "../../hooks/useColors";
import { useDeleteCommentMutation } from "../../hooks/mutation/useDeleteCommentMutation";
import { Comment } from "../../types/Comment";

interface Props {
  comment: Comment;
}

export const DeleteCommentButton: React.FC<Props> = ({ comment }) => {
  const { secondaryButtonTextColor } = useColors();
  const { mutateAsync: deleteComment, isLoading: isDeletingComment } =
    useDeleteCommentMutation();

  const handleDeleteComment = React.useCallback(async () => {
    await deleteComment({ commentId: comment.id, postId: comment.postId });
  }, [comment, deleteComment]);

  if (!comment.isMyComment) return null;

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
