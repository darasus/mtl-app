import { redis } from "./redis";
import { performance } from "perf_hooks";

const fetch = async <T>(key: string, fetcher: () => T, expires: number) => {
  const cacheT0 = performance.now();
  const existing = await get<T>(key);
  const cacheT1 = performance.now();
  console.log(
    `Call for ${key} to cache took ${cacheT1 - cacheT0} milliseconds.`
  );

  if (existing !== null) return existing;

  const response = await set(key, fetcher, expires);

  return response;
};

const get = async <T>(key: string): Promise<T | null> => {
  const value = await redis.get(key);
  if (value === null) return null;
  return JSON.parse(value);
};

const set = async <T>(key: string, fetcher: () => T, expires: number) => {
  const dbT0 = performance.now();
  const value = await fetcher();
  const dbT1 = performance.now();

  console.log(`Call for ${key} to DO DB took ${dbT1 - dbT0} milliseconds.`);

  await redis.set(key, JSON.stringify(value), "EX", expires);
  return value;
};

const del = async (key: string) => {
  await redis.del(key);
};

export default { fetch, set, get, del };
