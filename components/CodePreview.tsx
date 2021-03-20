import React from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(import("@monaco-editor/react"), { ssr: false });

interface Props {
  value: string;
}

export const CodePreview: React.FC<Props> = (props) => {
  return (
    <div>
      <Editor
        height="100px"
        defaultLanguage="javascript"
        value={props.value}
        options={{
          minimap: {
            enabled: false,
          },
        }}
      />
    </div>
  );
};
