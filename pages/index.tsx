import { GetServerSideProps } from "next";
import { Post } from "../components/Post";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import React from "react";
import { useFeedQuery } from "../hooks/query/useFeedQuery";
import { Layout } from "../layouts/Layout";
import { Head } from "../components/Head";
import { Intro } from "../components/Intro";
import { FeedType } from "../types/FeedType";
import { Heading } from "../components/Heading";
import { useMe } from "../hooks/useMe";

const Index: React.FC = () => {
  const [feedType, setFeedType] = React.useState(FeedType.Latest);
  const feed = useFeedQuery({ feedType });
  const me = useMe();
  const isMeLoading = me?.isLoading;

  return (
    <>
      <Head title="Home" urlPath="" />
      <Layout>
        <main>
          {!me && !isMeLoading && (
            <Center height="50vh">
              <Intro withSignIn />
            </Center>
          )}
          <Heading title="Library feed">
            <ButtonGroup isAttached variant="solid">
              <Button
                size="xs"
                variant={feedType === FeedType.Latest ? "cta" : "solid"}
                onClick={() => setFeedType(FeedType.Latest)}
                mr="0px"
              >
                Latest
              </Button>
              <Button
                size="xs"
                variant={feedType === FeedType.Following ? "cta" : "solid"}
                onClick={() => setFeedType(FeedType.Following)}
              >
                Following
              </Button>
            </ButtonGroup>
          </Heading>
          {feed.isLoading && (
            <Flex justifyContent="center" mt={5} mb={5}>
              <Spinner />
            </Flex>
          )}
          {feed.data?.pages?.map((page) => {
            return page.items?.map((post) => {
              return (
                <Box key={post.id} mb={6}>
                  <Post
                    postId={post.id}
                    isMyPost={post.authorId === me?.user?.id}
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
  ctx.res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=604800"
  );

  return {
    props: {
      cookies: ctx.req.headers.cookie ?? "",
    },
  };
};
