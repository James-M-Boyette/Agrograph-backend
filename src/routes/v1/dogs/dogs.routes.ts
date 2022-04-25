import { FastifyInstance } from "fastify";

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

  // fastify.get("/target", async (_req, reply) => {
  fastify.get("/target", async (_req, reply) => {
    // Log params
    console.log(_req.query);
    
    // FINAL CLEAN-UP
    // const {id} = _req.params // possibly useful later when trimming '/target' back to vanilla '/'

    // Store & send back params
    // const userSearch = _req.query;
    // reply.send(userSearch)

    // ROUTE-FILE SEARCH
    // fastify.get("/target", async (_req, reply) => {
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

    // Return 'bulldog'
    // const matches = 'bulldog';
    const matches = await fastify.db.dogs.findMatches();
    // We're passing in the following object: { breed: 'golden' }




    reply.send({ matching_breeds : matches }) // "matching_breeds" is my bespoke key to be sent in the response

    // Return breeds that include query

  });

  // TODO: Create a route that inserts a new dog breed into the list
  // Note: POST will need to convert params from a string to an array of string(s)

  // fastify.post("/target", postOptions async (_req, reply) => {
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
