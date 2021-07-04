import { Flex, Text, View } from "@adobe/react-spectrum";
import Heart from "@spectrum-icons/workflow/Heart";
import React from "react";
import { usePostQuery } from "../hooks/usePostQuery";
import { Post } from "../types/Post";

interface Props {
  post: Post;
}

export const LikeCount: React.FC<Props> = ({ post }) => {
  return (
    <Flex alignItems="center">
      <View marginEnd="static-size-40">
        <Flex alignItems="center" gap="size-10">
          <Heart color="negative" />
          <Text>{post.likes}</Text>
        </Flex>
      </View>
    </Flex>
  );
};
