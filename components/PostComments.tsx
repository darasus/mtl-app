import {
  Button,
  Flex,
  Text,
  Box,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  IconButton,
} from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useColors } from "../hooks/useColors";
import { useCommentsQuery } from "../hooks/useCommentsQuery";
import { useMeQuery } from "../hooks/useMeQuery";
import { usePostComment } from "../hooks/usePostComment";
import { Post } from "../types/Post";
import { TrashIcon } from "@heroicons/react/outline";
import { useDeleteCommentMutation } from "../hooks/useDeleteCommentMutation";

interface Props {
  post: Post;
}

export const PostComments: React.FC<Props> = ({ post }) => {
  const [commentCount, setCommentCount] = React.useState(3);
  const comments = useCommentsQuery({
    postId: post.id,
    enabled: commentCount > 3,
    take: commentCount,
  });
  const me = useMeQuery();
  const { borderColor, darkerBgColor } = useColors();
  const { commentPost, isLoading: isSubmittingComment } = usePostComment();
  const { mutateAsync: deleteComment } = useDeleteCommentMutation();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { comment: "" },
  });

  const getHasMoreComments = () => {
    if (comments.data?.length) {
      return post.commentsCount > comments.data.length;
    }

    return post.commentsCount > post.comments.length;
  };

  const handleDeleteComment = React.useCallback(async (commentId: number) => {
    await deleteComment({ commentId });
    await comments.refetch();
  }, []);

  const submit = handleSubmit(async (data) => {
    await commentPost(post.id, data.comment);
    reset();
    setCommentCount((state) => state + 1);
  });

  const handleLoadMoreComments = React.useCallback(() => {
    setCommentCount((state) => state + 5);
  }, []);

  const hasComments =
    (comments.data?.length && comments.data.length > 0) ||
    post.comments.length > 0;

  if (!me.data) return null;
  if (!me.data.image) return null;

  return (
    <>
      <Box
        p={3}
        backgroundColor={darkerBgColor}
        borderColor={borderColor}
        borderTopWidth="thin"
        borderBottomWidth="thin"
      >
        {!hasComments && <Text fontSize="sm">No comments yet...</Text>}
        {getHasMoreComments() && (
          <Flex justifyContent="center" mb={2}>
            <Button
              onClick={handleLoadMoreComments}
              isLoading={comments.isLoading}
              variant="ghost"
              size="xs"
            >
              Load more...
            </Button>
          </Flex>
        )}
        {(comments.data || post.comments).map((comment, i) => {
          if (!comment.author) return null;
          if (!comment.author.image) return null;

          return (
            <Box
              key={comment.id}
              marginBottom={post.comments.length === i + 1 ? 0 : 2}
            >
              <Flex mt={1} flexDirection="column">
                <Flex alignItems="center">
                  <Box
                    width={5}
                    height={5}
                    borderRadius={100}
                    overflow="hidden"
                    boxShadow="base"
                    mr={2}
                  >
                    <Image
                      src={comment.author.image}
                      width="100"
                      height="100"
                      alt="Avatar"
                    />
                  </Box>
                  <Box mr={2}>
                    <Text fontSize="sm" color="gray.400">{`${
                      comment.author.name
                    } - ${new Date(comment.createdAt).toDateString()}`}</Text>
                  </Box>
                  {me.data.id === comment.author.id && (
                    <Flex>
                      <IconButton
                        size="xs"
                        variant="ghost"
                        aria-label="Delete comment"
                        onClick={() => handleDeleteComment(comment.id)}
                        icon={
                          <Box color="gray.400">
                            <TrashIcon width="15" height="15" />
                          </Box>
                        }
                      />
                    </Flex>
                  )}
                </Flex>
                <Text fontSize="sm">{comment.content}</Text>
              </Flex>
            </Box>
          );
        })}
      </Box>
      <form onSubmit={submit}>
        <Box p={3}>
          <Flex>
            <Box
              width={7}
              height={7}
              borderRadius={100}
              overflow="hidden"
              boxShadow="base"
              mr={2}
            >
              <Image
                src={me.data.image}
                width="100"
                height="100"
                alt="Avatar"
              />
            </Box>
            <Box flexGrow={1}>
              <Controller
                name="comment"
                control={control}
                render={({ field }) => (
                  <InputGroup>
                    <Input
                      width="100%"
                      autoComplete="false"
                      disabled={isSubmittingComment}
                      name={field.name}
                      onBlur={field.onBlur}
                      value={field.value}
                      aria-label="comment field"
                      onChange={(value) => field.onChange(value)}
                      placeholder="Type your comment here..."
                      required
                      autocomplete="off"
                    />
                    {isSubmittingComment && (
                      <InputRightElement
                        pointerEvents="none"
                        children={<Spinner color="gray.300" size="xs" />}
                      />
                    )}
                  </InputGroup>
                )}
              />
            </Box>
          </Flex>
        </Box>
      </form>
    </>
  );
};
