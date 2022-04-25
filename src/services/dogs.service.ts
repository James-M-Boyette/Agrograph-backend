import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import _dogs from "../db/dogs.json";
const fs = require('fs');

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
        findMatches: (params:string) => Promise<DogDB>;
        addBreed: (params:string) => Promise<DogDB>;
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

    // 6. Handle "No match" scenarios ...
    const keysFound:string[] = Object.keys(AllDogs).filter(key => key.startsWith(params)).sort(); // Returns partially-matching keys
    console.log(`Here are the matched keys:`)
    console.log(keysFound)

    const searchResults:any = {};

    // if(keysFound === []){
    //   const noResults:string = 'sorry';
    //   return noResults
    // } else {
      for (let i = 0; i < keysFound.length; i++) {
        searchResults[keysFound[i]] = AllDogs[keysFound[i]];
      }
      return searchResults
    // }

  }

  // POST
  async function addBreed(params:string) {
    console.log(`Add breed:`);
    console.log(params);
    console.log(params.length);

    if(params.length > 0){
      // Convert params string into array of strings ...
      const paramsConvert:string[] = params.split(','); 
      console.log(paramsConvert.length)

      // Create DB Key & Value(s)
      const paramKey = paramsConvert[0];
      // console.log(`Here's the paramKey: ${paramKey}`)
      const paramValues:string[] = [];
      for(let i = 1; i < paramsConvert.length; i++){
        paramValues.push(paramsConvert[i])
      }
      // const toBeStored = {[paramKey] : paramValues};

      // console.log(toBeStored);

      AllDogs[paramKey] = paramValues;
      console.log(AllDogs)

      const newData = JSON.stringify(AllDogs);
      
      fs.writeFile('./src/db/dogs.json', newData , (err:any) => { 
        if(err) console.log('error', err);
      });

      console.log("New data added");
      return `success`

    } else {
      console.log(`Warning: no data received`)

      return `Warning: no data received`

    }
  }

  fastify.decorate("db", { dogs: { findAll, findMatches , addBreed } });
}
export default fp(DogsService); // fb = fastify plugin (imported @ l1)

// NOTES: 
//   Notes on typescript:
//   1. The above [l6-9] is *setting* a bespoke type (instead of vanilla numbers, strings, booleans etc) ...

//   type Data = {
//     [key: string]: any;
//   };

//   This is
//   - a normal type (with the type definition block in curly brackets / {}), 
//   - a special property in the format of [key: typeOfKeys]: typeOfValues, where
//     typeOfKeys is the type the keys of that object should have, and typeOfValues is the type the values of those keys should have.

//   Basic custom type declaration (for comparison) ...
//   type Programmer = {
//     name: string; // may only contain strings
//     knownFor: string[]; // may only contain an array of *strings*
//   };



// SCRAP from findMatches()

    // 1. Test return ...
    // return ['Bulldog', 'Pug']

    // 2. Return a k:v search ...
    // const resultsHard = AllDogs['bulldog'] // finds the key of 'bulldog' & returns its sub-breed values

    // 3. Return a k:v search using params ...
    // const searchResult:string[] = AllDogs[params];

    // 4. Return partial matches between params & database ...
    // const keysFound:string[] = Object.keys(AllDogs).filter(key => key.startsWith(params)).sort(); // Returns partially-matching keys
    // console.log(`Here are the matched keys:`)
    // console.log(keysFound)
    
    // 5. Return full k:v of partial matches ...
    // let searchResult:any = keysFound.map(item => (console.log(AllDogs[item]))); // Returns values of partially-matching keys (save for future use?)
    // const keyValue:any = {};

    // for (let i = 0; i < keysFound.length; i++) {
    //   keyValue[keysFound[i]] = AllDogs[keysFound[i]];
    // }

    // return keyValue