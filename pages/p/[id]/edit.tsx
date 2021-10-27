import React from "react";
import { useRouter } from "next/router";
import { dehydrate } from "react-query/hydration";
import { GetServerSideProps } from "next";
import { QueryClient } from "react-query";
import { usePostQuery } from "../../../hooks/query/usePostQuery";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createIsFirstServerCall } from "../../../utils/createIsFirstServerCall";
import { PostForm, postSchema } from "../../../features/PostForm";
import invariant from "invariant";
import { usePostEditMutation } from "../../../hooks/mutation/usePostEditMutation";
import { FullscreenLayout } from "../../../layouts/FullscreenLayout";
import { Head } from "../../../components/Head";
import { ServerHttpConnector } from "../../../lib/ServerHttpConnector";
import { Fetcher } from "../../../lib/Fetcher";

const EditPostPage: React.FC = () => {
  const router = useRouter();
  const post = usePostQuery(Number(router.query.id));
  const postEditMutation = usePostEditMutation(post.data?.id as number);
  const form = useForm<PostForm>({
    resolver: yupResolver(postSchema),
  });
  const { reset, handleSubmit } = form;

  React.useEffect(() => {
    if (!post.data) return;

    const { title, description, content, codeLanguage, tags } = post.data;

    reset({
      title,
      description: description!,
      content: content!,
      codeLanguage: codeLanguage!,
      tagId: tags?.[0]?.tag?.id || null,
    });
  }, [post.data, reset]);

  const handleUpdate = handleSubmit(
    async ({ tagId, codeLanguage, content, description, title }) => {
      invariant(typeof tagId === "number", "tagId is required");
      await postEditMutation.mutateAsync({
        tagId,
        codeLanguage,
        content,
        description,
        title,
      });
      await router.push(`/p/${post.data?.id}`);
    }
  );

  return (
    <>
      <Head title="Edit tiny library" urlPath="/create" />
      <FullscreenLayout>
        <FormProvider {...form}>
          <PostForm
            handleUpdate={handleUpdate}
            isUpdating={postEditMutation.isLoading}
          />
        </FormProvider>
      </FullscreenLayout>
    </>
  );
};

export default EditPostPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      cookies: ctx.req.headers.cookie ?? "",
    },
  };
};
