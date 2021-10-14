import { AppProps } from "next/app";
import React from "react";
import { QueryCache, QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import { ReactQueryDevtools } from "react-query/devtools";
import {
  ChakraProvider,
  cookieStorageManager,
  localStorageManager,
} from "@chakra-ui/react";
import { theme } from "../theme";
import { Toaster, toast } from "react-hot-toast";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const colorModeManager =
    typeof pageProps.cookies === "string"
      ? cookieStorageManager(pageProps.cookies)
      : localStorageManager;
  const queryClientRef = React.useRef<QueryClient>();

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      queryCache: new QueryCache({
        onError: (error: any, query) => {
          if (query.state.data !== undefined) {
            toast.error(`Something went wrong: ${error.message}`);
          }
        },
      }),
    });
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <Hydrate state={pageProps.dehydratedState}>
        <ChakraProvider theme={theme} colorModeManager={colorModeManager}>
          <Toaster
            toastOptions={{
              style: {
                borderRadius: "100px",
                borderColor:
                  colorModeManager.get() === "dark"
                    ? "rgba(0,0,0,0.2)"
                    : "rgba(255,255,255,0.2)",
                borderWidth: "1px",
                ...(colorModeManager.get() === "dark"
                  ? { background: "white", color: "#black" }
                  : { background: "black", color: "#fff" }),
              },
            }}
          />
          <Component {...pageProps} />
        </ChakraProvider>
      </Hydrate>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default MyApp;
