import React from "react";
import { GetServerSideProps } from "next";
import { Layout } from "../../components/Layout";
import Router from "next/router";
import { useSession } from "next-auth/client";
import Prisma from ".prisma/client";
import { getUserByUsername } from "../../request/getUserByUsername";
import prisma from "../../lib/prisma";
import { Post } from "../../components/Post";

const UserPage: React.FC<Props> = (props) => {
  return (
    <Layout>
      <main>
        {props.feed.map((post) => (
          <div key={post.id}>
            <Post post={post} />
          </div>
        ))}
      </main>
    </Layout>
  );
};

export default UserPage;

async function publishPost(id: number): Promise<void> {
  await fetch(`http://localhost:3000/api/publish/${id}`, {
    method: "PUT",
  });
  await Router.push("/");
}

async function deletePost(id: number): Promise<void> {
  await fetch(`http://localhost:3000/api/post/${id}`, {
    method: "DELETE",
  });
  await Router.push("/");
}

export const getServerSideProps: GetServerSideProps = async (): Promise<{
  props: Props;
}> => {
  const feed = await prisma.post.findMany({
    where: {
      published: false,
    },
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
    props: { feed },
  };
};

interface Props {
  feed: (Prisma.Post & { author: Prisma.User })[];
}
