import React from "react";
import dynamic from "next/dynamic";
import { CodeLanguage } from ".prisma/client";
import { Box } from "@chakra-ui/layout";
import { useColors } from "../hooks/useColors";

const Editor = dynamic(import("@monaco-editor/react"), { ssr: false });

type Props = React.ComponentProps<typeof Editor> & {
  codeLanguage: CodeLanguage;
};

export const langMap = {
  [CodeLanguage.JAVASCRIPT]: "javascript",
  [CodeLanguage.TYPESCRIPT]: "typescript",
} as const;

export const CodeEditor: React.FC<Props> = ({ codeLanguage, ...props }) => {
  const { borderColor } = useColors();

  return (
    <Box p={3} borderColor={borderColor} borderWidth="thin" borderRadius="md">
      <Editor
        height={500}
        language={langMap[codeLanguage]}
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
    </Box>
  );
};
