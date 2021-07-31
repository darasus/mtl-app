import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "light",
  useSystemColorMode: true,
};

export const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        color: "white",
        backgroundColor: "black",
      },
      a: {
        color: "teal.500",
      },
    },
  },
  config,
});
