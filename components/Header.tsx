import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/client";

export const Header: React.FC = () => {
  const router = useRouter();
  const [session] = useSession();

  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  let right = null;

  if (!session) {
    right = (
      <div>
        <Link href="/api/auth/signin">
          <a data-active={isActive("/signup")}>Log in</a>
        </Link>
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
        <Link href="/create">
          <button className="mr-2">
            <a>New post</a>
          </button>
        </Link>
        <button onClick={() => signOut()}>
          <a>Log out</a>
        </button>
      </div>
    );
  }

  return (
    <nav className="flex py-4">
      <div className="flex-grow">
        <Link href="/">
          <a>My little javascript library</a>
        </Link>
      </div>
      {right}
    </nav>
  );
};
