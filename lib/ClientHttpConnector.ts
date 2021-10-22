import axios, { AxiosInstance } from "axios";
import { IncomingMessage } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";

interface Props {
  req?: IncomingMessage & {
    cookies: NextApiRequestCookies;
  };
}

export class ClientHttpConnector {
  request: AxiosInstance;

  constructor() {
    this.request = this.createRequest();
  }

  get(url: string) {
    return this.request("GET", { url });
  }
  post(url: string, body: Record<string, any>) {
    return this.request("POST", { url, data: body });
  }
  put(url: string, body: Record<string, any>) {
    return this.request("PUT", { url, data: body });
  }
  delete(url: string) {
    return this.request("DELETE", { url });
  }

  createRequest = () => {
    const client = axios.create({
      baseURL: process.env.NEXTAUTH_URL,
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
