import { useMutation } from "react-query";
import { ClientHttpConnector } from "../../lib/ClientHttpConnector";

interface Variables {
  file: FormData;
}

export const useUploadImageMutation = () => {
  const clientHttpConnector = new ClientHttpConnector();
  return useMutation(async ({ file }: Variables) => {
    const reponse = await clientHttpConnector.request({
      method: "POST",
      baseURL:
        "https://api.cloudflare.com/client/v4/accounts/520ed574991657981b4927dda46f2477",
      url: "images/v1/direct_upload",
      headers: {
        Authorization: "Bearer AeR9IKQEX-aqmV_NRTB2CVXaGrQ_mATDoLfW0e11",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000/",
        "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
        "Access-Control-Max-Age": "86400",
      },
    });
    console.log(reponse);
    // cloudflareHttpConnector.post("/images/v1/direct_upload", file)
  });
};
