import { AppPropsType, AppContextType } from "next/dist/next-server/lib/utils";
import { ServerResponse } from "http";

const App = ({ Component, pageProps }: AppPropsType): JSX.Element => {
  return <Component {...pageProps} />;
};

App.getInitialProps = async ({ ctx }: AppContextType): Promise<{}> => {
  const auth = (res: ServerResponse): void => {
    res.writeHead(401, {
      "www-authenticate": "Basic realm=secret",
    });
    res.end();
  };

  if (!process.browser) {
    const authorization = ctx.req.headers["authorization"];
    if (typeof authorization === "undefined") auth(ctx.res);

    const authData = authorization.match(/[^\s]+$/);
    if (authData === null) auth(ctx.res);

    const req = Buffer.from(authData[0], "base64").toString();

    if (req !== "root:root") auth(ctx.res);
  }
  return {};
};

export default App;
