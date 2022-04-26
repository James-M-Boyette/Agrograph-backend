import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import _dogs from "../db/dogs.json";
const fs = require('fs');

// Small type-cast to make the json friendlier to work with
type DogDB = {
  [breed: string]: string[]; // "breed" will become the key (after declared as type 'string'); dynamic key names
};
const AllDogs = _dogs as DogDB; // In 'AllDogs' ... store 'dogs.json' (imported as '_dogs') so long as they square with the custom DogDB type properties
// - All keys should be strings,
// - All values should be arrays of strings

declare module "fastify" { // "Declaration merging"
  interface FastifyInstance { // No "export" - 'export interface ...'
    db: { // "db" is a ?property? of the interface
      dogs: {
        findAll: () => Promise<DogDB>;
        findMatches: (params:string) => Promise<DogDB>;
        addBreed: (params:object) => Promise<DogDB>; // This stipulates (among other things) that addBreed should expect an object
      };
    };
  }
}

async function DogsService(fastify: FastifyInstance) {
  // INDEX
  async function findAll() {
    return AllDogs;
  }

  // SHOW
  async function findMatches(params:string) {
    console.log(`Here are the params received by dogs.service: ${params}`);

    
    const keysFound:string[] = Object.keys(AllDogs).filter(key => key.startsWith(params.toLowerCase())).sort(); // Returns partially-matching keys
    console.log(`Here are the matched keys:`)
    console.log(keysFound)

    const searchResults:any = {};
    for (let i = 0; i < keysFound.length; i++) {
      searchResults[keysFound[i]] = AllDogs[keysFound[i]];
    }
    return searchResults
  }

  // async function addBreed(params:{breed:string, subBreeds:string[]}) {
  async function addBreed(params:any) {
    if(false) return `Warning: no data received`
      
    console.log(`Add breed:`);
    console.log(params.breed)
    console.log(`Add sub-breeds:`);
    console.log(params.subBreeds)

    // Create DB Key & Value(s)
    const paramKey = params.breed;
    console.log(`Here's the param key:`)
    console.log(paramKey)

    const paramValues:string[] = params.subBreeds;
    console.log(`Here's the param value(s):`)
    console.log(paramValues)


    // AllDogs[paramKey] = paramValues;
    AllDogs[params.breed] = params.subBreeds;
    //   console.log(AllDogs)

    const newData = JSON.stringify(AllDogs);
    console.log(`Here's the JSON version of AllDogs:`)
    console.log(newData)
    console.log(`newData's type:`)
    console.log(typeof newData)

    await fs.writeFile('./src/db/dogs.json', newData , (err:any) => { 
      if(err) console.log('error', err);
    });

    return newData
}

  fastify.decorate("db", { dogs: { findAll, findMatches , addBreed } });
}
export default fp(DogsService);


// TO-DO
//    - Make POST *route* handle body params (instead of hard-coded)
//    - Make SHOW handle "no-match scenarios"
//    - Break-out database save to seperate service
