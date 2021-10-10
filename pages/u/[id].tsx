import React from "react";
import { GetServerSideProps } from "next";
import { Post } from "../../components/Post";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import { getSession } from "next-auth/client";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import { fetchUser } from "../../request/fetchUser";
import {
  createUseUserQueryCacheKey,
  useUserQuery,
} from "../../hooks/query/useUserQuery";
import { useRouter } from "next/router";
import {
  createUseUserPostsQueryCacheKey,
  useUserPostsQuery,
} from "../../hooks/query/useUserPostsQuery";
import { fetchUserPosts } from "../../request/fetchUserPosts";
import { useMeQuery } from "../../hooks/query/useMeQuery";
import { useFollowMutation } from "../../hooks/useFollowMutation";
import { useFollowersCountQuery } from "../../hooks/query/useFollowersCountQuery";
import { useUnfollowMutation } from "../../hooks/mutation/useUnfollowMutation";
import { useDoIFollowUserQuery } from "../../hooks/query/useDoIFollowUserQuery";
import { UserGroupIcon } from "@heroicons/react/outline";
import { Layout } from "../../layouts/Layout";
import { useColors } from "../../hooks/useColors";
import { prefetchMe } from "../../services/utils/prefetchMe";

const UserPage: React.FC = () => {
  const { secondaryTextColor } = useColors();
  const router = useRouter();
  const userId = Number(router.query.id);
  const user = useUserQuery(userId);
  const me = useMeQuery();
  const posts = useUserPostsQuery(userId);
  const followMutation = useFollowMutation();
  const unfollowMutation = useUnfollowMutation();
  const followersCount = useFollowersCountQuery(userId);
  const doIFollowUser = useDoIFollowUserQuery(userId);
  const isMyPage = me.data?.id === userId;

  const handleFollow = () => {
    followMutation.mutateAsync({
      userId: user.data?.id!,
    });
  };

  const handleUnfollow = () => {
    unfollowMutation.mutateAsync({
      userId: user.data?.id!,
    });
  };

  const followButton = !isMyPage ? (
    doIFollowUser.data ? (
      <Button
        variant="outline"
        mb={1}
        onClick={handleUnfollow}
        disabled={unfollowMutation.isLoading}
      >
        Unfollow
      </Button>
    ) : (
      <Button
        variant="outline"
        mb={1}
        onClick={handleFollow}
        disabled={followMutation.isLoading}
      >
        Follow
      </Button>
    )
  ) : null;

  return (
    <Layout>
      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        <GridItem colSpan={3}>
          <Box marginBottom="size-100">
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
                    src={user.data?.image as string}
                    width="500"
                    height="500"
                    alt="Avatar"
                  />
                </Box>
                <Text fontWeight="bold" fontSize="2xl" mb={1}>
                  {user.data?.name}
                </Text>
                {followButton}
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
                  >{`${followersCount.data} followers`}</Text>
                </Flex>
              </Flex>
            )}
          </Box>
        </GridItem>
        <GridItem colSpan={9}>
          <Box>
            <Heading mb={10} variant="section-heading">
              My libraries
            </Heading>
            {posts.isLoading && (
              <Flex justifyContent="center">
                <Spinner />
              </Flex>
            )}
            {posts.data?.map((post) => (
              <Box key={post.id} mb={6}>
                <Post post={post} isMyPost={post.authorId === me.data?.id} />
              </Box>
            ))}
          </Box>
        </GridItem>
      </Grid>
    </Layout>
  );
};

export default UserPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient();
  const userId = Number(ctx.query.id);

  await Promise.all([
    prefetchMe(ctx, queryClient),
    queryClient.prefetchQuery(createUseUserQueryCacheKey(userId), () =>
      fetchUser(userId)
    ),
    queryClient.prefetchQuery(createUseUserPostsQueryCacheKey(userId), () =>
      fetchUserPosts(userId)
    ),
  ]);

  return {
    props: {
      cookies: ctx.req.headers.cookie ?? "",
      dehydratedState: dehydrate(queryClient),
    },
  };
};
