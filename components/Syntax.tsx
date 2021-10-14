import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import { syntaxStylesDark, syntaxStylesLight } from "../constants/codeTheme";
import { useColorMode } from "@chakra-ui/react";
import { useColors } from "../hooks/useColors";

interface Props {
  value: string;
}

export const Syntax: React.FC<Props> = ({ value }) => {
  const { darkerBgColor } = useColors();
  const { colorMode } = useColorMode();

  const theme = {
    styles: colorMode === "dark" ? syntaxStylesDark : syntaxStylesLight,
    plain: {
      color: "#9CDCFE",
      backgroundColor: darkerBgColor,
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
          {tokens.map((line, i) => {
            return (
              // eslint-disable-next-line react/jsx-key
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => {
                  // eslint-disable-next-line react/jsx-key
                  return <span {...getTokenProps({ token, key })} />;
                })}
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
};
