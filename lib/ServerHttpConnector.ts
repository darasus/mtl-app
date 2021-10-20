import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { IncomingMessage } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";

interface Props {
  req?: IncomingMessage & {
    cookies: NextApiRequestCookies;
  };
}

export class ServerHttpConnector {
  request: AxiosInstance;

  constructor(props: Props) {
    const cookie = props.req?.headers?.cookie;

    this.request = this.createRequest({
      config: {
        headers: cookie ? { cookie } : {},
      },
    });
  }

  get(url: string, headers: Headers) {
    return this.request("GET", { url, headers });
  }
  post(url: string, headers: Headers, body: Record<string, any>) {
    return this.request("POST", { url, headers, data: body });
  }
  put(url: string, headers: Headers, body: Record<string, any>) {
    return this.request("PUT", { url, headers, data: body });
  }
  delete(url: string, headers: Headers) {
    return this.request("DELETE", { url, headers });
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
}
