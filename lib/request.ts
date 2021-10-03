import axios from "axios";

const createRequest = () => {
  const client = axios.create();

  client.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response.status === 401) {
        window.location.href = "/api/auth/signin";
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const request = createRequest();
