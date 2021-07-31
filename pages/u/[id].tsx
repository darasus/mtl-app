import React from "react";
import { GetServerSideProps } from "next";
import { Layout } from "../../components/Layout";
import { Post } from "../../components/Post";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import Image from "next/image";
import { getSession } from "next-auth/client";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import { fetchUser } from "../../request/fetchUser";
import { useUserQuery } from "../../hooks/useUserQuery";
import { useRouter } from "next/router";
import { useUserPostsQuery } from "../../hooks/useUserPostsQuery";
import { fetchUserPosts } from "../../request/fetchUserPosts";
import { useMeQuery } from "../../hooks/useMeQuery";

const UserPage: React.FC = () => {
  const router = useRouter();
  const userId = Number(router.query.id);
  const user = useUserQuery(userId);
  const me = useMeQuery();
  const posts = useUserPostsQuery(userId);

  if (!user.data || !posts.data) return null;

  return (
    <Layout>
      <main>
        <Box marginBottom="size-100">
          <Flex flexDirection="column" alignItems="center">
            <Box
              width={150}
              height={150}
              overflow="hidden"
              marginBottom="size-100"
            >
              <Image
                src={user.data?.image as string}
                width="500"
                height="500"
                alt="Avatar"
              />
            </Box>
            <Text>{user.data.name}</Text>
          </Flex>
        </Box>
        <Box>
          <Heading>Latest libraries:</Heading>
          {posts.data?.map((post) => (
            <Box key={post.id} marginBottom="size-300">
              <Post post={post} isMyPost={post.authorId === me.data?.id} />
            </Box>
          ))}
        </Box>
      </main>
    </Layout>
  );
};

export default UserPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const queryClient = new QueryClient();

  if (session) {
    await queryClient.prefetchQuery(["user", context.query.id], () =>
      fetchUser(Number(context.query.id))
    );
    await queryClient.prefetchQuery(["feed", context.query.id], () =>
      fetchUserPosts(Number(context.query.id))
    );
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
