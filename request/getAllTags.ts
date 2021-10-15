import Prisma from ".prisma/client";
import { request } from "../lib/request";

export const getAllTags = (): Promise<Prisma.Tag[]> =>
  request(`/api/tags`).then((res) => res.data);
