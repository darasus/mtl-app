import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  useSystemColorMode: true,
};

const token = {
  color: {
    brand: "#6d28d9",
  },
};

export const theme = extendTheme({
  config,
  shadows: {
    outline: `0 0 0 2px ${token.color.brand + "50"}`,
  },
  colors: {
    brand: token.color.brand,
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
    focusBorderColor: "brand.500",
  },
  components: {
    Heading: {
      variants: {
        "section-heading": {
          borderBottom: `3px solid ${token.color.brand}`,
          paddingBottom: "0.5rem",
        },
      },
    },
    Menu: {
      baseStyle: (props) => ({
        list: {
          bg: props.colorMode === "dark" ? "black" : "white",
          borderColor: props.colorMode === "dark" ? "gray.900" : "gray.200",
        },
        item: {
          fontSize: "sm",
        },
      }),
    },
    Input: {
      defaultProps: {
        focusBorderColor: token.color.brand + "50",
      },
    },
    Textarea: {
      defaultProps: {
        focusBorderColor: token.color.brand + "50",
      },
    },
  },
});
