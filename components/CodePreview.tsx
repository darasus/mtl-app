import React from "react";
import dynamic from "next/dynamic";
import { EditorProps } from "@monaco-editor/react";

const Editor = dynamic(import("@monaco-editor/react"), { ssr: false });

interface Props {
  value: string;
}

export const CodePreview: React.FC<Props> = (props) => {
  let prevHeight = React.useRef(null);

  const updateEditorHeight: EditorProps["onMount"] = React.useCallback(
    (editor, monaco) => {
      const editorElement = editor.getDomNode();

      if (!editorElement) {
        return;
      }

      const lineHeight = editor.getOption(
        monaco.editor.EditorOption.lineHeight
      );
      const lineCount = editor.getModel()?.getLineCount() || 1;
      const height = editor.getTopForLineNumber(lineCount + 1) + lineHeight;

      if (prevHeight.current !== height) {
        prevHeight.current = height;
        editorElement.style.height = `${height}px`;
        editor.layout();
      }
    },
    []
  );

  return (
    <div>
      <Editor
        height={prevHeight.current}
        defaultLanguage="javascript"
        value={props.value}
        onMount={updateEditorHeight}
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
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 0,
          renderLineHighlight: "none",
          overviewRulerBorder: false,
          overviewRulerLanes: 0,
          readOnly: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
        theme="vs-dark"
      />
    </div>
  );
};
