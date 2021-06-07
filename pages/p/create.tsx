import React from "react";
import { Layout } from "../../components/Layout";
import { useRouter } from "next/router";
import { TextArea, TextField } from "@react-spectrum/textfield";
import { View } from "@react-spectrum/view";
import { Button } from "@react-spectrum/button";
import { Heading } from "@react-spectrum/text";
import { usePostCreateMutation } from "../../hooks/usePostCreateMutation";
import { Flex } from "@react-spectrum/layout";
import { usePostCreate } from "../../hooks/usePostCreate";
import { usePostSave } from "../../hooks/usePostSave";

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
      await router.push(`/p/${post.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const save = async () => {
    try {
      const body = { title, content, description };
      const post = await savePost(body);
      await router.push(`/p/${post.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <View>
        <form onSubmit={create}>
          <Heading>New little JavaScript library</Heading>
          <View marginBottom="size-200">
            <TextField
              autoFocus
              onChange={setTitle}
              label="Title"
              type="text"
              value={title}
              width="100%"
            />
          </View>
          <View marginBottom="size-200">
            <TextArea
              label="Description"
              width="100%"
              onChange={setDescription}
              placeholder=""
              value={description}
            />
          </View>
          <View marginBottom="size-200">
            <TextArea
              width="100%"
              onChange={setContent}
              label="Little JavaScript library"
              value={content}
            />
          </View>
          <Flex>
            <Button
              variant="cta"
              type="submit"
              marginEnd="size-200"
              isDisabled={isCreating}
            >
              Publish
            </Button>
            <Button variant="primary" isDisabled={isSaving} onPress={save}>
              Save
            </Button>
          </Flex>
        </form>
      </View>
    </Layout>
  );
};

export default CreatePostPage;
