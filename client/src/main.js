import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import ApolloClient from 'apollo-boost';
import VueApollo from 'vue-apollo';

import FormAlert from '@/components/Shared/FormAlert';

Vue.component('form-alert',FormAlert);

Vue.use(VueApollo);

//set up apolloclient
export const defaultClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql',

  fetchOptions:{
    credentials: 'include',
  },
  request: operation => {
    if (!localStorage.token){
      localStorage.setItem('token','');
    }
    //ヘッダーにローカルストレージから取り出したトークンを埋め込む
    operation.setContext({
      headers:{
        authorization: localStorage.getItem('token')
      }
    })
  },
  //エラーの際の処理
  onError:({ graphQLErrors, networkError})=>{
    if (networkError){
      console.log('[networkError]',networkError);
    }
    if(graphQLErrors){
      for (let err of graphQLErrors){
        if(err.name == "AuthenticationError"){
          store.commit('setAuthError',err);
          store.dispatch('signoutUser');
        }
      }
    }
  }
})

const apolloProvider = new VueApollo({ defaultClient});

Vue.config.productionTip = false

new Vue({
  provide: apolloProvider.provide(),
  router,
  store,
  vuetify,
  render: h => h(App),
  created(){
    this.$store.dispatch('getCurrentUser');
  }
}).$mount('#app')
