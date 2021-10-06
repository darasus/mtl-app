import { Button, Spinner, Text } from "@chakra-ui/react";
import React from "react";
import { usePostLike } from "../../hooks/usePostLike";
import { Post } from "../../types/Post";
import { ThumbUpIcon } from "@heroicons/react/outline";
import { usePostUnlike } from "../../hooks/usePostUnlike";
import { usePostQuery } from "../../hooks/query/usePostQuery";

interface Props {
  post: Post;
  isPostLoading?: boolean;
}

export const LikeButton: React.FC<Props> = ({ post, isPostLoading }) => {
  const { likePost, isLoading: likeIsLoading } = usePostLike();
  const { unlikePost, isLoading: unlikeIsLoading } = usePostUnlike();
  const handleLikeClick = React.useCallback(() => likePost(post.id), []);
  const handleUnlikeClick = React.useCallback(() => unlikePost(post.id), []);
  const text = `${post.isLikedByMe ? "Unlike" : "Like"}`;

  return (
    <Button
      leftIcon={<ThumbUpIcon width="15" height="15" />}
      onClick={post.isLikedByMe ? handleUnlikeClick : handleLikeClick}
      disabled={likeIsLoading || unlikeIsLoading || isPostLoading}
      isLoading={likeIsLoading || unlikeIsLoading || isPostLoading}
      loadingText={text}
      size="xs"
      variant="ghost"
    >
      <Text>{text}</Text>
    </Button>
  );
};
