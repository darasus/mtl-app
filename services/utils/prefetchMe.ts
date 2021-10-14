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
  const me = new UserSessionService({ req: ctx.req as any }).get();

  if (me) {
    await queryClient.prefetchQuery(createUseMeQueryCacheKey(), () =>
      Promise.resolve(me)
    );
  }

  return me;
};
