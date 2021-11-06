import React from "react";
import { GetServerSideProps } from "next";
import { Post } from "../../components/Post";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import { useUserQuery } from "../../hooks/query/useUserQuery";
import { useRouter } from "next/router";
import { useUserPostsQuery } from "../../hooks/query/useUserPostsQuery";
import { useFollowMutation } from "../../hooks/mutation/useFollowMutation";
import { useFollowersCountQuery } from "../../hooks/query/useFollowersCountQuery";
import { useUnfollowMutation } from "../../hooks/mutation/useUnfollowMutation";
import { useDoIFollowUserQuery } from "../../hooks/query/useDoIFollowUserQuery";
import { UserGroupIcon } from "@heroicons/react/outline";
import { Layout } from "../../layouts/Layout";
import { useColors } from "../../hooks/useColors";
import { Head } from "../../components/Head";
import { createIsFirstServerCall } from "../../utils/createIsFirstServerCall";
import { Fetcher } from "../../lib/Fetcher";
import { ServerHttpConnector } from "../../lib/ServerHttpConnector";
import { Heading } from "../../components/Heading";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { SignedIn, useUser } from "@clerk/nextjs";

const FollowButton = () => {
  const user = useUser();
  const followMutation = useFollowMutation();
  const unfollowMutation = useUnfollowMutation();
  const doIFollowUser = useDoIFollowUserQuery(user.id);
  const router = useRouter();
  const { id: userId } = router.query;
  const isMyPage = user.id === userId;

  const handleFollow = () => {
    followMutation.mutateAsync({
      userId: user.data.id,
    });
  };

  const handleUnfollow = () => {
    unfollowMutation.mutateAsync({
      userId: user.data.id,
    });
  };

  return !isMyPage ? (
    doIFollowUser.data?.doIFollow ? (
      <Button
        variant="outline"
        mb={1}
        onClick={handleUnfollow}
        disabled={unfollowMutation.isLoading}
        isLoading={unfollowMutation.isLoading}
      >
        Unfollow
      </Button>
    ) : (
      <Button
        variant="outline"
        mb={1}
        onClick={handleFollow}
        disabled={followMutation.isLoading}
        isLoading={followMutation.isLoading}
      >
        Follow
      </Button>
    )
  ) : null;
};

const UserPage: React.FC = () => {
  const { secondaryTextColor } = useColors();
  const router = useRouter();
  const userId = String(router.query.id);
  const user = useUserQuery(userId);
  const posts = useUserPostsQuery(userId);
  const followersCount = useFollowersCountQuery(userId);

  return (
    <>
      <Head
        title={user.data?.fullname as string}
        urlPath={`u/${user.data?.id}`}
      />
      <Layout>
        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          <GridItem colSpan={[12, 12, 3, 3]}>
            <Flex marginBottom="size-100" justifyContent="center" mb={3}>
              {user.isLoading && (
                <Flex justifyContent="center">
                  <Spinner />
                </Flex>
              )}
              {user.data && (
                <Flex flexDirection="column">
                  <Box
                    width={150}
                    height={150}
                    overflow="hidden"
                    marginBottom="size-100"
                    borderRadius="100"
                    borderWidth="thick"
                    borderColor="brand"
                    boxShadow="base"
                    mb={2}
                  >
                    <Image
                      src={user.data?.image}
                      width="500"
                      height="500"
                      alt="Avatar"
                    />
                  </Box>
                  <Text fontWeight="bold" fontSize="2xl" mb={1} isTruncated>
                    {user.data?.fullname}
                  </Text>
                  <SignedIn>
                    <FollowButton />
                  </SignedIn>
                  <Flex alignItems="center">
                    <Text mr={1} color={secondaryTextColor}>
                      <UserGroupIcon
                        className={secondaryTextColor}
                        width="20"
                        height="20"
                      />
                    </Text>
                    <Text
                      fontWeight="bold"
                      fontSize="sm"
                      color={secondaryTextColor}
                    >{`${followersCount.data || 0} followers`}</Text>
                  </Flex>
                </Flex>
              )}
            </Flex>
          </GridItem>
          <GridItem colSpan={[12, 12, 9, 9]}>
            <Box>
              <Heading title="My libraries" />
              {posts.isLoading && (
                <Flex justifyContent="center">
                  <Spinner />
                </Flex>
              )}
              {posts.data?.map((post) => (
                <Box key={post.id} mb={6}>
                  <Post postId={post.id} isPostStatusVisible />
                </Box>
              ))}
            </Box>
          </GridItem>
        </Grid>
      </Layout>
    </>
  );
};

export default UserPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient();

  if (!createIsFirstServerCall(ctx)) {
    return {
      props: {
        cookies: ctx.req.headers.cookie ?? "",
      },
    };
  }

  const httpConnector = new ServerHttpConnector(ctx);
  const fetcher = new Fetcher(httpConnector);
  const userId = String(ctx.query.id);

  await Promise.all([
    queryClient.prefetchQuery(clientCacheKey.createUserKey(userId), () =>
      fetcher.getUser(userId)
    ),
  ]);

  ctx.res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=604800"
  );

  return {
    props: {
      cookies: ctx.req.headers.cookie ?? "",
      dehydratedState: dehydrate(queryClient),
    },
  };
};
