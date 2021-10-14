import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    return { ...initialProps };
  }

  render() {
    const config = JSON.stringify({
      applicationId: "2cc395d9-aead-4bfd-95d7-29a54f536d42",
      clientToken: "pub3033d36d5b288f88e5708e459e43ed52",
      site: "datadoghq.eu",
      service: "my-little-library",
      env: process.env.ENVIRONMENT,
      resourceSampleRate: 100,
      // Specify a version number to identify the deployed version of your application in Datadog
      version: process.env.VERCEL_GIT_COMMIT_SHA,
      sampleRate: 100,
      trackInteractions: true,
      allowedTracingOrigins: [process.env.NEXTAUTH_URL],
    });

    return (
      <Html lang="en">
        <Head>
          <link rel="icon" type="image/png" href="/favicon.png" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Bree+Serif&display=swap"
            rel="stylesheet"
          />
          {process.env.VERCEL_ENV === "production" && (
            <>
              {/* eslint-disable-next-line @next/next/no-sync-scripts */}
              <script
                src="https://www.datadoghq-browser-agent.com/datadog-rum-v3.js"
                type="text/javascript"
              ></script>
              <script
                dangerouslySetInnerHTML={{
                  __html: `window.DD_RUM && window.DD_RUM.init(${config});`,
                }}
              ></script>
            </>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
