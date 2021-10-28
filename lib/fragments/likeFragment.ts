export const likeFragment = {
  id: true,
  postId: true,
  createdAt: true,
  updatedAt: true,
  authorId: true,
  author: {
    select: {
      id: true,
      name: true,
      userName: true,
      image: true,
      emailVerified: true,
      createdAt: true,
      email: true,
      updatedAt: true,
    },
  },
};
