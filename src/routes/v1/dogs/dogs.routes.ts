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
    console.log(`Here's the _req:`)
    // console.log(_req)
    console.log(`Here's the _req.query value:`)
    console.log(_req.query)

    console.log(`Here's the query string:`)
    const queryObject = url.parse(_req.url, true).query;
    const searchParam: string = queryObject['breed'];

    const matches = await fastify.db.dogs.findMatches(searchParam);
    // We're passing in the following object: { breed: 'golden' }

    reply.send({ matching_breeds : matches })

    // Return breeds that include query

  });

  // TODO: Create a route that inserts a new dog breed into the list
  // Note: POST will need to convert params from a string to an array of string(s)

  // fastify.post("/search", postOptions async (_req, reply) => {
  //   const submission = _req.body;
  //   // { breed: 'golden' }

  //   // const newBreed = 
  //   // dogs.push(submission)

  //   reply.code(200);
  //   return submission
  // });

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
