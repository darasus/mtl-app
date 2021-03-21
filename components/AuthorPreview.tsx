import Image from "next/image";
import React from "react";
import { Author } from "../types/Author";

interface Props {
  author: Author;
}

export const AuthorPreview: React.FC<Props> = ({ author }) => {
  return (
    <div className="flex items-center">
      <div className="rounded-full h-8 w-8 overflow-hidden mr-2">
        <Image className="w-full" src={author.image} width="50" height="50" />
      </div>
      <span>{author.name}</span>
    </div>
  );
};
