import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/client";
import Image from "next/image";
import { Button, LinkButton } from "./Button";

export const Header: React.FC = () => {
  const router = useRouter();
  const [session] = useSession();

  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  let right = null;

  if (!session) {
    right = (
      <div>
        <LinkButton href="/api/auth/signin">Log in</LinkButton>
      </div>
    );
  }

  if (session) {
    right = (
      <div className="flex">
        <div className="flex items-center mr-2">
          <div className="w-8 rounded-full overflow-hidden mr-2">
            <img className="w-full" src={session.user.image} />
          </div>
          <span>{session.user.name}</span>
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
