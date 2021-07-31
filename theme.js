import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        color: "black",
      },
      a: {
        color: "teal.500",
      },
    },
  },
});
