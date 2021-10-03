import { GetServerSideProps } from "next";
import { QueryClient } from "react-query";
import { Post } from "../components/Post";
import { Box } from "@chakra-ui/react";
import React from "react";
import { dehydrate } from "react-query/hydration";
import { fetchFeed } from "../request/fetchFeed";
import { useFeedQuery } from "../hooks/query/useFeedQuery";
import { useMeQuery } from "../hooks/query/useMeQuery";
import { Layout } from "../layouts/Layout";

const Index: React.FC = () => {
  const feed = useFeedQuery();
  const me = useMeQuery();

  return (
    <Layout>
      <main>
        {feed.data?.map((post) => (
          <Box key={post.id} mb={6}>
            <Post post={post} isMyPost={post.authorId === me.data?.id} />
          </Box>
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
