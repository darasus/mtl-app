import { CtxOrReq, getSession } from "next-auth/client";
import { MeSession } from "../types/MeSession";

export const getUserSession = async ({ req }: CtxOrReq) => {
  const session = (await getSession({ req })) as MeSession | null;

  return session;
};
