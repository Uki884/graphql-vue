<template>
<div>
    <v-navigation-drawer app temporary fixed v-model="sideNav">
      <v-toolbar color="accent" dark flat>
        <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>
        <router-link to="/" tag="span" style="cursor: pointer">
          <h1 class="title pl-3">VueShare</h1>
        </router-link>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list>
        <v-list-item ripple v-for="item in sideNavItems" :key="item.title" :to="item.link">
          <v-list-item-icon>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item ripple v-if="user">
          <v-list-item-icon>
            <v-icon>exit_to_app</v-icon>
          </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title @click="handlesignoutUser">ログアウト</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
<v-toolbar
      color="primary accent-4"
    >
      <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>
      <v-toolbar-title class="hidden-xs-only">
        <router-link to="/" tag="span" style="cursor: pointer">
        VueShare
        </router-link>
        </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- search input -->
      <v-icon class="hidden-xs-only">search</v-icon>
      <v-text-field flex v-model="searchTerm" @input="handleSearchPosts" placeholder="Search posts" color="accent" single-line hide-details
      ></v-text-field>
      <v-spacer></v-spacer>
      <!-- searchResults -->
      <v-card dark v-if="searchResults.length" id="search_card" style="z-index: 9999">
        <v-list>
          <v-list-item @click="goToSearchResult(result._id)" v-for="result in searchResults" :key="result._id">
            <v-list-item-title >
              {{result.title}}
              <span class="font-weight-thin caption"> {{formatDescription(result.description)}}</span>
            </v-list-item-title>
            <v-list-item-action v-if="checkIfUserFavorite(result._id)">
              <v-icon>favorite</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>

      <v-toolbar-items class="hidden-xs-only">
      <v-btn text v-for="item in horizontalNavItems" :key="item.title" :to="item.link">
        <v-icon class="hidden-xs-only" left>{{item.icon}}</v-icon>
        {{item.title}}
      </v-btn>
      <!-- プロフィール -->
      <v-btn text to="/profile" v-if="user" v-bind:class="{ bounce : badgeAnimated}">
        <v-icon class="hidden-sm-only" left >account_box</v-icon>
        <v-badge right color="green darken-2">
          <span slot="badge" v-if="userFavorites.length">{{userFavorites.length}}</span>
          Profile
        </v-badge>
      </v-btn>
      <!-- ログアウト -->
      <v-btn text v-if="user" @click="handlesignoutUser">
        <v-icon class="hidden-sm-only" left>exit_to_app</v-icon>
          ログアウト
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>
<script>
import {mapGetters} from 'vuex';

export default {
  name: 'Appbar',
  data(){
    return{
      searchTerm: "",
      sideNav: false,
      badgeAnimated: false,
    }
  },
  computed:{
    ...mapGetters(['user','userFavorites','searchResults']),
    horizontalNavItems(){
      let items = [
        {icon: 'chat',title:'Posts',link: '/posts'},
        {icon: 'lock_open',title:'Sign In',link: '/signin'},
        {icon: 'create',title:'Sign up',link: '/signup'},
      ];
      if (this.user){
        items = [
          {icon: 'chat',title:'Posts',link: '/posts'},
        ]
      }
      return items;
    },
    sideNavItems(){
      let items = [
        {icon: 'chat',title:'Posts',link: '/posts'},
        {icon: 'lock_open',title:'Sign In',link: '/signin'},
        {icon: 'create',title:'Sign up',link: '/signup'},
      ];
      if (this.user){
        items = [
          {icon: 'chat',title:'投稿一覧',link: '/posts'},
          {icon: 'stars',title:'新規投稿',link: '/post/add'},
          {icon: 'account_box',title:'プロフィール',link: '/profile'},
        ]
      }
      return items;
    }
  },
  watch:{
    userFavorites(value){
      if (value.length){
        this.badgeAnimated = true;
        setTimeout(() => (this.badgeAnimated = false),1000)
      }
    }
  },
  methods:{
    handleSearchPosts(){
      this.$store.dispatch('searchPosts',{
        searchTerm: this.searchTerm
      });
    },
    handlesignoutUser(){
      this.$store.dispatch('signoutUser');
    },
    toggleSideNav(){
      this.sideNav = !this.sideNav;
    },
    formatDescription(desc){
      return desc.length > 30 ? `${desc.slice(0,30)}...` : desc;
    },
    checkIfUserFavorite(resultId){
      return (
        this.userFavorites &&
        this.userFavorites.some(fave => fave._id === resultId)
        );
    },
    goToSearchResult(resultId){
      this.searchTerm = '';
      this.$router.push(`/posts/${resultId}`);
      this.$store.commit('clearSearchResults');
    }
  }
}
</script>

<style>
.v-window__container{
  position: relative;
    z-index: 1;
}
#search_card{
  position: absolute;
  width: 100vw;
  z-index: 9999999999999;
  top: 100%;
  left:0%;
}
.bounce {
  animation: bounce 1s both !important;
}
  @keyframes bounce {
  0%, 20%,53%,80%, 100%{
    transform: translate3d(0,0,0);
  }
  40%,43%{
    transform: translate3d(0,-20px,0);
  }
  70%{
    transform: translate3d(0,-10px,0);
  }
  90%{
    transform: translate3d(0,-4px,0);
  }
}

</style>