import { useColorMode } from "@chakra-ui/react";
import Image from "next/image";

export const Logo = () => {
  const { colorMode } = useColorMode();

  return (
    <Image
      src={colorMode === "dark" ? "/logo-light.svg" : "/logo-dark.svg"}
      height="30"
      width={130}
    />
  );
};
