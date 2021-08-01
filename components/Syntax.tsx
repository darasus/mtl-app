import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import { syntaxStylesDark, syntaxStylesLight } from "../constants/codeTheme";
import { useColorMode, useColorModeValue, useToken } from "@chakra-ui/react";

interface Props {
  value: string;
}

export const Syntax: React.FC<Props> = ({ value }) => {
  const { colorMode } = useColorMode();
  const [gray50, gray900] = useToken("colors", ["gray.50", "gray.900"]);

  const theme = {
    styles: colorMode === "dark" ? syntaxStylesDark : syntaxStylesLight,
    plain: {
      color: "#9CDCFE",
      backgroundColor: colorMode === "dark" ? gray900 : gray50,
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
