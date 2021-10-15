import { GetServerSidePropsContext } from "next";
import { QueryClient } from "react-query";
import { createUseMeQueryCacheKey } from "../../hooks/query/useMeQuery";
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
