import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import ApolloClient from 'apollo-boost';
import VueApollo from 'vue-apollo';

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

    operation.setContext({
      headers:{
        authorization: localStorage.getItem('token')
      }
    })
  },
  onError:({ grapQLErrors, networkError})=>{
    if (networkError){
      console.log('[networkError]',networkError);
    }
    if(grapQLErrors){
      for (let err of grapQLErrors){
        console.log('[grapQLError]',err);
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
  render: h => h(App)
}).$mount('#app')
