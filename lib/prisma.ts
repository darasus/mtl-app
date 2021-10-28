import { PrismaClient } from "@prisma/client";
import { createPrismaRedisCache } from "./createPrismaRedisCache";
import { redis } from "./redis";
import "colors";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(global as any).prisma) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).prisma = new PrismaClient({
      // log: ["query", "info", "warn", "error"],
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma = (global as any).prisma;
}

prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();

  console.log(
    "[prisma:query]".green,
    `${params.model}.${params.action} took ${after - before}ms`
  );

  return result;
});

prisma.$use(
  createPrismaRedisCache(
    {
      model: "User",
      cacheTime: 1000 * 60 * 60 * 24 * 30, // 30 days
    },
    redis
  )
);

prisma.$use(
  createPrismaRedisCache(
    {
      model: "Tag",
      cacheTime: 1000 * 60 * 60 * 24 * 30, // 30 days
    },
    redis
  )
);

prisma.$use(
  createPrismaRedisCache(
    {
      model: "Post",
      cacheTime: 1000 * 60 * 60 * 24 * 30, // 30 days
    },
    redis
  )
);

export default prisma;
