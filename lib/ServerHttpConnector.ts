import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { IncomingMessage } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import * as AxiosLogger from "axios-logger";

interface Props {
  req?: IncomingMessage & {
    cookies: NextApiRequestCookies;
  };
}

const config = {
  dateFormat: "HH:MM:ss",
  status: true,
  headers: true,
  method: true,
  url: true,
};

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

  get(url: string) {
    return this.request("GET", { url });
  }
  post(url: string, body: Record<string, unknown>) {
    return this.request("POST", { url, data: body });
  }
  put(url: string, body: Record<string, unknown>) {
    return this.request("PUT", { url, data: body });
  }
  delete(url: string) {
    return this.request("DELETE", { url });
  }

  createRequest = (props?: { config?: AxiosRequestConfig }) => {
    const client = axios.create({
      baseURL: process.env.NEXTAUTH_URL,
      ...props?.config,
    });

    client.interceptors.request.use(
      (req) =>
        AxiosLogger.requestLogger(req, {
          ...config,
          logger: console.info.bind(this),
        }),
      (err) =>
        AxiosLogger.errorLogger(err, {
          ...config,
          logger: console.error.bind(this),
        })
    );

    client.interceptors.response.use(
      (req) =>
        AxiosLogger.responseLogger(req, {
          ...config,
          logger: console.info.bind(this),
        }),
      (err) =>
        AxiosLogger.errorLogger(err, {
          ...config,
          logger: console.error.bind(this),
        })
    );

    return client;
  };
}
