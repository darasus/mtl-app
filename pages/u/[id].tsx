import React from "react";
import { GetServerSideProps } from "next";
import { Layout } from "../../components/Layout";
import Router from "next/router";
import Prisma from ".prisma/client";
import prisma from "../../lib/prisma";
import { Post } from "../../components/Post";
import { View } from "@react-spectrum/view";
import { Flex } from "@react-spectrum/layout";
import Image from "next/image";
import { Heading, Text } from "@react-spectrum/text";

interface Props {
  user: Prisma.User;
  feed: (Prisma.Post & { author: Prisma.User })[];
}

const UserPage: React.FC<Props> = ({ feed, user }) => {
  return (
    <Layout>
      <main>
        <View marginBottom="size-100">
          <Flex direction="column" alignItems="center">
            <View
              width={150}
              height={150}
              borderRadius="large"
              overflow="hidden"
              marginBottom="size-100"
            >
              <Image src={user.image} width="500" height="500" alt="Avatar" />
            </View>
            <Text>{user.name}</Text>
          </Flex>
        </View>
        <View>
          <Heading>Latest libraries:</Heading>
          {feed.map((post) => (
            <View key={post.id} marginBottom="size-300">
              <Post post={post} />
            </View>
          ))}
        </View>
      </main>
    </Layout>
  );
};

export default UserPage;

export const getServerSideProps: GetServerSideProps = async ({
  params,
}): Promise<{
  props: Props;
}> => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(params.id),
    },
  });
  const feed = await prisma.post.findMany({
    include: {
      author: {
        select: {
          id: true,
          name: true,
          userName: true,
          image: true,
          emailVerified: true,
          createdAt: true,
          email: true,
          updatedAt: true,
        },
      },
    },
  });

  return {
    props: { user, feed },
  };
};
