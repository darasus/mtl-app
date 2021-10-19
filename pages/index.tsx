import { GetServerSideProps } from "next";
import { QueryClient } from "react-query";
import { Post } from "../components/Post";
import { Box, Button, Center, Flex, Heading, Spinner } from "@chakra-ui/react";
import React from "react";
import { dehydrate } from "react-query/hydration";
import { useFeedQuery } from "../hooks/query/useFeedQuery";
import { useMeQuery } from "../hooks/query/useMeQuery";
import { Layout } from "../layouts/Layout";
import { prefetchMe } from "../lib/utils/prefetchMe";
import { Head } from "../components/Head";
import { createIsFirstServerCall } from "../utils/createIsFirstServerCall";
import { Intro } from "../components/Intro";
import { slogan } from "../constants/slogan";

const imageUrl = `${process.env.NEXTAUTH_URL}/api/screenshot?url=${process.env.NEXTAUTH_URL}/home-preview-image`;

const Index: React.FC = () => {
  const feed = useFeedQuery();
  const me = useMeQuery();

  return (
    <>
      <Head
        title="Home"
        description={slogan}
        urlPath=""
        facebookImage={imageUrl}
        twitterImage={imageUrl}
      />
      <Layout>
        <main>
          {!me.data && (
            <Center height="50vh">
              <Intro withSignIn />
            </Center>
          )}
          <Heading mb={10} variant="section-heading">
            Library feed
          </Heading>
          {feed.isLoading && (
            <Flex justifyContent="center" mt={5} mb={5}>
              <Spinner />
            </Flex>
          )}
          {feed.data?.pages.map((page) => {
            return page.items.map((post) => {
              return (
                <Box key={post.id} mb={6}>
                  <Post
                    postId={post.id}
                    isMyPost={post.authorId === me.data?.id}
                  />
                </Box>
              );
            });
          })}
          {feed.hasNextPage && (
            <Flex justifyContent="center">
              <Button
                color="brand"
                borderColor="brand"
                variant="outline"
                size="sm"
                isLoading={feed.isFetchingNextPage}
                onClick={() => feed.fetchNextPage()}
              >
                Load more...
              </Button>
            </Flex>
          )}
        </main>
      </Layout>
    </>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient();

  if (!createIsFirstServerCall(ctx)) {
    return {
      props: {
        cookies: ctx.req.headers.cookie ?? "",
      },
    };
  }

  await prefetchMe(ctx, queryClient);

  return {
    props: {
      cookies: ctx.req.headers.cookie ?? "",
      dehydratedState: dehydrate(queryClient),
    },
  };
};
