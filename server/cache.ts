import { redis } from "./redis";
import { performance } from "perf_hooks";

const fetch = async <T>(key: string, fetcher: () => T, expires: number) => {
  const existing = await get<T>(key);

  if (existing !== null) return existing;

  return set(key, fetcher, expires);
};

const get = async <T>(key: string): Promise<T | null> => {
  const cacheT0 = performance.now();
  const value = await redis.get(key);
  const cacheT1 = performance.now();
  console.log(
    `Fetch hit for ${key} to cache took ${cacheT1 - cacheT0} milliseconds.`
  );
  if (value === null) return null;
  return JSON.parse(value);
};

const set = async <T>(key: string, fetcher: () => T, expires: number) => {
  const dbT0 = performance.now();
  const value = await fetcher();
  const dbT1 = performance.now();

  console.log(`Set hit for ${key} to DO DB took ${dbT1 - dbT0} milliseconds.`);

  await redis.set(key, JSON.stringify(value), "EX", expires);
  return value;
};

const del = async (key: string) => {
  const cacheT0 = performance.now();
  await redis.del(key);
  const cacheT1 = performance.now();
  console.log(
    `Delete hit for ${key} to cache took ${cacheT1 - cacheT0} milliseconds.`
  );
};

export default { fetch, set, get, del };
