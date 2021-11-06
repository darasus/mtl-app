import { authorFragment } from "./authorFragment";

export const likeFragment = {
  id: true,
  postId: true,
  createdAt: true,
  updatedAt: true,
  authorId: true,
  author: {
    select: authorFragment,
  },
};
