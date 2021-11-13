import axios, { AxiosInstance } from "axios";
import { baseUrl } from "../constants/baseUrl";

export class ClientHttpConnector {
  request: AxiosInstance;

  constructor() {
    this.request = this.createRequest();
  }

  get(url: string) {
    return this.request(url, { method: "GET" });
  }
  post(url: string, body: Record<string, unknown>) {
    return this.request(url, { method: "POST", data: body });
  }
  put(url: string, body: Record<string, unknown>) {
    return this.request(url, { method: "PUT", data: body });
  }
  delete(url: string) {
    return this.request(url, { method: "DELETE" });
  }

  createRequest = () => {
    const client = axios.create({
      baseURL: `${baseUrl}`,
      headers: {
        Pragma: "no-cache",
      },
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
