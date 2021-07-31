import { Flex, Text, Box } from "@chakra-ui/react";
import React from "react";
import { Post } from "../types/Post";

interface Props {
  post: Post;
}

export const LikeCount: React.FC<Props> = ({ post }) => {
  return (
    <Flex alignItems="center">
      <Box marginRight="static-size-40">
        <Flex alignItems="center">
          {/* <Heart color="negative" /> */}
          <Text>{post.likes}</Text>
        </Flex>
      </Box>
    </Flex>
  );
};
