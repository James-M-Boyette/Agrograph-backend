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

    const breedsFound:string[] = Object.keys(AllDogs).filter(key => key.toLowerCase().includes(params.toLowerCase())).sort(); // Returns partially-matching keys
    console.log(`Here are the matched keys:`)
    console.log(breedsFound)

    const keyValueMatches:string[] = Object.keys(AllDogs).reduce((acc:string[], breed) => { // Check each key (converted to array in Object.keys)
      if(breed.toLowerCase().includes(params.toLowerCase())){ // Add any matching Keys to the results
        acc.push(breed)
      }
      AllDogs[breed].forEach((subBreed) => { // Check all keys' values/"sub-breeds" for matches; add sub-breed & main breed if matched
        if(subBreed.toLowerCase().includes(params.toLowerCase())){
          acc.push(subBreed + ' ' + breed )
        }
      })
      return acc
    }, [])
    console.log(`Here's all matches ():`)
    console.log(keyValueMatches)

    // keysFound replace
    // const searchResults:any = {};
    // for (let i = 0; i < keysFound.length; i++) {
    //   searchResults[keysFound[i]] = AllDogs[keysFound[i]];
    // }
    // return searchResults
    return `stuff`
  }

  async function addBreed(params: { breed: string, subBreeds: string[] }) {

    // Convert inputs to lower case
    const mainBreed:string = params.breed.toLowerCase();
    const subBreeds:string[] = params.subBreeds.map(element => {
      return element.toLowerCase();
    });

    // Validation checks
    const message = await validate(mainBreed, subBreeds)

    if(message) {return message} // Send a validation failure message back, if any are returned from 'validate'
      
    console.log(`Here's the breed (key):`);
    console.log(mainBreed)
    console.log(`Here's the sub-breeds (values):`);
    console.log(subBreeds)

    // Create DB Key & Value(s)
    subBreeds.forEach((breed) => AllDogs[mainBreed].push(breed))

    const newData = JSON.stringify(AllDogs);
    await fs.writeFile('./src/db/dogs.json', newData , (err:any) => {
      if(err) console.log('error', err);
    });

    return newData
}

  fastify.decorate("db", { dogs: { findAll, findMatches , addBreed } });
}

function validate(paramsBreed:string, paramsSubBreeds:string[]) {
  console.log(paramsBreed);
  console.log(paramsSubBreeds);
  // // Validation: "No data received"
  if (!paramsBreed) {
    // console.log(`Warning: no data received`);
    return `Warning: no data received`}
  // // Validation: "Must be at least 5 characters"
  if (paramsBreed.length < 5) {
    // console.log(`Main breed must be at least 5 characters`);
    return `Must be at least 5 characters`}

  // // Validation: "Must not already exist in the database"
  function matchCheck (paramsBreed:string, paramsSubBreeds:string[]) {
    let results:string = '';
    Object.keys(AllDogs).forEach((key) => { 
      if(key === paramsBreed) {
        const match = paramsSubBreeds.filter(paramsSubBreed => AllDogs[key].includes(paramsSubBreed));
        if(match){results = match[0];}
      } 
    })
    return results
  }

  let matchResults:string = matchCheck(paramsBreed, paramsSubBreeds);
  if (matchResults){
    console.log(`Main breed & sub-breeds can't already exist - '${matchResults}' is already in database`)
    return `Main breed & sub-breeds can't already exist - '${matchResults}' is already in database`}

}

export default fp(DogsService);


// TO-DO
//    - [DONE] Make POST *route* handle body params (instead of hard-coded)
//    - Make SHOW handle "no-match scenarios"
//    - Break-out database save to seperate service
