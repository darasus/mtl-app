export const parseAppSessionFromCookies = (
  cookies: string | null | undefined
) => {
  if (!cookies) return null;

  return cookies
    .split(";")
    .map((x) => x.trim())
    .map((x) => x.split("="))
    .find(([x]) => x.includes("appSession"))?.[1];
};
