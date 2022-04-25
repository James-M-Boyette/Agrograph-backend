import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import _dogs from "../db/dogs.json";

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
    // 1. Test return ...
    // return ['Bulldog', 'Pug']

    // 2. Return a k:v search ...
    // const resultsHard = AllDogs['bulldog'] // finds the key of 'bulldog' & returns its sub-breed values

    // 3. Return a k:v search using params ...
    // const searchResult:string[] = AllDogs[params];

    // 4. Return partial matches between params & database ...
    // const searchResult:string[] = AllDogs[params];

    const keysFound:string[] = Object.keys(AllDogs).filter(key => key.startsWith(params)).sort(); // Returns partially-matching keys
    console.log(`Here are the matched keys:`)
    console.log(keysFound)
    // const searchResult:string[] = keysFound.map(item => ({ date: item.date, price: item["price(USD)"] }));
    // let searchResult:any = keysFound.map(item => (console.log(AllDogs[item])));

    // init
    // const keyValue = new Map()
    // // add
    // // keyValue.set('firstname', 'tony')
    // // keysFound.forEach(keyValue.set('firstname', 'tony'))

    // for (let i = 0; i < keysFound.length; i++) {
    //   keyValue.set(keysFound[i], AllDogs[keysFound[i]])
    // }
    // // keysFound.forEach(keyValue.set('firstname', 'tony'))
    // console.log(`Here's the output:`)
    // console.log(keyValue)
    // console.log(typeof keyValue)



    const keyValue:any = {};
    // add
    // keyValue.set('firstname', 'tony')
    // keysFound.forEach(keyValue.set('firstname', 'tony'))

    
    for (let i = 0; i < keysFound.length; i++) {
      keyValue[keysFound[i]] = AllDogs[keysFound[i]];
    }
    // keysFound.forEach(keyValue.set('firstname', 'tony'))
    console.log(`Here's the output:`)
    console.log(keyValue)
    console.log(typeof keyValue)

    let searchResult:any = keysFound.map(item => (console.log(AllDogs[item]))); // Returns values of partially-matching keys

    // Decomp: What do I want to do?
    //  - I want, for every matched key, 
    //    to push that k:v into an object
    //    > Problem: .filter() will return the matching *values* of a specific key (all cars, where color = 'red')

    // let myObject = AllDogs.map(element => {
    //   if(element === "bulldog"){
    //     myObject.push(element)
    //   }
    // })
    // console.log(`Here's my object:`)
    // console.log(myObject)

    // return searchResult
    // return {"bulldog": ["boston", "english", "french"],
    // "bullterrier": ["staffordshire"],}
    return keyValue
    // return {AllDogs[keysFound]}

    // 5. Handle "No match" scenarios ...

  }
  fastify.decorate("db", { dogs: { findAll, findMatches } });
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