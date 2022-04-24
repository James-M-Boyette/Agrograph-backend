import path from "path";
import Fastify, { FastifyInstance } from "fastify";
import autoload from "fastify-autoload";

const server: FastifyInstance = Fastify({
  logger: true,
});

const port = 3000;

const start = async () => {
  try {
    // Register services
    server.register(autoload, {
      dir: path.join(__dirname, "services"),
      indexPattern: /.*service(\.ts|\.js|\.cjs|\.mjs)$/,
    });

    // Register routes
    server.register(autoload, {
      dir: path.join(__dirname, "routes"),
      indexPattern: /.*routes(\.ts|\.js|\.cjs|\.mjs)$/,
    });

    await server.listen(port);
    server.log.info(`Server started on port ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
