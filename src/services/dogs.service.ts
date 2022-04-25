import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import _dogs from "../db/dogs.json";

// Notes on typescript:
// 1. The below [l24-26] is *setting* a bespoke type (instead of vanilla numbers, strings, booleans etc) ...

// type Data = {
//   [key: string]: any;
// };

// This is
// - a normal type (with the type definition block in curly brackets / {}), 
// - a special property in the format of [key: typeOfKeys]: typeOfValues, where
//   typeOfKeys is the type the keys of that object should have, and typeOfValues is the type the values of those keys should have.

// Basic custom type declaration (for comparison) ...
// type Programmer = {
//   name: string; // may only contain strings
//   knownFor: string[]; // may only contain an array of *strings*
// };

// Small type-cast to make the json friendlier to work with ...
type DogDB = {
  [breed: string]: string[]; 
};
const AllDogs = _dogs as DogDB; // In 'AllDogs' ... store 'dogs.json' (imported as '_dogs') so long as they square with the custom DogDB type properties
// - All keys should be strings,
// - All values should be arrays of strings


declare module "fastify" { // "Declaration merging"
  interface FastifyInstance { // No "export" - 'export interface ...'
    db: { // "db" is a ?property? of the interface
      dogs: {
        findAll: () => Promise<DogDB>;
        findMatches: () => Promise<DogDB>;
      };
    };
  }
}

async function DogsService(fastify: FastifyInstance) {
  async function findAll() {
    return AllDogs;
  }
  

  async function findMatches(params:object) {
    // Test return
    // return ['Bulldog', 'Pug']

    // Return a search
    // const results = dogs.find((dog) => dog.id === id) // Idea #1 for finding matches, but instead using includes()
    
    const resultsHard = AllDogs['bulldog'] // finds the key of 'bulldog' & returns its sub-breed values
    return resultsHard


  }

  fastify.decorate("db", { dogs: { findAll, findMatches } });
}
export default fp(DogsService); // fb = fastify plugin (imported @ l1)
