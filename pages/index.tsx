import { GetServerSideProps } from "next";
import { QueryClient } from "react-query";
import { Layout } from "../components/Layout";
import { Post } from "../components/Post";
import { View } from "@react-spectrum/view";
import React from "react";
import { dehydrate } from "react-query/hydration";
import { fetchFeed } from "../request/fetchFeed";
import { useFeedQuery } from "../hooks/useFeedQuery";
import { useMeQuery } from "../hooks/useMeQuery";

const Index: React.FC = () => {
  const feed = useFeedQuery();
  const me = useMeQuery();

  return (
    <Layout>
      <main>
        {feed.data?.map((post) => (
          <View key={post.id} marginBottom="size-300">
            <Post post={post} isMyPost={post.authorId === me.data?.id} />
          </View>
        ))}
      </main>
    </Layout>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery("feed", fetchFeed);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
