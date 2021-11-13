export const baseUrl =
  process.env.VERCEL_ENV === "production"
    ? "https://www.mytinylibrary.com"
    : process.env.VERCEL_URL === "localhost:3000"
    ? `http://${process.env.VERCEL_URL}`
    : `https://${process.env.VERCEL_URL}`;
