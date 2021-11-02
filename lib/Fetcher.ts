import { CodeLanguage } from ".prisma/client";
import { CommentService } from "./prismaServices/CommentService";
import { Post } from "../types/Post";
import { User } from "../types/User";
import qs from "query-string";
import { FeedService } from "./prismaServices/FeedService";
import { FollowService } from "./prismaServices/FollowService";
import { PostService } from "./prismaServices/PostService";
import { TagService } from "./prismaServices/TagService";
import { LikeService } from "./prismaServices/LikeService";
import { ServerHttpConnector } from "./ServerHttpConnector";
import { ClientHttpConnector } from "./ClientHttpConnector";
import { FeedType } from "../types/FeedType";
import { UserService } from "./prismaServices/UserService";
import { ActivityService } from "./prismaServices/ActivityService";

export class Fetcher {
  httpConnector: ServerHttpConnector | ClientHttpConnector;

  constructor(httpConnector: ServerHttpConnector | ClientHttpConnector) {
    this.httpConnector = httpConnector;
  }

  // user

  getMe = (): Promise<User> =>
    this.httpConnector.request(`/api/me`).then((res) => res.data);

  getUser = (id: number): Promise<User> =>
    this.httpConnector.request(`/api/user/${id}`).then((res) => res.data);

  getUserPosts = (id: number): Promise<Post[]> =>
    this.httpConnector.request(`/api/user/${id}/posts`).then((res) => res.data);

  invalidateUser = (userId: number): Promise<{ status: "success" }> =>
    this.httpConnector
      .request(`/api/user/${userId}/invalidate`, {
        method: "POST",
        data: {},
      })
      .then((res) => res.data);

  // like

  likePost = (postId: number): ReturnType<LikeService["likePost"]> =>
    this.httpConnector
      .request(`/api/post/${postId}/like`, {
        method: "POST",
      })
      .then((res) => res.data);

  unlikePost = (postId: number): ReturnType<LikeService["unlikePost"]> =>
    this.httpConnector
      .request(`/api/post/${postId}/unlike`, {
        method: "POST",
      })
      .then((res) => res.data);

  // comments

  getComments = ({
    postId,
    take,
    skip,
  }: {
    postId: number;
    take?: number;
    skip?: number;
  }): ReturnType<CommentService["getCommentsByPostId"]> =>
    this.httpConnector
      .request(`/api/post/${postId}/comments?${qs.stringify({ take, skip })}`)
      .then((res) => res.data);

  addComment = (
    postId: number,
    content: string
  ): ReturnType<CommentService["addComment"]> =>
    this.httpConnector
      .request(`/api/post/${postId}/addComment`, {
        method: "POST",
        data: {
          content,
        },
      })
      .then((res) => res.data);

  deleteComment = (
    commentId: number
  ): ReturnType<CommentService["deleteComment"]> =>
    this.httpConnector
      .request(`/api/comment/${commentId}`, {
        method: "DELETE",
      })
      .then((res) => res.data);

  // follow

  doIFollowUser = (userId: number): ReturnType<FollowService["doIFollow"]> =>
    this.httpConnector
      .request(`/api/user/${userId}/follow`)
      .then((res) => res.data);

  getFollowersCount = (
    userId: number
  ): ReturnType<FollowService["getNumberOfFollowers"]> =>
    this.httpConnector
      .request(`/api/user/${userId}/follow/count`)
      .then((res) => res.data);

  followUser = (userId: number): ReturnType<FollowService["followUser"]> =>
    this.httpConnector
      .request(`/api/user/${userId}/follow`, {
        method: "POST",
      })
      .then((res) => res.data);

  unfollowUser = (userId: number): ReturnType<FollowService["unfollowUser"]> =>
    this.httpConnector
      .request(`/api/user/${userId}/unfollow`, {
        method: "POST",
      })
      .then((res) => res.data);

  // feed

  getFeed = ({
    cursor,
    feedType,
  }: {
    cursor?: number;
    feedType: FeedType;
  }): ReturnType<FeedService["fetchLatestFeed"]> =>
    this.httpConnector
      .request(`/api/feed?${qs.stringify({ cursor, feedType })}`)
      .then((res) => res.data);

  // post

  getPost = (id: number): Promise<Post> =>
    this.httpConnector.request(`/api/post/${id}`).then((res) => res.data);

  getScreenshot = ({
    url,
    width,
    height,
  }: {
    url: string;
    width?: number;
    height?: number;
  }): Promise<Blob> => {
    return this.httpConnector
      .request(`/api/screenshot?${qs.stringify({ url, width, height })}`, {
        responseType: "blob",
      })
      .then((res) => res.data);
  };

  createPost = (data: {
    title: string;
    description: string;
    content: string;
    codeLanguage: CodeLanguage;
    tagId: number;
  }): ReturnType<PostService["createPost"]> =>
    this.httpConnector
      .request(`/api/post/create`, {
        method: "POST",
        data,
      })
      .then((res) => res.data);

  deletePost = (postId: number): ReturnType<PostService["deletePost"]> =>
    this.httpConnector
      .request(`/api/post/${postId}/delete`, {
        method: "DELETE",
      })
      .then((res) => res.data);

  updatePost = (
    postId: number,
    data: {
      title: string;
      description: string;
      content: string;
      codeLanguage: CodeLanguage;
      tagId: number;
    }
  ): ReturnType<PostService["updatePost"]> =>
    this.httpConnector
      .request(`/api/post/${postId}/update`, {
        method: "PUT",
        data,
      })
      .then((res) => res.data);

  publishPost = (postId: number): ReturnType<PostService["publishPost"]> =>
    this.httpConnector
      .request(`/api/post/${postId}/publish`, {
        method: "PUT",
      })
      .then((res) => res.data);

  unpublishPost = (postId: number): ReturnType<PostService["unpublishPost"]> =>
    this.httpConnector
      .request(`/api/post/${postId}/unpublish`, {
        method: "PUT",
      })
      .then((res) => res.data);

  // tags

  getAllTags = (): ReturnType<TagService["getAllTags"]> => {
    return this.httpConnector.request(`/api/tags`).then((res) => res.data);
  };

  // activity

  getUserActivity = ({
    userId,
    cursor,
  }: {
    userId: number;
    cursor: number;
  }): ReturnType<UserService["getUserActivity"]> => {
    return this.httpConnector
      .request(`/api/user/${userId}/activity?${qs.stringify({ cursor })}`)
      .then((res) => res.data);
  };

  markActivityAsRead = (
    activityId: number
  ): ReturnType<ActivityService["markActivityAsRead"]> => {
    return this.httpConnector
      .request(`/api/activity/${activityId}/markAsRead`, { method: "POST" })
      .then((res) => res.data);
  };

  markAllActivityAsRead = (): ReturnType<
    ActivityService["markAllActivityAsRead"]
  > => {
    return this.httpConnector
      .request(`/api/activity/markAllAsRead`, { method: "POST" })
      .then((res) => res.data);
  };
}
