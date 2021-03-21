import React from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  value: string;
}

export const Markdown: React.FC<Props> = ({ value }) => {
  return (
    <div className="markdown-block">
      <ReactMarkdown source={value} />
    </div>
  );
};
