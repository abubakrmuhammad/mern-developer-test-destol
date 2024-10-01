import app from "@/app";
import parsedEnv from "@/env";
import consola from "consola";

const port = parsedEnv.PORT;

const initServer = async () => {
  consola.info(`🏁 Starting Server (${parsedEnv.NODE_ENV})`);

  app.listen(port, () => {
    consola.success(`🚀 Server ready at port ${port}`);
  });
};

initServer();
