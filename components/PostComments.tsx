import { Button, Flex, Text, Box } from "rebass";
import { Textarea, Input } from "@rebass/forms";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useMeQuery } from "../hooks/useMeQuery";
import { usePostComment } from "../hooks/usePostComment";
import { Post } from "../types/Post";
import { UserProfilePic } from "./UserPreview";

interface Props {
  post: Post;
}

export const PostComments: React.FC<Props> = ({ post }) => {
  const me = useMeQuery();
  const { commentPost, isLoading } = usePostComment();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { comment: "" },
  });

  const submit = handleSubmit(async (data) => {
    await commentPost(post.id, data.comment);
    reset();
  });

  if (!me.data) return null;

  return (
    <>
      <Box>
        {post.comments.map((comment, i) => {
          if (!comment.author) return null;
          return (
            <Flex
              key={comment.id}
              marginBottom={post.comments.length === i + 1 ? "" : "size-100"}
            >
              <UserProfilePic user={comment.author} />
              <Box>
                <Flex>
                  <Text>{comment.author.name}</Text>
                  <Text>-</Text>
                  <Text>{new Date(comment.createdAt).toDateString()}</Text>
                </Flex>
                <Text>{comment.content}</Text>
              </Box>
            </Flex>
          );
        })}
      </Box>
      <form onSubmit={submit}>
        <Box>
          <Flex>
            <UserProfilePic user={me.data} />
            <Box flexGrow={1}>
              <Controller
                name="comment"
                control={control}
                render={({ field }) => (
                  <Textarea
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
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Flex>
        </Box>
      </form>
    </>
  );
};
