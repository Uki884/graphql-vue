const {ApolloServer, AuthenticationError} = require("apollo-server");
const mongoose = require("mongoose");
const fs =  require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

//typeDefsとresolvers
const filepath = path.join(__dirname,'typeDefs.graphql');
const typeDefs = fs.readFileSync(filepath, 'utf-8');
const resolvers = require('./resolvers')

require('dotenv').config({path: 'variables.env'});
const User = require('./models/User');
const Post = require('./models/Post');

mongoose
  .connect(
    process.env.MONGO_URI,
    {useNewUrlParser: true}
    )
  .then(()=> console.log("DB connected"))
  .catch(err => console.error(err));

  const getUser = async token => {
    if (token){
      try{
        return await jwt.verify(token, process.env.SECRET);
      }
      catch(err){
        console.dir(err);
        throw new AuthenticationError('セッションが切れました再ログインしてください。');
      }
    }
  };

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => ({
    name: error.name,
    message: error.message.replace("Context creation failed:","")
  }),
  context: async ({req}) => {
    const token = req.headers["authorization"];
    return {User,Post, currentUser: await getUser(token)};
  }
});

server.listen().then(({url})=>{
  console.log(`server listening on ${url}`);
});

