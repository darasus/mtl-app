import { NextApiRequest } from "next";

interface JWTUser {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

type Response = JWTUser | null;

export const getUserSession = (req: NextApiRequest): Response => {
  const response = parseJWT(req?.headers?.token as string) as {
    exp: number;
    sub: string;
    email: string;
    phone: string;
    user_metadata: { first_name: string; last_name: string };
  };

  if (
    typeof response?.sub === "string" &&
    typeof response?.user_metadata?.first_name === "string" &&
    typeof response?.user_metadata?.last_name === "string" &&
    typeof response?.phone === "string" &&
    typeof response?.email === "string"
  ) {
    return {
      id: response?.sub,
      firstName: response?.user_metadata?.first_name,
      lastName: response?.user_metadata?.last_name,
      phone: response?.phone,
      email: response?.email,
    };
  }

  return null;
};

function parseJWT(token: string | null | undefined) {
  if (!token) return null;
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
