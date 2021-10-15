import React from "react";
import { useRouter } from "next/router";
import { dehydrate } from "react-query/hydration";
import { GetServerSideProps } from "next";
import { QueryClient } from "react-query";
import { usePostQuery } from "../../../hooks/query/usePostQuery";
import { usePostEdit } from "../../../hooks/usePostEdit";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Layout } from "../../../layouts/Layout";
import { prefetchMe } from "../../../lib/utils/prefetchMe";
import { createIsFirstServerCall } from "../../../utils/createIsFirstServerCall";
import { PostForm, postSchema } from "../../../features/PostForm";

const EditPostPage: React.FC = () => {
  const router = useRouter();
  const post = usePostQuery(Number(router.query.id));
  const { editPost, isLoading } = usePostEdit(post.data?.id as number);
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
      tagId: tags[0].tag.id!,
    });
  }, [post.data, reset]);

  const submit = handleSubmit(async (data) => {
    await editPost(data);
    await router.push(`/p/${post.data?.id}`);
  });

  return (
    <Layout>
      <FormProvider {...form}>
        <PostForm submit={submit} isSubmitting={isLoading} />
      </FormProvider>
    </Layout>
  );
};

export default EditPostPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient();

  if (createIsFirstServerCall(ctx)) {
    await prefetchMe(ctx, queryClient);
  }

  return {
    props: {
      cookies: ctx.req.headers.cookie ?? "",
      dehydratedState: dehydrate(queryClient),
    },
  };
};
