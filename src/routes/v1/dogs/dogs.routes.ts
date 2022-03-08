import { FastifyInstance } from "fastify";

export default async function v1(fastify: FastifyInstance) {
  /**
   * Fetches all dogs
   */
  fastify.get("/", async (_req, reply) => {
    const dogs = await fastify.db.findAll();
    reply.send(dogs);
  });

  // TODO: Create a route that returns all dog breeds that include the requested query
  // Example:
  // db: ["apple", "banana", "coconut"]
  // query: "co"
  // return: ["coconut"]

  // TODO: Create a route that inserts a new dog breed into the list
  // Validation: "Must be at least 5 characters"
  // Validation: "Must not already exist in the database"
  // - not case-sensitive
}
