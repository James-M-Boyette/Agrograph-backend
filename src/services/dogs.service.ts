import { FastifyInstance } from "fastify";
import _dogs from "../db/dogs.json";

// Small type-cast to make the json friendlier to work with
type DogDB = {
  [breed: string]: string[];
};
const AllDogs = _dogs as DogDB;

declare module "fastify" {
  interface FastifyInstance {
    db: {
      findAll: () => Promise<DogDB>;
    };
  }
}

export default async function DogsService(fastify: FastifyInstance) {
  async function findAll() {
    return AllDogs;
  }
  fastify.decorate("db", { dogs: { findAll } });
}
