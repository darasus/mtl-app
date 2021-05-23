import { User } from ".prisma/client";
import axios from "axios";
import { useSession } from "next-auth/client";
import { useQuery } from "react-query";
import { fetchMe } from "../request/fetchMe";
import Prisma from ".prisma/client";

export const useMeQuery = () => {
  return useQuery<Prisma.User>("me", fetchMe);
};
