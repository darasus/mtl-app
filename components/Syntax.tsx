import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import { codeTheme } from "../constants/codeTheme";
import { useColorMode, useColorModeValue } from "@chakra-ui/react";

interface Props {
  value: string;
}

export const Syntax: React.FC<Props> = ({ value }) => {
  const { colorMode } = useColorMode();

  const theme = {
    ...codeTheme,
    plain: {
      color: "#9CDCFE",
      backgroundColor:
        colorMode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.0)",
    },
  };

  return (
    <Highlight
      {...defaultProps}
      theme={theme}
      code={value}
      language="javascript"
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={className}
          style={{
            ...style,
            padding: "10px 20px",
            marginTop: 0,
            marginBottom: 0,
          }}
        >
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};
