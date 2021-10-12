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
import { useColors } from "../../hooks/useColors";
import { useCommentsQuery } from "../../hooks/query/useCommentsQuery";
import { useMeQuery } from "../../hooks/query/useMeQuery";
import { usePostComment } from "../../hooks/usePostComment";
import { Post } from "../../types/Post";
import { DeleteCommentButton } from "./DeleteCommentButton";

interface Props {
  post: Post;
}

export const Comments: React.FC<Props> = ({ post }) => {
  const commentsQueryEnabled = !post.comments.length;
  const comments = useCommentsQuery({
    postId: post.id,
    enabled: commentsQueryEnabled,
  });
  const me = useMeQuery();
  const { borderColor, secondaryTextColor } = useColors();
  const { commentPost, isLoading: isSubmittingComment } = usePostComment();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { comment: "" },
  });

  const submit = handleSubmit(async (data) => {
    reset();
    await commentPost(post.id, data.comment);
  });

  const hasComments =
    comments.data?.pages[0].items?.length &&
    comments.data?.pages[0].items.length > 0;

  const commentItems =
    comments.data?.pages.reduce((acc, next) => {
      return [...acc, ...next.items].sort((a, b) => {
        return a.id - b.id;
      });
    }, [] as Post["comments"]) || [];

  return (
    <>
      <Box p={3} borderColor={borderColor} borderTopWidth="thin">
        {!hasComments && (
          <Text color={secondaryTextColor} fontSize="sm">
            No comments yet...
          </Text>
        )}
        {comments.hasNextPage && (
          <Flex justifyContent="center" mb={2}>
            <Button
              onClick={() => comments.fetchNextPage()}
              isLoading={comments.isFetching}
              loadingText={"Load more..."}
              variant="ghost"
              size="xs"
            >
              Load more...
            </Button>
          </Flex>
        )}
        {commentItems.map((comment, i) => {
          if (!comment.author) return null;
          if (!comment.author.image) return null;

          return (
            <Box key={comment.id}>
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
                    <Text fontSize="sm" color={secondaryTextColor}>{`${
                      comment.author.name
                    } - ${new Date(comment.createdAt).toDateString()}`}</Text>
                  </Box>
                  {me.data?.id === comment.author.id && (
                    <DeleteCommentButton commentId={comment.id} />
                  )}
                </Flex>
                <Box ml={7}>
                  <Text fontSize="sm">{comment.content}</Text>
                </Box>
              </Flex>
            </Box>
          );
        })}
      </Box>
      {me.data && (
        <>
          <Box borderColor={borderColor} borderBottomWidth="thin" />
          <form onSubmit={submit}>
            <Box p={3}>
              <Flex>
                {me.data?.image && (
                  <Box
                    width={7}
                    height={7}
                    borderRadius={100}
                    overflow="hidden"
                    boxShadow="base"
                    mr={2}
                  >
                    <Image
                      src={me.data?.image}
                      width="100"
                      height="100"
                      alt="Avatar"
                    />
                  </Box>
                )}
                <Box flexGrow={1}>
                  <Controller
                    name="comment"
                    control={control}
                    render={({ field }) => (
                      <Input
                        width="100%"
                        name={field.name}
                        onBlur={field.onBlur}
                        value={field.value}
                        aria-label="comment field"
                        onChange={(value) => field.onChange(value)}
                        placeholder="Type your comment here..."
                        required
                        autoComplete="off"
                      />
                    )}
                  />
                </Box>
              </Flex>
            </Box>
          </form>
        </>
      )}
    </>
  );
};
