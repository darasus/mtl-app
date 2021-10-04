import { useColorMode, useToken } from "@chakra-ui/react";
import React from "react";

export const useColors = () => {
  const { colorMode } = useColorMode();
  const [gray50, gray1000] = useToken("colors", ["gray.50", "gray.1000"]);
  const isDark = colorMode === "dark";

  const borderColor = React.useMemo(
    () => (isDark ? "gray.900" : "gray.200"),
    [colorMode]
  );

  const darkerBgColor = React.useMemo(
    () => (isDark ? gray1000 : gray50),
    [colorMode]
  );

  const secondaryTextColor = React.useMemo(
    () => (isDark ? "gray.600" : "gray.600"),
    [colorMode]
  );

  const secondaryButtonTextColor = React.useMemo(
    () => (isDark ? "gray.600" : "gray.600"),
    [colorMode]
  );

  return {
    borderColor,
    darkerBgColor,
    secondaryTextColor,
    secondaryButtonTextColor,
  };
};
