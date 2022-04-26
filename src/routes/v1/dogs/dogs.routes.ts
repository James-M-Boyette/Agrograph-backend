import { FastifyInstance } from "fastify";
const url = require('url');

export default async function v1(fastify: FastifyInstance) {
    // Fetches ALL dogs
    fastify.get("/", async (_req, reply) => {
      const dogs = await fastify.db.dogs.findAll();
      reply.send(dogs);
    });

    // TODO: Create a route that returns all dog breeds that include the requested query
    // Example:
    // db: ["apple", "banana", "coconut"]
    // query: "co"
    // return: ["coconut"]

    // Fetches MATCHING dogs
    fastify.get("/search", async (_req, reply) => {
      // Log params and QUERY
      // console.log(`Here's the _req:`)
      // console.log(_req)
      console.log(`Here's the _req.query value:`)
      console.log(_req.query)
  
      console.log(`Here's the query string:`)
      const queryObject = url.parse(_req.url, true).query;
      const searchParam: string = queryObject['breed'];
  
      const matches = await fastify.db.dogs.findMatches(searchParam);
      // We're passing in the following object: { breed: 'golden' }
      console.log(`Here are the returned matches (if any):`)
      console.log(matches)
      console.log(typeof matches)
  
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
  
    fastify.post("/", options, async (req, reply) => {
      console.log(`Here's the BODY value:`);
      console.log(req.body);
      console.log(typeof req.body);
  
      const hardCode:any = {breed:'direwolf',
        subBreeds:['wolf1', 'wolf2']}

      const paramBody:object = req.body as object;
  
      // const result = await fastify.db.dogs.addBreed(breed, subBreeds);
      // const result = await fastify.db.dogs.addBreed(req.body);
      const result = await fastify.db.dogs.addBreed(paramBody);
      // const result = await fastify.db.dogs.addBreed(hardCode);
      reply.send(result)
  
    });

  // TODO: Create a route that inserts a new dog breed into the list
  // Validation: "Must be at least 5 characters"
  // Validation: "Must not already exist in the database"
  // - not case-sensitive
}
