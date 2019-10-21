import { gql } from 'apollo-boost';

// posts Queries

export const GET_POSTS = gql`
query{
  getPosts{
    _id
    title
    imageUrl
  }
}
`

//user Queries

//posts Mutations

//user Mutations
export const SIGNIN_USER = gql`
  mutation($username:String!, $password: String!){
    signinUser(username: $username,password: $password){
      token
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation($username:String!, $email: String!, $password: String!){
    signupUser(username: $username,email: $email, password: $password){
      token
    }
  }
`
