import { FastifyInstance } from "fastify";
const url = require('url');

export default async function v1(fastify: FastifyInstance) {
    // Fetches ALL dogs
    fastify.get("/", async (_req, reply) => {
      const dogs = await fastify.db.dogs.findAll();
      reply.send(dogs);
    });

    // Fetches MATCHING dogs
    fastify.get("/search", async (_req, reply) => {
      console.log(`Here's the QUERY value (received by the GET /search route):`)
      console.log(_req.query)
  
      const queryObject = url.parse(_req.url, true).query;
      const searchParam: string = queryObject['breed'];
  
      const matches = await fastify.db.dogs.findMatches(searchParam);
  
      reply.send({ matching_breeds : matches })
    });

    const options = {
      schema:{
        body:{
          type:'object', 
          properties:{
            breed: {
              type: 'string',
            },
            subBreeds: {
              type: 'array',
              default: []
            },
            }}}}
  
    // Adds NEW dog to database
    fastify.post("/", options, async (req, reply) => {
      console.log(`Here's the BODY value (received by the POST route):`);
      console.log(req.body);
  
      const hardCode:any = {breed:'direwolf',
        subBreeds:['wolf1', 'wolf2']}

      const paramBody:object = req.body as object;

      const result = await fastify.db.dogs.addBreed(paramBody);
      reply.send(result)
  
    });

  
  // Validation: "Must be at least 5 characters"
  // Validation: "Must not already exist in the database"
  // - not case-sensitive
}
