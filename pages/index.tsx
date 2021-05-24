import axios from "axios";
import { GetServerSideProps, GetStaticProps } from "next";
import { getSession } from "next-auth/client";
import { QueryClient } from "react-query";
import { Layout } from "../components/Layout";
import { Post } from "../components/Post";
import prisma from "../lib/prisma";
import { fetchMe } from "../request/fetchMe";
import Prisma from ".prisma/client";
import { View } from "@react-spectrum/view";
import { usePostDelete } from "../hooks/usePostDelete";
import React from "react";
import { dehydrate } from "react-query/hydration";
import { fetchFeed } from "../request/fetchFeed";
import { useFeedQuery } from "../hooks/useFeedQuery";

const Index: React.FC = () => {
  const feed = useFeedQuery();
  const { deletePost } = usePostDelete();
  const handleDeletePost = React.useCallback(
    (id: number) => () => deletePost(id),
    [deletePost]
  );

  return (
    <Layout>
      <main>
        {feed.data?.map((post) => (
          <View key={post.id} marginBottom="size-300">
            <Post post={post} onDeletePost={handleDeletePost(post.id)} />
          </View>
        ))}
      </main>
    </Layout>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const queryClient = new QueryClient();
  if (session) {
    await queryClient.prefetchQuery("me", fetchMe);
  }
  await queryClient.prefetchQuery("feed", fetchFeed);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
