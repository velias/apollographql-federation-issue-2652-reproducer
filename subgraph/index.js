const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const gql = require('graphql-tag');

const typeDefs = gql`
  type Query {
    me: String
  }

`;

const resolvers = {
  Query: {
    me() {
      throw new Error('Some error');
    },
  },
};

const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),

});

startStandaloneServer(server, { listen: { port: 4001} })
    .then((value) => {
        console.log(`🚀  Server ready at ${value.url}`);
    }).catch((error) => {
        console.error(error);
    });
 
