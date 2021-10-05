import { GetServerSideProps } from "next";
import { QueryClient } from "react-query";
import { Post } from "../components/Post";
import { Box, Flex, Heading, Spinner } from "@chakra-ui/react";
import React from "react";
import { dehydrate } from "react-query/hydration";
import {
  createUseFeedQueryCacheKey,
  useFeedQuery,
} from "../hooks/query/useFeedQuery";
import {
  createUseMeQueryCacheKey,
  useMeQuery,
} from "../hooks/query/useMeQuery";
import { Layout } from "../layouts/Layout";
import { UserSessionService } from "../services/api/UserSessionService";
import { getSession } from "next-auth/client";
import { FeedService } from "../services/api/FeedService";
import { User } from "../types/User";
import { prefetchMe } from "../services/utils/prefetchMe";

const Index: React.FC = () => {
  const feed = useFeedQuery();
  const me = useMeQuery();

  return (
    <Layout>
      <main>
        <Heading mb={10} variant="section-heading">
          Latest libraries
        </Heading>
        {feed.isLoading && (
          <Flex justifyContent="center" mt={5} mb={5}>
            <Spinner />
          </Flex>
        )}
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient();
  const me = await prefetchMe(ctx, queryClient);
  const feedService = new FeedService();

  await queryClient.prefetchQuery(createUseFeedQueryCacheKey(), () =>
    feedService.fetchFeed(me?.id || undefined)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
