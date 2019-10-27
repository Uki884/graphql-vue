import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router';

import { defaultClient as apolloClient} from '@/main';

import { GET_CURRENT_USER, GET_POSTS, SIGNIN_USER, SIGNUP_USER, ADD_POST, SEARCH_POSTS,GET_USER_POSTS} from '@/queries';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    searchResults: [],
    posts: [],
    user: null,
    userPosts: [],
    loading: false,
    error: null,
    authError: null
  },
  mutations: {
    setPosts:( state,payload) =>{
      state.posts = payload;
    },
    setUser: (state,payload) =>{
      state.user = payload;
    },
    setLoading: ( state,payload) =>{
      state.loading = payload;
    },
    setError: ( state,payload) =>{
      state.error = payload;
    },
    setAuthError: ( state,payload) =>{
      state.authError = payload;
    },
    setSearchPosts: (state, payload) => {
      if (payload != null) {
        state.searchResults = payload;
      }
    },
    setUserPosts: (state,payload) => {
      if (payload != null) {
        state.userPosts = payload;
      }
    },
    clearSearchResults: state => ( state.searchResults = []),
    clearUser: state => (state.user = null),
    clearError: state=> (state.error = null),
  },
  actions: {
    getCurrentUser:({commit}) => {
      commit('setLoading',true);
      apolloClient.query({
        query: GET_CURRENT_USER
      })
      .then(({data}) => {
        commit('setLoading',false);
        commit('setUser',data.getCurrentUser);
        console.log(data.getCurrentUser);
      })
      .catch(err => {
        commit('setLoading',false);
        console.log(err);
      })
    },
    getPosts({ commit }){
      commit('setLoading',true)
      apolloClient
      .query({
        query: GET_POSTS
      })
      .then(({data}) => {
        commit('setPosts',data.getPosts);
        commit('setLoading',false);
      })
      .catch(err => {
        commit('setLoading',false);
        console.log(err);
      })
    },
    getUserPosts: ({ commit }, payload ) => {
      apolloClient
        .query({
          query: GET_USER_POSTS,
          variables: payload
        })
        .then(({ data }) => {
          commit('setUserPosts', data.getUserPosts);
        }).catch(err => { console.log(err) });
    },
    searchPosts: ({commit},payload) => {
      apolloClient
        .query({
          query: SEARCH_POSTS,
          variables: payload
        })
        .then(({ data }) => {
        commit('setSearchPosts', data.searchPosts);
        })
        .catch(err => {
          console.log(err);
        })
    },
    addPost:({commit},payload) => {
      commit('setLoading',true);
      apolloClient
      .mutate({
        mutation: ADD_POST,
        variables: payload,
        update: (cache, { data: { addPost } }) => {
          const data = cache.readQuery({ query: GET_POSTS });
          data.getPosts.unshift(addPost);
          console.log(data);
          cache.writeQuery({
            query: GET_POSTS,
            data
          })
        },
        optimisticResponse: {
          __typename: 'Mutation',
          addPost: {
            __typename: 'Post',
            _id: -1,
            ...payload
          }
        }
      })
      .then(({ data })=>{
        console.log(data.addPost);
        // commit('setLoading',false);
        // router.go();
      })
      .catch(err => {
        // commit('setLoading',false);
        // commit('setError',err);
        console.log(err);
      })
    },
    signinUser:({ commit }, payload)=>{
      // トークンクリアー
      commit('clearError');
      commit('setLoading',true)
      // localStorage.setItem("token",'');
      apolloClient
        .mutate({
            mutation: SIGNIN_USER,
            variables: payload
        })
        .then(({data})=>{
          commit('setLoading',false);
          localStorage.setItem('token',data.signinUser.token);
          router.go();
        })
        .catch(err => {
          commit('setLoading',false);
          commit('setError',err);
          console.log(err);
        })
    },
    signupUser:({ commit }, payload)=>{
      // トークンクリアー
      commit('clearError');
      commit('setLoading',true)
      // localStorage.setItem("token",'');
      apolloClient
        .mutate({
            mutation: SIGNUP_USER,
            variables: payload
        })
        .then(({data})=>{
          commit('setLoading',false);
          localStorage.setItem('token',data.signupUser.token);
          router.go();
        })
        .catch(err => {
          commit('setLoading',false);
          commit('setError',err);
          console.log(err);
        })
    },
    signoutUser: async({commit}) => {
      commit('clearUser');
      localStorage.removeItem('token');
      await apolloClient.resetStore();
    }
  },
  getters: {
    userPosts: state => state.userPosts,
    posts: state => state.posts,
    searchResults: state => state.searchResults,
    loading: state => state.loading,
    userFavorites: state => state.user && state.user.favorites,
    user: state => state.user,
    error: state => state.error,
    authError: state => state.authError,
  },
  modules: {
  }
})
