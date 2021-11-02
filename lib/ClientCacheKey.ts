export class ClientCacheKey {
  commentsBaseKey = ["comments"];

  createPostCommentsKey(postId: number) {
    return [...this.commentsBaseKey, { postId }];
  }
}

export const clientCacheKey = new ClientCacheKey();
