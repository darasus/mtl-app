import { Flex, Text, Box } from "@chakra-ui/react";
import React from "react";
import { Post } from "../types/Post";
import { ThumbUpIcon } from "@heroicons/react/outline";

interface Props {
  post: Post;
}

export const LikeCount: React.FC<Props> = ({ post }) => {
  return (
    <Flex alignItems="center">
      <Box marginRight="static-size-40">
        <Flex alignItems="center">
          <Box mr={1}>
            <ThumbUpIcon width="16" height="16" />
          </Box>
          <Text fontSize="sm">{post.likes}</Text>
        </Flex>
      </Box>
    </Flex>
  );
};
