import { authorFragment } from "./authorFragment";

export const activityFragment = {
  author: {
    select: authorFragment,
  },
  post: {
    select: {
      id: true,
      title: true,
    },
  },
};
