import React from "react";
import ReactMarkdown from "react-markdown";
import { UserPreview } from "./UserPreview";
import { CodePreview } from "./CodePreview";
import { Markdown } from "./Markdown";
import Prisma from ".prisma/client";
import Link from "next/link";

interface Props {
  post: Prisma.Post & { author: Prisma.User };
}

export const Post: React.FC<Props> = ({ post }) => {
  return (
    <div
      className="border-gray-100 border mb-10 p-4"
      style={{ boxShadow: "#ffffff1f 10px 10px 0px 0px" }}
    >
      <div className="flex items-center">
        <Link as={`/p/${post.id}`} href={"/p/[id]"}>
          <a className="mr-2">{post.title}</a>
        </Link>
        <span className="mr-2">by</span>
        <UserPreview user={post.author} />
      </div>
      <div className="my-2">
        <Markdown value={post.description} />
      </div>
      <CodePreview value={post.content} />
    </div>
  );
};
