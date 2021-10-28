import Redis from "ioredis";
import debug from "debug";
import { Prisma } from ".prisma/client";
import "colors";

export type PrismaAction =
  | "findUnique"
  | "findFirst"
  | "findMany"
  | "create"
  | "createMany"
  | "update"
  | "updateMany"
  | "upsert"
  | "delete"
  | "deleteMany"
  | "executeRaw"
  | "queryRaw"
  | "aggregate"
  | "count"
  | "groupBy";

/**
 * These options are being passed in to the middleware as "params"
 * https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#params
 */
// type ModelName = "";

// export type MiddlewareParams = {
//   model?: ModelName;
//   action: PrismaAction;
//   args: any;
//   dataPath: string[];
//   runInTransaction: boolean;
// };

// https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#use
// export type Middleware<T = any> = (params: any, next: (params: any) => Promise<T>) => Promise<T>;

debug("prisma-redis-middleware");

function log(message: string) {
  debug.log(`[prisma:redis:middleware]`.yellow, message);
}

const isPostGet = (params: Prisma.MiddlewareParams) =>
  params.model === "Post" &&
  ["findUnique", "findFirst"].includes(params.action);

const isPostUpdate = (params: Prisma.MiddlewareParams) =>
  params.model === "Post" && ["update"].includes(params.action);

const isPostLike = (params: Prisma.MiddlewareParams) =>
  params.model === "Like" && ["create"].includes(params.action);

export function createPostRedisCache(cache: Redis.Redis) {
  return async function prismaCacheMiddleware(
    params: Prisma.MiddlewareParams,
    next: (params: Prisma.MiddlewareParams) => Promise<any>
  ) {
    let result;

    if (isPostGet(params)) {
      // check if cache exist
      // if exist, return cache
      // if not pass request through
      // receive result
      // set cache

      const args = JSON.stringify(params.args);
      const cacheKey = `${params.model}_${args}`;
      result = JSON.parse((await cache.get(cacheKey)) as string);

      if (result === null) {
        result = await next(params);

        // Set the cache with our query
        await cache.setex(
          cacheKey,
          1000 * 60 * 60 * 24 * 30, // 30 days
          JSON.stringify(result)
        );
      }
    } else if (isPostUpdate(params)) {
      // pass request
      // receive result
      // update cache

      const args = JSON.stringify(params.args);
      const cacheKey = `${params.model}_${args}`;
      const result = await next(params);
      await cache.setex(
        cacheKey,
        1000 * 60 * 60 * 24 * 30, // 30 days
        JSON.stringify(result)
      );
    } else if (isPostLike(params.args)) {
    } else {
      result = await next(params);
    }

    return result;
  };
}
