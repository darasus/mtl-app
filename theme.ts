import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  useSystemColorMode: true,
};

export const theme = extendTheme({
  config,
  colors: {
    brand: "#f7df1e",
    gray: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#eeeeee",
      300: "#e0e0e0",
      400: "#bdbdbd",
      500: "#9e9e9e",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
      1000: "#0a0a0a",
    },
  },
  styles: {
    global: (props) => ({
      "html, body": {
        color: props.colorMode === "dark" ? "white" : "black",
        background: props.colorMode === "dark" ? "black" : "white",
      },
    }),
  },
  components: {
    Heading: {
      baseStyle: {
        fontFamily: "Merriweather",
      },
    },
    MenuItem: {
      baseStyle: {
        background: "white",
        color: "black",
      },
    },
  },
});
