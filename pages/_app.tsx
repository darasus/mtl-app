import { Provider as AuthProvider } from "next-auth/client";
import {
  SSRProvider,
  Provider as SpectrumProvider,
  defaultTheme,
} from "@adobe/react-spectrum";
import { AppProps } from "next/app";
// import "../styles/globals.css";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import { ReactQueryDevtools } from "react-query/devtools";

const App = ({ Component, pageProps }: AppProps) => {
  const queryClientRef = React.useRef(null);
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  return (
    <SSRProvider>
      <SpectrumProvider theme={defaultTheme} minHeight="100%">
        <AuthProvider session={pageProps.session}>
          <QueryClientProvider client={queryClientRef.current}>
            <Hydrate state={pageProps.dehydratedState}>
              <Component {...pageProps} />
            </Hydrate>
            <ReactQueryDevtools />
          </QueryClientProvider>
        </AuthProvider>
      </SpectrumProvider>
    </SSRProvider>
  );
};

export default App;
