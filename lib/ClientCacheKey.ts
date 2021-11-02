import { FeedType } from "../types/FeedType";

export class ClientCacheKey {
  userBaseKey = ["user"];
  commentsBaseKey = ["comments"];
  doIFollowBaseKey = ["do_i_follow_user"];
  feedBaseKey = ["feed"];
  followersCountBaseKey = ["followers_count"];
  postBaseKey = ["post"];
  screenshotBaseKey = ["post"];
  tagsBaseKey = ["tags"];
  userActivityBaseKey = ["user_activity"];
  userPostsBaseKey = ["user-posts"];

  createUserKey(userId: number) {
    return [...this.userBaseKey, { userId }];
  }

  createPostCommentsKey(postId: number) {
    return [...this.commentsBaseKey, { postId }];
  }

  createDoIFollowUserKey(userId: number) {
    return [...this.doIFollowBaseKey, { userId }];
  }

  createFeedKey(feedType: FeedType) {
    return [...this.feedBaseKey, { feedType }];
  }

  createFollowersCountKey(userId: number) {
    return [...this.followersCountBaseKey, { userId }];
  }

  createPostKey(postId: number) {
    return [...this.postBaseKey, { postId }];
  }

  createScreenshotKey(url: string) {
    return [...this.screenshotBaseKey, { url }];
  }

  createUserActivityKey(userId: number) {
    return [...this.userActivityBaseKey, { userId }];
  }

  createUserPostsKey(userId: number) {
    return [...this.userPostsBaseKey, { userId }];
  }
}

export const clientCacheKey = new ClientCacheKey();
