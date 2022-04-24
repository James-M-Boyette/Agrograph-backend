// Fastify Explanation:
// Essentially, this repo contains a tiny Fastify webservice. It's similar to Express with a few different paradigms like using "plugins" and "hooks" as opposed to middleware. There's a `db` that's just a JSON file. And two additional folders -- `routes` are the RESTful routes of the service. And `services` is where we've decided to locate the 'lifting logic' of these routes for better readability and reusability. 
// Fastify has a plugin called `fastify-autoload` which automatically reads in folders / files via a regex. You can see its implementation in `index.ts`. 
// This also creates the pathing for the API, 
//    > e.g. folder structure `routes/v1/health` creates a URL pathing of `v1/health` .. so to hit the health route you must GET `/v1/health/ping`. 
// If you're familiar with Next.js or Gatsby on the frontend, it's very similar to this.

// MVP (abstract):
// You can find what we'd like you to complete in the file `dogs.routes.ts` .. Here you will find a couple TODOs explaining a couple routes that we'd like you to create. The first task is to create an API that takes in a query, and returns all dog breeds included in that requested query. The second is to create an API that inserts a new dog breed into the list with the validation requirements.

// NtH:
// You'll find in `dogs.services.ts` some basic logic that's working with the database. The service is a Fastify plugin that can be leveraged to abstract meaningful logic. It's up to you on how to architect this system, but I'd encourage you to leverage that file structure as you see fit. Often at Agrograph we have to make design decisions that allow us both flexibility and maintainability. Part of what we'll be looking for is how you choose to orient the system you create overall.


MVP:
  #1: Create a route that returns all dog breeds that include the requested query
//   Example:
//   - db: ["apple", "banana", "coconut"]
//   - query: "co"
//   - return: ["coconut"]

  #2: Create a route that inserts a new dog breed into the list
//   - Validation: "Must be at least 5 characters"
//   - Validation: "Must not already exist in the database"
//   - Note: *not* case-sensitive

Notes:
//   - `dogs.services.ts` is a fastify "plugin" / middleware; did we say this is the controller (essentially)

NtH:
//   - What does "Fastify plugin that can be leveraged to abstract meaningful logic" mean, and does it inform how we architect things
//   - Research best practices & implement (if time allows), prioritizing flexibility & maintainability


What are our questions?
//   - What is Fastify? > what is especially important to know (re:differences) to express (for this project)
//   - How do we start this version of fastify app? (no explicit instructions in Readme)
//   - Do we need to research Next.js to understand this better/as a short-cut?

Goals:
//   (Today)
//   - [DONE] Clarify MVP vs NtH
//   - Thoroughly investigate files & structure
//   - Research Fastify’s approach to routing/servers
//   - Make a dummy call to the data base
//   - Write routes
//   - Research validations further
//   (Tomorrow)
//   - Research testing further
//   - Write tests (is this necessary?)

Steps:
//   - Get server to run (use postman for testing)
//   - Verify all necessary files, modules etc are installed