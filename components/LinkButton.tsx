import Link, { LinkProps } from "next/link";
import React from "react";

type Props = LinkProps;

export const LinkButton: React.FC<Props> = ({ children, href }) => {
  return (
    <Link href={href}>
      <a className="text-primary border block px-3 py-1 border-primary rounded-sm text-xs leading-tight uppercase">
        {children}
      </a>
    </Link>
  );
};
