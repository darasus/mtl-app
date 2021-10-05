import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/client";
import { QueryClient } from "react-query";
import { createUseMeQueryCacheKey } from "../../hooks/query/useMeQuery";
import { User } from "../../types/User";
import { UserSessionService } from "../api/UserSessionService";

export const prefetchMe = async (
  ctx: GetServerSidePropsContext,
  queryClient: QueryClient
) => {
  const session = await getSession(ctx);

  let me: User | null = null;

  if (session) {
    me = await new UserSessionService(session).get();
    if (me) {
      await queryClient.prefetchQuery(createUseMeQueryCacheKey(), () =>
        Promise.resolve(me)
      );
    }
  }

  return me;
};
