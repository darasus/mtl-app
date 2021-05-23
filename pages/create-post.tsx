import React from "react";
import { Layout } from "../components/Layout";
import { useRouter } from "next/router";
import { TextArea, TextField } from "@react-spectrum/textfield";
import { View } from "@react-spectrum/view";
import { Button } from "@react-spectrum/button";
import { Heading } from "@react-spectrum/text";
import { usePostCreateMutation } from "../hooks/usePostCreateMutation";
import { useMeQuery } from "../hooks/useMeQuery";

const Draft: React.FC = () => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [content, setContent] = React.useState("");
  const createPost = usePostCreateMutation();
  const me = useMeQuery();
  const router = useRouter();

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { title, content, description };
      await createPost.mutateAsync(body);
      await router.push(`/u/${me.data.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <View>
        <form onSubmit={submitData}>
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
          <Button variant="cta" type="submit">
            Create
          </Button>
        </form>
      </View>
    </Layout>
  );
};

export default Draft;
