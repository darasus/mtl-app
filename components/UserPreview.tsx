import Prisma from ".prisma/client";
import { WithAdditionalParams } from "next-auth/_utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  user: Prisma.User;
}

export const UserPreview: React.FC<Props> = ({ user }) => {
  return (
    <Link href={`/u/${user.userName}`}>
      <div className="flex cursor-pointer items-center">
        <div className="rounded-full h-8 w-8 overflow-hidden mr-2">
          <Image className="w-full" src={user.image} width="50" height="50" />
        </div>
        <span>{user.name}</span>
      </div>
    </Link>
  );
};
