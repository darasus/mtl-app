import { useColorMode, useToken } from "@chakra-ui/react";
import React from "react";

export const useColors = () => {
  const { colorMode } = useColorMode();
  const [gray50, gray900] = useToken("colors", ["gray.50", "gray.900"]);

  const borderColor = React.useMemo(
    () => (colorMode === "dark" ? "gray.700" : "gray.200"),
    [colorMode]
  );

  const darkerBgColor = React.useMemo(
    () => (colorMode === "dark" ? gray900 : gray50),
    [colorMode]
  );

  return { borderColor, darkerBgColor };
};
