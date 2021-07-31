import { Button, Text } from "@chakra-ui/react";
import React from "react";
import { usePostLike } from "../hooks/usePostLike";
import { Post } from "../types/Post";

interface Props {
  post: Post;
}

export const LikeButton: React.FC<Props> = ({ post }) => {
  const { likePost, isLoading } = usePostLike();
  const handleLikeClick = () => likePost(post.id);

  return (
    <Button onClick={handleLikeClick} disabled={isLoading || post.isLikedByMe}>
      {post.isLikedByMe ? <Text>Liked!</Text> : <Text>Like</Text>}
    </Button>
  );
};
