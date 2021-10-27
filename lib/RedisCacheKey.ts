export class RedisCacheKey {
  createUserSessionKey(email: string): string {
    return `user:${email}:session`;
  }
}
