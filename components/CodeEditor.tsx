import React from "react";
import dynamic from "next/dynamic";
import { CodeLanguage } from ".prisma/client";

const Editor = dynamic(import("@monaco-editor/react"), { ssr: false });

type Props = React.ComponentProps<typeof Editor> & {
  codeLanguage: CodeLanguage;
};

const langMap = {
  [CodeLanguage.JAVASCRIPT]: "javascript",
  [CodeLanguage.TYPESCRIPT]: "typescript",
};

export const CodeEditor: React.FC<Props> = (props) => {
  return (
    <Editor
      height={500}
      defaultLanguage={langMap[props.codeLanguage]}
      options={{
        minimap: {
          enabled: false,
        },
        scrollbar: {
          vertical: "hidden",
          horizontal: "hidden",
          verticalHasArrows: false,
          useShadows: false,
          handleMouseWheel: false,
        },
        glyphMargin: false,
        folding: false,
        lineNumbers: "off",
        lineNumbersMinChars: 0,
        renderLineHighlight: "none",
        overviewRulerBorder: false,
        overviewRulerLanes: 0,
        readOnly: false,
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
      theme="vs-dark"
      {...props}
    />
  );
};
