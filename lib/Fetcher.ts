import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { CodeLanguage } from ".prisma/client";
import { CommentService } from "./api/CommentService";
import { Post } from "../types/Post";
import { User } from "../types/User";
import qs from "query-string";
import { FeedService } from "./api/FeedService";
import { FollowService } from "./api/FollowService";
import { PostService } from "./api/PostService";
import { TagService } from "./api/TagService";
import { LikeService } from "./api/LikeService";
import { NextApiRequest } from "next";
import { IncomingMessage } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";

export class Fetcher {
  request: AxiosInstance;

  constructor(
    req?: IncomingMessage & {
      cookies: NextApiRequestCookies;
    }
  ) {
    this.request = this.createRequest({
      config: {
        headers: {
          cookie: req?.headers?.cookie,
        },
      },
    });
  }

  createRequest = (props?: { config?: AxiosRequestConfig }) => {
    const client = axios.create({
      baseURL: process.env.NEXTAUTH_URL,
      ...props?.config,
    });

    client.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        if (error?.response?.status === 401) {
          window.location.href = "/api/auth/signin";
        }
        return Promise.reject(error);
      }
    );

    return client;
  };

  // user

  getMe = (): Promise<User> => this.request(`/api/me`).then((res) => res.data);

  getUser = (id: number): Promise<User> =>
    this.request(`/api/user/${id}`).then((res) => res.data);

  getUserPosts = (id: number): Promise<Post[]> =>
    this.request(`/api/user/${id}/posts`).then((res) => res.data);

  invalidateUser = (userId: number): Promise<{ status: "success" }> =>
    this.request(`/api/user/${userId}/invalidate`, {
      method: "POST",
      data: {},
    }).then((res) => res.data);

  // like

  likePost = (postId: number): ReturnType<LikeService["likePost"]> =>
    this.request(`/api/post/${postId}/like`, {
      method: "POST",
    }).then((res) => res.data);

  unlikePost = (postId: number): ReturnType<LikeService["unlikePost"]> =>
    this.request(`/api/post/${postId}/unlike`, {
      method: "POST",
    }).then((res) => res.data);

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
    this.request(
      `/api/post/${postId}/comments?${qs.stringify({ take, skip })}`
    ).then((res) => res.data);

  addComment = (
    postId: number,
    content: string
  ): ReturnType<CommentService["addComment"]> =>
    this.request(`/api/post/${postId}/addComment`, {
      method: "POST",
      data: {
        content,
      },
    }).then((res) => res.data);

  deleteComment = (
    commentId: number
  ): ReturnType<CommentService["deleteComment"]> =>
    this.request(`/api/comment/${commentId}`, {
      method: "DELETE",
    }).then((res) => res.data);

  // follow

  doIFollowUser = (userId: number): ReturnType<FollowService["doIFollow"]> =>
    this.request(`/api/user/${userId}/follow`).then((res) => res.data);

  getFollowersCount = (
    userId: number
  ): ReturnType<FollowService["getNumberOfFollowers"]> =>
    this.request(`/api/user/${userId}/follow/count`).then((res) => res.data);

  followUser = (userId: number): ReturnType<FollowService["followUser"]> =>
    this.request(`/api/user/${userId}/follow`, {
      method: "POST",
    }).then((res) => res.data);

  unfollowUser = (userId: number): ReturnType<FollowService["unfollowUser"]> =>
    this.request(`/api/user/${userId}/unfollow`, {
      method: "POST",
    }).then((res) => res.data);

  // feed

  getFeed = ({
    cursor,
  }: {
    cursor?: number;
  }): ReturnType<FeedService["fetchFeed"]> =>
    this.request(`/api/feed?${qs.stringify({ cursor })}`).then(
      (res) => res.data
    );

  // post

  getPost = (id: number): Promise<Post> =>
    this.request(`/api/post/${id}`).then((res) => res.data);

  getScreenshot = ({
    url,
    width,
    height,
  }: {
    url: string;
    width?: number;
    height?: number;
  }): Promise<Blob> => {
    return this.request(
      `/api/screenshot?${qs.stringify({ url, width, height })}`,
      {
        responseType: "blob",
      }
    ).then((res) => res.data);
  };

  createPost = (data: {
    title: string;
    description: string;
    content: string;
    codeLanguage: CodeLanguage;
    tagId: number;
  }): ReturnType<PostService["createPost"]> =>
    this.request(`/api/post/create`, {
      method: "POST",
      data,
    }).then((res) => res.data);

  deletePost = (postId: number): ReturnType<PostService["deletePost"]> =>
    this.request(`/api/post/${postId}/delete`, {
      method: "DELETE",
    }).then((res) => res.data);

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
    this.request(`/api/post/${postId}/update`, {
      method: "PUT",
      data,
    }).then((res) => res.data);

  publishPost = (postId: number): ReturnType<PostService["publishPost"]> =>
    this.request(`/api/post/${postId}/publish`, {
      method: "PUT",
    }).then((res) => res.data);

  unpublishPost = (postId: number): ReturnType<PostService["unpublishPost"]> =>
    this.request(`/api/post/${postId}/unpublish`, {
      method: "PUT",
    }).then((res) => res.data);

  // tags

  getAllTags = (): ReturnType<TagService["getAllTags"]> =>
    this.request(`/api/tags`).then((res) => res.data);
}
