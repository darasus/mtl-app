export const commentFragment = {
  id: true,
  content: true,
  createdAt: true,
  postId: true,
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
