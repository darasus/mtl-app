import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/client";
import Image from "next/image";
import { Button, LinkButton } from "./Button";
import { UserPreview } from "./UserPreview";
import { useMeQuery } from "../hooks/useMeQuery";

export const Header: React.FC = () => {
  const router = useRouter();
  const { data: me } = useMeQuery();

  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  let right = null;

  if (!me) {
    right = (
      <div>
        <LinkButton href="/api/auth/signin">Log in</LinkButton>
      </div>
    );
  }

  if (me) {
    right = (
      <div className="flex">
        <div className="flex items-center mr-2">
          <UserPreview user={me} />
        </div>
        <LinkButton className="mr-2" href="/create">
          New post
        </LinkButton>
        <Button color="red" onClick={() => signOut()}>
          Log out
        </Button>
      </div>
    );
  }

  return (
    <nav className="flex py-4 items-center">
      <div className="flex-grow">
        <Link href="/">
          <a>
            <Image src="/logo.svg" height="31" width={200} />
          </a>
        </Link>
      </div>
      {right}
    </nav>
  );
};
