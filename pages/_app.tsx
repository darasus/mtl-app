import { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import { QueryCache, QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import { ReactQueryDevtools } from "react-query/devtools";
import { Provider } from "next-auth/client";
import {
  ChakraProvider,
  cookieStorageManager,
  localStorageManager,
} from "@chakra-ui/react";
import { theme } from "../theme";
import { Toaster, toast } from "react-hot-toast";
import * as Fathom from "fathom-client";
import { useRouter } from "next/router";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
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

  React.useEffect(() => {
    Fathom.load("STOSBNAU", {
      includedDomains: ["www.mytinylibrary.com"],
    });

    function onRouteChangeComplete() {
      Fathom.trackPageview();
    }
    router.events.on("routeChangeComplete", onRouteChangeComplete);

    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, maximum-scale=1"
            />
          </Head>
          <Provider session={pageProps.session}>
            <Component {...pageProps} />
          </Provider>
        </ChakraProvider>
      </Hydrate>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default MyApp;
