export class ClientCacheKey {
  commentsBaseKey = ["comments"];
  doIFollowBaseKey = ["doIFollowUser"];

  createPostCommentsKey(postId: number) {
    return [...this.commentsBaseKey, { postId }];
  }

  createDoIFollowUserKey(userId: number) {
    return [...this.doIFollowBaseKey, { userId }];
  }
}

export const clientCacheKey = new ClientCacheKey();
