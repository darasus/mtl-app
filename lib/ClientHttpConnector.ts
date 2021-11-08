import axios, { AxiosInstance } from "axios";

export class ClientHttpConnector {
  request: AxiosInstance;

  constructor() {
    this.request = this.createRequest();
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

  createRequest = () => {
    const client = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}`,
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
