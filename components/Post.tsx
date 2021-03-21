import React from "react";
// import Router from "next/router";
import ReactMarkdown from "react-markdown";
import { Author } from "../types/Author";
import { AuthorPreview } from "./AuthorPreview";
import { CodePreview } from "./CodePreview";
import { Markdown } from "./Markdown";

export type PostProps = {
  id: number;
  title: string;
  author: Author;
  content: string;
  description: string;
  published: boolean;
};

export const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  console.log(post);
  return (
    <div
      className="border-gray-100 border mb-10 p-4"
      style={{ boxShadow: "#ffffff1f 10px 10px 0px 0px" }}
      // onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}
    >
      <div className="flex items-center">
        <span className="mr-2">{post.title}</span>
        <span className="mr-2">by</span>
        <AuthorPreview author={post.author} />
      </div>
      <div className="my-2">
        <Markdown value={post.description} />
      </div>
      <CodePreview value={post.content} />
    </div>
  );
};
