# hiring-backend
Backend Fastify programming exercise 


The exercise is located here. As of now, we don't have a thorough README that explains each step so I'll do my best to elucidate the task in this email. Please feel free to reach out with any questions if you'd like anything to be clarified.

Essentially, this repo contains a tiny Fastify webservice. It's similar to Express with a few different paradigms like using "plugins" and "hooks" as opposed to middleware. There's a `db` that's just a JSON file. And two additional folders -- `routes` are the RESTful routes of the service. And `services` is where we've decided to locate the 'lifting logic' of these routes for better readability and reusability. Fastify has a plugin called `fastify-autoload` which automatically reads in folders / files via a regex. You can see its implementation in `index.ts`. This also creates the pathing for the API, e.g. folder structure `routes/v1/health` creates a URL pathing of `v1/health` .. so to hit the health route you must GET `/v1/health/ping`. If you're familiar with Next.js or Gatsby on the frontend, it's very similar to this.

You can find what we'd like you to complete in the file `dogs.routes.ts` .. Here you will find a couple TODOs explaining a couple routes that we'd like you to create. The first task is to create an API that takes in a query, and returns all dog breeds included in that requested query. The second is to create an API that inserts a new dog breed into the list with the validation requirements.

You'll find in `dogs.services.ts` some basic logic that's working with the database. The service is a Fastify plugin that can be leveraged to abstract meaningful logic. It's up to you on how to architect this system, but I'd encourage you to leverage that file structure as you see fit. Often at Agrograph we have to make design decisions that allow us both flexibility and maintainability. Part of what we'll be looking for is how you choose to orient the system you create overall.

If possible, I'd commit your work to a repo (it can be private if you'd like). It'd be nice to see the steps you're taking as you unravel the challenge. There's no official time limit, but as I said (ad nauseum) the sooner you complete, the sooner we can move to the next steps. We can then get together and discuss your work and the process.

Again, let me know if you have any questions. Looking forward to seeing what you come up with!