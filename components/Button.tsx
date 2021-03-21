import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import React, { ButtonHTMLAttributes, LinkHTMLAttributes } from "react";

export const buttonClassname =
  "border block px-3 py-1 rounded-sm text-xs uppercase h-7 font-normal h-6 leading-5";

type HasColor = {
  color?: "primary" | "red";
};

type ButtonProps = ButtonHTMLAttributes<{}> & HasColor;

export const Button: React.FC<ButtonProps> = ({
  children,
  color = "primary",
  ...rest
}) => {
  return (
    <button
      className={clsx(buttonClassname, {
        ["text-red-600 border-red-600"]: color === "red",
        ["text-primary border-primary"]: color === "primary",
      })}
      {...rest}
    >
      {children}
    </button>
  );
};

type LinkButtonProps = LinkHTMLAttributes<{}> & HasColor;

export const LinkButton: React.FC<LinkButtonProps> = ({
  children,
  color = "primary",
  href,
  className,
  ...rest
}) => {
  return (
    <Link href={href}>
      <a
        {...rest}
        className={clsx(buttonClassname, className, {
          ["text-red-600 border-red-600"]: color === "red",
          ["text-primary border-primary"]: color === "primary",
        })}
      >
        {children}
      </a>
    </Link>
  );
};
