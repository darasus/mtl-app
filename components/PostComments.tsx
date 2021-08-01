import { Button, Flex, Text, Box, Textarea, Input } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useColors } from "../hooks/useColors";
import { useMeQuery } from "../hooks/useMeQuery";
import { usePostComment } from "../hooks/usePostComment";
import { Post } from "../types/Post";

interface Props {
  post: Post;
}

export const PostComments: React.FC<Props> = ({ post }) => {
  const me = useMeQuery();
  const { borderColor, darkerBgColor } = useColors();
  const { commentPost, isLoading } = usePostComment();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { comment: "" },
  });

  const submit = handleSubmit(async (data) => {
    await commentPost(post.id, data.comment);
    reset();
  });

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
        {post.comments.map((comment, i) => {
          if (!comment.author) return null;
          if (!comment.author.image) return null;
          return (
            <Flex
              key={comment.id}
              marginBottom={post.comments.length === i + 1 ? 0 : 2}
            >
              <Box
                width={7}
                height={7}
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
              <Box mt={1}>
                <Flex>
                  <Text fontSize="sm" color="gray.400">{`${
                    comment.author.name
                  } - ${new Date(comment.createdAt).toDateString()}`}</Text>
                </Flex>
                <Text fontSize="sm">{comment.content}</Text>
              </Box>
            </Flex>
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
            <Box flexGrow={1} mr={2}>
              <Controller
                name="comment"
                control={control}
                render={({ field }) => (
                  <Input
                    width="100%"
                    autoComplete="false"
                    disabled={isLoading}
                    name={field.name}
                    onBlur={field.onBlur}
                    value={field.value}
                    aria-label="comment field"
                    onChange={(value) => field.onChange(value)}
                    placeholder="Type your comment here..."
                  />
                )}
              />
            </Box>
            <Button type="submit" disabled={isLoading}>
              Submit
            </Button>
          </Flex>
        </Box>
      </form>
    </>
  );
};
