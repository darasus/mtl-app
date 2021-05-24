import { useQuery } from "react-query";
import { fetchMe } from "../request/fetchMe";
import Prisma from ".prisma/client";

export const useMeQuery = () => {
  return useQuery<Prisma.User>("me", fetchMe, { staleTime: 1000 * 60 * 5 });
};
