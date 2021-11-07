import axios, { AxiosInstance } from "axios";
import { supabase } from "./supabase";
import * as R from "ramda";

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
    const session = supabase.auth.session();
    const client = axios.create({
      baseURL: process.env.NEXTAUTH_URL,
      headers: R.reject(R.isNil, {
        "Content-Type": "application/json",
        token: session?.access_token,
      }),
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
