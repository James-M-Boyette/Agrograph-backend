import { FastifyInstance } from "fastify";
const url = require('url');

export default async function v1(fastify: FastifyInstance) {
    // Fetch ALL dogs
    fastify.get("/", async (_req, reply) => {
      const dogs = await fastify.db.dogs.findAll();
      reply.send(dogs);
    });

    // Fetch MATCHING dog(s)
    fastify.get("/search", async (_req, reply) => {
      const queryObject = url.parse(_req.url, true).query;
      const searchParam: string = queryObject['breed'];
  
      const matches = await fastify.db.dogs.findMatches(searchParam);
      reply.send({ matching_breeds : matches })
    });

    const CREATE_DOGS_SCHEMA = {
      schema: {
        body: {
          type: 'object', 
          properties: {
            breed: {
              type: 'string',
            },
            subBreeds: {
              type: 'array',
              default: []
            },
          }
        }
      }
    }
  
    // Add NEW dog
    fastify.post("/", CREATE_DOGS_SCHEMA, async (req, reply) => {
      const paramBody:object = req.body as object;

      reply.send(await fastify.db.dogs.addBreed(paramBody))
    });

  
  
}
