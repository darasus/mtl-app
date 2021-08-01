import React from "react";
import { UserPreview } from "./UserPreview";
import { Markdown } from "./Markdown";
import { Flex, Box, Text, Button } from "@chakra-ui/react";
import { RouterLink } from "./RouterLinkt";
import useCopyClipboard from "../hooks/useClipboard";
import { useRouter } from "next/router";
import { Post as PostType } from "../types/Post";
import { usePostDelete } from "../hooks/usePostDelete";
import { usePostUnpublish } from "../hooks/usePostUnpublish";
import { usePostPublish } from "../hooks/usePostPublish";
import { Syntax } from "./Syntax";
import { LikeButton } from "./LikeButton";
import { LikeCount } from "./LikeCount";
import { PostComments } from "./PostComments";
import {
  ChatIcon,
  ShareIcon,
  DocumentDuplicateIcon,
  PencilAltIcon,
  CloudDownloadIcon,
  CloudUploadIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { PostUserPreview } from "./PostUserPreview";

interface Props {
  post: PostType;
  isMyPost: boolean;
}

export const Post: React.FC<Props> = React.memo(function Post({
  post,
  isMyPost,
}) {
  const [commentsVisible, setCommentsVisible] = React.useState(false);
  const router = useRouter();
  const { deletePost, isLoading: isDeleting } = usePostDelete(post.id);
  const { unpublishPost, isLoading: isUnpublishing } = usePostUnpublish(
    post.id
  );
  const { publishPost, isLoading: isPublishing } = usePostPublish(post.id);
  const [isCopied, copy] = useCopyClipboard(post.content || "", {
    successDuration: 3000,
  });

  const handleCommentClick = React.useCallback(() => {
    setCommentsVisible(!commentsVisible);
  }, [commentsVisible]);

  const handleDeletePost = React.useCallback(() => deletePost(), [deletePost]);

  const handleUnpublishPost = React.useCallback(
    () => unpublishPost(),
    [unpublishPost]
  );

  const handlepublishPost = React.useCallback(
    () => publishPost(),
    [publishPost]
  );

  const handleClipboardCopy = React.useCallback(() => copy(), [copy]);

  const handleTweetClick = React.useCallback(() => {
    window.open(`https://twitter.com/intent/tweet?text=Hello%20world`);
  }, []);

  const handleEditClick = React.useCallback(() => {
    router.push(`/p/${post.id}/edit`);
  }, []);

  return (
    <Box borderColor="white" borderWidth="thin">
      <Flex flexDirection="column">
        <Box p="5">
          <Flex alignItems="center">
            <RouterLink mr={1} href={`/p/${post.id}`}>
              <Text fontSize="sm">{post.title}</Text>
            </RouterLink>
            <Box mr={1}>
              <Text fontSize="sm">by</Text>
            </Box>
            <Box mr={1}>
              {post.author && <PostUserPreview user={post.author} />}
            </Box>
            <Box mr={1}>
              <Text fontSize="sm">{`${
                post.published ? "Published" : "Draft"
              }`}</Text>
            </Box>
            <Box>
              <LikeCount post={post} />
            </Box>
          </Flex>
          <Flex flexDirection="column">
            <Markdown value={post.description || ""} />
          </Flex>
          <Syntax value={post.content || ""} />
        </Box>
        <Box>
          <Flex alignItems="center" p="2" borderTop="1px solid white">
            <Box mr="2">
              <LikeButton post={post} />
            </Box>
            <Button
              leftIcon={<ChatIcon width="20" height="20" />}
              onClick={handleCommentClick}
              variant="outline"
              size="sm"
              mr={2}
            >
              <Text>{`Comment (${post.comments.length})`}</Text>
            </Button>
            <Button
              leftIcon={<ShareIcon width="20" height="20" />}
              onClick={handleTweetClick}
              variant="outline"
              size="sm"
              mr={2}
            >
              <Text>Tweet</Text>
            </Button>
            <Button
              leftIcon={<DocumentDuplicateIcon width="20" height="20" />}
              onClick={handleClipboardCopy}
              disabled={isCopied}
              variant="outline"
              size="sm"
              mr={2}
            >
              <Text>{isCopied ? "Copied!" : "Copy snippet"}</Text>
            </Button>
            {isMyPost && (
              <Button
                onClick={handleEditClick}
                variant="outline"
                size="sm"
                mr={2}
                leftIcon={<PencilAltIcon width="20" height="20" />}
              >
                <Text>Edit</Text>
              </Button>
            )}
            {isMyPost &&
              (post.published ? (
                <Button
                  onClick={handleUnpublishPost}
                  disabled={isUnpublishing}
                  variant="outline"
                  size="sm"
                  mr={2}
                  leftIcon={<CloudDownloadIcon width="20" height="20" />}
                >
                  {/* <PublishRemove /> */}
                  <Text>Unpublish</Text>
                </Button>
              ) : (
                <Button
                  onClick={handlepublishPost}
                  disabled={isPublishing}
                  variant="outline"
                  size="sm"
                  mr={2}
                  leftIcon={<CloudUploadIcon width="20" height="20" />}
                >
                  {/* <PublishCheck /> */}
                  <Text>Publish</Text>
                </Button>
              ))}
            {isMyPost && (
              <Button
                onClick={handleDeletePost}
                disabled={isDeleting}
                variant="outline"
                size="sm"
                mr={2}
                leftIcon={<TrashIcon width="20" height="20" />}
              >
                {/* <DeleteOutline /> */}
                <Text>Remove</Text>
              </Button>
            )}
          </Flex>
        </Box>
        <Box>
          {commentsVisible && (
            <Box>
              <PostComments post={post} />
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  );
});
