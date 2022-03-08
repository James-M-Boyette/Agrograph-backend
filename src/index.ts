import path from "path";
import Fastify, { FastifyInstance } from "fastify";
import autoload from "fastify-autoload";

const server: FastifyInstance = Fastify({
  logger: true,
});

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

    await server.listen(3000);
    server.log.info(`Server started on port 3000`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
