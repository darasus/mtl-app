import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        color: "black",
        lineHeight: "tall",
      },
      a: {
        color: "teal.500",
      },
    },
  },
});
