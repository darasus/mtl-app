import React from "react";
import { GetServerSideProps } from "next";
import { Layout } from "../../../components/Layout";
import prisma from "../../../lib/prisma";
import Prisma from ".prisma/client";
import { Post } from "../../../components/Post";
import { QueryClient } from "react-query";
import { fetchMe } from "../../../request/fetchMe";
import { usePostQuery } from "../../../hooks/usePostQuery";
import { useRouter } from "next/router";
import { fetchPost } from "../../../request/fetchPost";
import { dehydrate } from "react-query/hydration";
import { useMeQuery } from "../../../hooks/useMeQuery";

const PostPage: React.FC = () => {
  const router = useRouter();
  const post = usePostQuery(Number(router.query.id));
  const me = useMeQuery();

  if (!post.data) return null;

  return (
    <Layout>
      <main>
        <Post post={post.data} isMyPost={post.data.authorId === me.data?.id} />
      </main>
    </Layout>
  );
};

export default PostPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery("me", fetchMe);
  await queryClient.prefetchQuery(["post", params?.id], () =>
    fetchPost(Number(params?.id))
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
