import { Link } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

interface Props extends React.ComponentProps<typeof Link> {
  href: string;
}

export const RouterLink: React.FC<Props> = ({
  children,
  href,
  sx,
  ...props
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <Link {...props} sx={{ ...sx, display: "flex", alignItems: "center" }}>
      <a href={href} onClick={handleClick}>
        {children}
      </a>
    </Link>
  );
};
