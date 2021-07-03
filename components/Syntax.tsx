import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import { codeTheme } from "../constants/codeTheme";

interface Props {
  value: string;
}

export const Synaxt: React.FC<Props> = ({ value }) => {
  return (
    <Highlight
      {...defaultProps}
      theme={codeTheme}
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
