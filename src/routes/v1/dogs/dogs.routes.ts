import { FastifyInstance } from "fastify";
const url = require('url');

export default async function v1(fastify: FastifyInstance) {
  /**
   * Fetches all dogs
   */
  fastify.get("/", async (_req, reply) => {
    const dogs = await fastify.db.dogs.findAll();
    reply.send(dogs);
  });

  // TODO: Create a route that returns all dog breeds that include the requested query
  // Example:
  // db: ["apple", "banana", "coconut"]
  // query: "co"
  // return: ["coconut"]

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

    // if(matches === "sorry"){
    //   reply.send(`Sorry - no breeds matched your input`)
    // } else {
      reply.send({ matching_breeds : matches })
    // }
    // Return breeds that include query

  });

  // TODO: Create a route that inserts a new dog breed into the list
  // Note: POST will need to convert params from a string to an array of string(s)
  // Question: Does this mean Client data will be passed in the following way ... "direwolf, northern, vale, rivers, rock, storm lands, reach, dorne" (and the first element will be used as the key, while all others are considered sub-breeds/values?

  fastify.post("/post", async (_req, reply) => {
    // Log params and QUERY
    console.log(`Here's the _req:`);
    console.log(_req);
    console.log(`Here's the _req.query value:`);
    console.log(_req.query);
    
    console.log(`Here's the queryObject:`)
    const queryObject = url.parse(_req.url, true).query;
    console.log(queryObject)
    const searchParam: string = queryObject['userData'];
    console.log(`Here's the searchParam:`)
    console.log(searchParam)

    const result = await fastify.db.dogs.addBreed(searchParam);
    reply.send(result)

  });

  // Validation: "Must be at least 5 characters"
  // Validation: "Must not already exist in the database"
  // - not case-sensitive
}

// ADDITIONAL NOTES:
    // FINAL CLEAN-UP
    // const {id} = _req.params // possibly useful later when trimming '/search' back to vanilla '/'

    // ROUTE-FILE SEARCH
    // fastify.get("/search", async (_req, reply) => {
    //   try {
    //     const breed = dogs.find(p => p.id === +request.params.id) // the '+' "casts" / turns the string into a number

    //     if(!breed){
    //       reply.code(500)
    //       return breed
    //     }

    //     return breed
    //   } catch (error) {
    //     throw new Error('Soemthing went wrong')
    //   }
    // })
