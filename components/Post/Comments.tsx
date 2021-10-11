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
  const [commentCount, setCommentCount] = React.useState(3);
  const comments = useCommentsQuery({
    postId: post.id,
    enabled: commentCount > 3,
    take: commentCount,
  });
  const me = useMeQuery();
  const { borderColor, secondaryTextColor } = useColors();
  const { commentPost, isLoading: isSubmittingComment } = usePostComment();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { comment: "" },
  });

  const getHasMoreComments = () => {
    if (comments.data?.count && comments.data?.total) {
      return comments.data?.count < comments.data?.total;
    }
    return false;
  };

  const submit = handleSubmit(async (data) => {
    await commentPost(post.id, data.comment);
    reset();
    setCommentCount((state) => state + 1);
  });

  const handleLoadMoreComments = React.useCallback(() => {
    setCommentCount((state) => state + 5);
  }, []);

  const hasComments =
    comments.data?.items?.length && comments.data.items.length > 0;

  return (
    <>
      <Box p={3} borderColor={borderColor} borderTopWidth="thin">
        {!hasComments && (
          <Text color={secondaryTextColor} fontSize="sm">
            No comments yet...
          </Text>
        )}
        {getHasMoreComments() && (
          <Flex justifyContent="center" mb={2}>
            <Button
              onClick={handleLoadMoreComments}
              isLoading={comments.isFetching}
              loadingText={"Load more..."}
              variant="ghost"
              size="xs"
            >
              Load more...
            </Button>
          </Flex>
        )}
        {comments.data?.items?.map((comment, i) => {
          if (!comment.author) return null;
          if (!comment.author.image) return null;

          return (
            <Box
              key={comment.id}
              marginBottom={comments.data.items.length === i + 1 ? 0 : 2}
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
                      <InputGroup>
                        <Input
                          width="100%"
                          disabled={isSubmittingComment}
                          name={field.name}
                          onBlur={field.onBlur}
                          value={field.value}
                          aria-label="comment field"
                          onChange={(value) => field.onChange(value)}
                          placeholder="Type your comment here..."
                          required
                          autoComplete="off"
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
      )}
    </>
  );
};
