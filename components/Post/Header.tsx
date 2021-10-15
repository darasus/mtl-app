import { Box, Flex, Text } from "@chakra-ui/react";
import { Post as PostType } from "../../types/Post";
import { ThumbUpIcon, ChatIcon, TagIcon } from "@heroicons/react/outline";
import React from "react";
import { PostUserPreview } from "../PostUserPreview";
import { RouterLink } from "../RouterLinkt";
import { useColors } from "../../hooks/useColors";
import { CodeLanguageIcon } from "./CodeLanguageIcon";

interface Props {
  post: PostType;
  showMetaInfo?: boolean;
}

export const Header: React.FC<Props> = ({ post, showMetaInfo = true }) => {
  const { secondaryTextColor } = useColors();

  return (
    <Box p={4}>
      <Flex alignItems="center">
        {post.codeLanguage && (
          <Box mr={2}>
            <CodeLanguageIcon codeLanguage={post.codeLanguage} />
          </Box>
        )}
        <Box mr={2}>
          <RouterLink href={`/p/${post.id}`}>
            <Text fontSize="sm" data-testid="post-title">
              {post.title}
            </Text>
          </RouterLink>
        </Box>
        <Box mr={2}>
          <Text fontSize="sm">by</Text>
        </Box>
        <Box mr={2}>
          {post.author && <PostUserPreview user={post.author} />}
        </Box>
        {showMetaInfo && (
          <Flex flexGrow={1}>
            <Box mr={2}>
              <Flex color={secondaryTextColor}>
                <Flex mr={2} alignItems="center">
                  <Box mr={1}>
                    <ThumbUpIcon width="15" height="15" />
                  </Box>
                  <Box>
                    <Text fontSize="sm">{`${post.likesCount} likes`}</Text>
                  </Box>
                </Flex>
                <Flex alignItems="center" mr={2}>
                  <Box mr={1}>
                    <ChatIcon width="15" height="15" />
                  </Box>
                  <Box>
                    <Text fontSize="sm">{`${post.commentsCount} comments`}</Text>
                  </Box>
                </Flex>
                <Flex alignItems="center">
                  <Box mr={1}>
                    <TagIcon width="15" height="15" />
                  </Box>
                  <Box>
                    <Text fontSize="sm">{`${post.tags
                      .map((tag) => tag.tag.name)
                      .join(",")}`}</Text>
                  </Box>
                </Flex>
              </Flex>
            </Box>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};
