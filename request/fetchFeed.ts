import axios from "axios";
import Prisma from ".prisma/client";

export const fetchFeed = (): Promise<
  (Prisma.Post & { author: Prisma.User })[]
> => axios(`${process.env.BASE_URL}/api/feed`).then((res) => res.data);
