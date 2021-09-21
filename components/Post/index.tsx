import React from "react";
import { Markdown } from "../Markdown";
import { Flex, Box, Text, Button, useColorMode } from "@chakra-ui/react";
import { RouterLink } from "../RouterLinkt";
import useCopyClipboard from "../../hooks/useClipboard";
import { Post as PostType } from "../../types/Post";
import { Syntax } from "../Syntax";
import { LikeButton } from "./LikeButton";
import { PostComments } from "../PostComments";
import {
  ChatIcon,
  ShareIcon,
  DocumentDuplicateIcon,
  PhotographIcon,
} from "@heroicons/react/outline";
import { PostUserPreview } from "../PostUserPreview";
import { useColors } from "../../hooks/useColors";
import { ActionMenu } from "./ActionMenu";
import { paramCase } from "change-case";
import { useRouter } from "next/router";

interface Props {
  post: PostType;
  isMyPost: boolean;
  showActionMenu?: boolean;
}

export const Post: React.FC<Props> = React.memo(function Post({
  post,
  isMyPost,
  showActionMenu = true,
}) {
  const router = useRouter();
  const { borderColor } = useColors();
  const [commentsVisible, setCommentsVisible] = React.useState(false);

  const [isCopied, copy] = useCopyClipboard(post.content || "", {
    successDuration: 3000,
  });

  const handleCommentClick = React.useCallback(() => {
    setCommentsVisible(!commentsVisible);
  }, [commentsVisible]);

  const handleClipboardCopy = React.useCallback(() => copy(), [copy]);

  const handleTweetClick = React.useCallback(() => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURI(
        `Check this: ${window.location.origin}/api/post/${post.id}/screenshot`
      )}`
    );
  }, []);

  return (
    <Box borderColor={borderColor} borderWidth="thin">
      <Flex flexDirection="column">
        <Box>
          <Box p={4} borderColor={borderColor} borderBottomWidth="thin">
            <Flex alignItems="center">
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
              <Box mr={2}>
                <Text fontSize="sm">{`${
                  post.published ? "Published" : "Draft"
                }`}</Text>
              </Box>
            </Flex>
          </Box>
          <Box p={4} borderColor={borderColor} borderBottomWidth="thin">
            <Flex flexDirection="column">
              <Markdown value={post.description || ""} />
            </Flex>
          </Box>
          <Syntax value={post.content || ""} />
        </Box>
        {showActionMenu && (
          <>
            <Box borderColor={borderColor} borderTopWidth="thin">
              <Flex alignItems="center" p={4}>
                <Box mr="2">
                  <LikeButton post={post} />
                </Box>
                <Button
                  leftIcon={<ChatIcon width="20" height="20" />}
                  onClick={handleCommentClick}
                  variant="ghost"
                  size="sm"
                  mr={2}
                >
                  <Text>{`Comment (${post.comments.length})`}</Text>
                </Button>
                <Button
                  leftIcon={<ShareIcon width="20" height="20" />}
                  onClick={handleTweetClick}
                  variant="ghost"
                  size="sm"
                  mr={2}
                >
                  <Text>Tweet</Text>
                </Button>
                <Button
                  leftIcon={<DocumentDuplicateIcon width="20" height="20" />}
                  onClick={handleClipboardCopy}
                  disabled={isCopied}
                  variant="ghost"
                  size="sm"
                  mr={2}
                >
                  <Text>{isCopied ? "Copied!" : "Copy"}</Text>
                </Button>
                <Button
                  leftIcon={<PhotographIcon width="20" height="20" />}
                  disabled={isCopied}
                  variant="ghost"
                  size="sm"
                  mr={2}
                  as="a"
                  download={paramCase(post.title)}
                  href={`/api/post/${post.id}/screenshot`}
                >
                  <Text>Screenshot</Text>
                </Button>
                <Box flexGrow={1} />
                <ActionMenu isMyPost={isMyPost} post={post} />
              </Flex>
            </Box>
            <Box>
              {commentsVisible && (
                <Box>
                  <PostComments post={post} />
                </Box>
              )}
            </Box>
          </>
        )}
      </Flex>
    </Box>
  );
});
