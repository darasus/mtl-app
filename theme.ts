import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  useSystemColorMode: true,
};

export const theme = extendTheme({
  config,
  styles: {
    global: (props) => ({
      "html, body": {
        color: props.colorMode === "dark" ? "white" : "black",
        background: props.colorMode === "dark" ? "black" : "white",
      },
    }),
  },
});