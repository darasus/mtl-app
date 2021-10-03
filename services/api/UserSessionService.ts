import invariant from "invariant";
import { Session } from "next-auth";
import prisma from "../../lib/prisma";
import { userFragment } from "../fragments/userFragment";

export class UserSessionService {
  session: Session | null;

  constructor(session: Session) {
    this.session = session;
  }

  async get() {
    const user = await prisma.user.findUnique({
      where: {
        email: this.session?.user?.email!,
      },
      select: userFragment,
    });

    invariant(user?.id, "User is not found");

    return user;
  }
}
