import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import _dogs from "../db/dogs.json";
const fs = require('fs');

type DogDB = {
  [breed: string]: string[];
};
const AllDogs = _dogs as DogDB;

declare module "fastify" {
  interface FastifyInstance {
    db: {
      dogs: {
        findAll: () => Promise<DogDB>;
        findMatches: (params:string) => Promise<DogDB>;
        addBreed: (params:object) => Promise<DogDB>;
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
    // Store partially-matching keys
    const breedsFound:string[] = Object.keys(AllDogs).filter(key => key.toLowerCase().includes(params.toLowerCase())).sort(); 

    // Store matching 'main breeds' and 'sub-breeds'
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

    return keyValueMatches
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

    // Create DB Key & Value(s)
    subBreeds.forEach((breed) => AllDogs[mainBreed].push(breed))

    // Save AllDogs to database
    const newData = JSON.stringify(AllDogs);
    await fs.writeFile('./src/db/dogs.json', newData , (err:any) => {
      if(err) console.log('error', err);
    });
    return newData
  }
  
  fastify.decorate("db", { dogs: { findAll, findMatches , addBreed } });
}

function validate(paramsBreed:string, paramsSubBreeds:string[]) {
  // // Validation: "No data received"
  if (!paramsBreed) {return `Warning: no data received`}

  // // Validation: "Must be at least 5 characters"
  if (paramsBreed.length < 5) {return `Must be at least 5 characters`}

  // // Validation: "Must not already exist in the database"
  function matchCheck (breed:string, subBreeds:string[]) {
    let results:string = '';
    Object.keys(AllDogs).forEach((key) => { 
      if(key === breed) {
        const match = subBreeds.filter(subBreed => AllDogs[key].includes(subBreed));
        if(match){results = match[0];}
      } 
    })
    return results
  }

  let matchResults:string = matchCheck(paramsBreed, paramsSubBreeds);
  if (matchResults){return `Main breed & sub-breeds can't already exist - '${matchResults}' is already in database`}
}

export default fp(DogsService);

