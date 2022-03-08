import { FastifyInstance } from "fastify";

export default async function v1(fastify: FastifyInstance) {
  fastify.get("/ping", async (_req, reply) => {
    reply.send("pong");
  });
}
