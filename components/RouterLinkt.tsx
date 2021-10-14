import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Link as ChakraLink } from "@chakra-ui/react";

interface Props extends React.ComponentProps<typeof Link> {
  href: string;
}

export const RouterLink: React.FC<Props> = ({ children, href, ...props }) => {
  return (
    <Link href={href} {...props} passHref>
      <ChakraLink textDecoration="underline">{children}</ChakraLink>
    </Link>
  );
};
