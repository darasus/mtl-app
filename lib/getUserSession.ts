import { getSession } from "next-auth/client";
import { MeSession } from "../types/MeSession";

export const getUserSession = async ({ req }: any) => {
  const session = (await getSession({ req })) as MeSession | null;

  return session;
};
