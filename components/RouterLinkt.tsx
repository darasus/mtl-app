import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Link as ChakraLink } from "@chakra-ui/react";

interface Props extends React.ComponentProps<typeof Link> {
  href: string;
}

export const RouterLink: React.FC<Props> = ({ children, href, ...props }) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <Link href={href} {...props} passHref>
      <ChakraLink href={href} onClick={handleClick} textDecoration="underline">
        {children}
      </ChakraLink>
    </Link>
  );
};
