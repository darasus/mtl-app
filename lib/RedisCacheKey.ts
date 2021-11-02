export class RedisCacheKey {
  createUserSessionKey(email: string): string {
    return `user:${email}:session`;
  }

  createUserByEmailKey(email: string): string {
    return `user:${email}`;
  }

  createUserKey(userId: number): string {
    return `user:${userId}`;
  }

  createPostKey(postId: number): string {
    return `post:${postId}`;
  }

  createUserFollowerCountKey(userId: number): string {
    return `user:${userId}:follower_count`;
  }

  createDoIFollowKey({
    followingUserId,
    followerUserId,
  }: {
    followingUserId: number;
    followerUserId: number;
  }): string {
    return `follow:${followingUserId}:${followerUserId}`;
  }

  createTagsKey(): string {
    return `tags`;
  }

  createScreenshotKey(url: string): string {
    return `screenshot:${url}`;
  }
}

export const redisCacheKey = new RedisCacheKey();
