import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone"
import { typeDefs } from "./schema.js";
const port = process.env.PORT || 4000
import  { Client } from "@opensearch-project/opensearch";
const indexName = process.env.INDEX_NAME



dotenv.config();
let url

const playgroundEnabled = process.env.APOLLO_PLAYGROUND === 'true';
const introspectionEnabled = process.env.APOLLO_INTROSPECTION === 'true';

const client = new Client({
  node: process.env.OPENSEARCH_HOST,
  auth: {
    username: process.env.OPENSEARCH_USERNAME,
    password: process.env.OPENSEARCH_PASSWORD,
  },
});


console.log('opensearch host:', process.env.OPENSEARCH_HOST)
console.log('opensearch username:', process.env.OPENSEARCH_USERNAME)
console.log('opensearch password:', process.env.OPENSEARCH_PASSWORD)
console.log('apollo playgroundEnabled:', playgroundEnabled)
console.log('apollointrospectionEnabled:', introspectionEnabled)
console.log(typeof playgroundEnabled);
console.log(typeof introspectionEnabled);


const resolvers = {
  Query: {
    all: async () => {
      try {

        const { body } = await client.search({
          index: indexName,
          body: {
            query: {
              match_all: {}  /
            }
          },
          size: 3000
        });


        return body.hits.hits.map(hit => hit._source);
      } catch (error) {
        console.error('Error al obtener todas las canciones:', error);
        throw new Error('Error al obtener todas las canciones');
      }
    }
  },

};


const CustomPlaygroundDisabler = () => {
  return {
    async serverWillStart() {
      return {
        async renderLandingPage() {
          return {
            html: '<h1>404 Not Found</h1>',
          };
        },
      };
    },
  };
};



if (!playgroundEnabled) {

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: introspectionEnabled,
    plugins: [
      CustomPlaygroundDisabler()
    ],
  });
   url  = await startStandaloneServer(server, { listen: { port: port } });
}else{
  console.log('playgroundEnabled:', playgroundEnabled)
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: introspectionEnabled,
    plugins: [
      CustomPlaygroundDisabler()
    ],
  });
   url  = await startStandaloneServer(server, { listen: { port: port } });
}




// plugins: [
//   playgroundEnabled
//     ? ApolloServerPluginLandingPageDisabled()
//     : ApolloServerPluginLandingPageGraphQLPlayground(),
// ],



console.log(`🚀 Server listening at: ${url.url}`);
