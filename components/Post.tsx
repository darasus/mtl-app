import React from "react";
import ReactMarkdown from "react-markdown";
import { UserPreview } from "./UserPreview";
import { CodePreview } from "./CodePreview";
import { Markdown } from "./Markdown";
import Prisma from ".prisma/client";
import { Flex } from "@react-spectrum/layout";
import { Link as SPLink } from "@react-spectrum/link";
import Link from "next/link";
import { View } from "@react-spectrum/view";
import { Text } from "@react-spectrum/text";

interface Props {
  post: Prisma.Post & { author: Prisma.User };
}

export const Post: React.FC<Props> = ({ post }) => {
  return (
    <>
      <View borderColor="gray-900" borderWidth="thin" padding="size-200">
        <Flex direction="column">
          <Flex alignItems="center">
            <Link as={`/p/${post.id}`} href={"/p/[id]"}>
              <SPLink marginEnd="size-100">
                <a>{post.title}</a>
              </SPLink>
            </Link>
            <View marginEnd="size-100">
              <Text>by</Text>
            </View>
            <View marginEnd="size-100">
              <UserPreview user={post.author} />
            </View>

            <View>
              <Text>{`${post.published ? "Published" : "Draft"}`}</Text>
            </View>
          </Flex>
          <Flex>
            <Text>
              <Markdown value={post.description} />
            </Text>
          </Flex>
          <CodePreview value={post.content} />
        </Flex>
      </View>
    </>
  );
};
