import React from "react";
import { Layout } from "../../components/Layout";
import { useRouter } from "next/router";
import { Textarea, Input, Label } from "@rebass/forms";
import { Box, Heading, Flex, Button } from "rebass";
import { usePostCreate } from "../../hooks/usePostCreate";
import { usePostSave } from "../../hooks/usePostSave";
import { GetServerSideProps } from "next";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";

const CreatePostPage: React.FC = () => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [content, setContent] = React.useState("");
  const { createPost, isLoading: isCreating } = usePostCreate();
  const { savePost, isLoading: isSaving } = usePostSave();
  const router = useRouter();

  const create = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { title, content, description };
      const post = await createPost(body);
      await router.push(`/p/${post?.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const save = async (e: any) => {
    e.preventDefault();
    try {
      const body = { title, content, description };
      const post = await savePost(body);
      await router.push(`/p/${post?.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <Box>
        <form onSubmit={create}>
          <Heading>New little JavaScript library</Heading>
          <Box marginBottom="size-200">
            <Label>Title</Label>
            <Input
              autoFocus
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              value={title}
              width="100%"
            />
          </Box>
          <Box marginBottom="size-200">
            <Label>Description</Label>
            <Textarea
              width="100%"
              onChange={(e) => setDescription(e.target.value)}
              placeholder=""
              value={description}
            />
          </Box>
          <Box marginBottom="size-200">
            <Label>Little JavaScript library</Label>
            <Textarea
              width="100%"
              onChange={(e) => setContent(e.target.value)}
              value={content}
            />
          </Box>
          <Flex>
            <Button
              variant="cta"
              type="submit"
              marginRight="size-200"
              disabled={isCreating}
            >
              Publish
            </Button>
            <Button variant="primary" disabled={isSaving} onClick={save}>
              Save
            </Button>
          </Flex>
        </form>
      </Box>
    </Layout>
  );
};

export default CreatePostPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = new QueryClient();

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
