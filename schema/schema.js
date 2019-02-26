const graphql = require('graphql');
const axios = require('axios');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList
} = graphql;


const RedditType = new GraphQLObjectType({
    name: 'Reddit',
    fields: () => ({
        id: {type: GraphQLString},
        title: {type: GraphQLString},
        text: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parentValue, args) {
                console.log(parentValue);
                return axios.get(`http://localhost:3000/users/${parentValue.id}`)
                    .then(res=> res.data);
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        reddit: {
            type: new GraphQLList(RedditType),
            resolve(parentValue,args) {
                return axios.get(`http://localhost:3000/users/${parentValue.id}/reddits/`)
                        .then(res=>res.data);
            }

        }
    })
})


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(res=>res.data);
            }
        },
        reddit: {
            type: RedditType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue,args) {
                return axios.get(`http://localhost:3000/reddits/${args.id}`)
                    .then(res=>res.data);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});