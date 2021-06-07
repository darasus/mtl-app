import { Link } from "@react-spectrum/link";
import { useRouter } from "next/router";
import React from "react";

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
    <Link {...props}>
      <a href={href} onClick={handleClick}>
        {children}
      </a>
    </Link>
  );
};
