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
      <v-text-field flex placeholder="Search posts" color="accent" single-line hide-details
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
      <v-btn text v-for="item in horizontalNavItems" :key="item.title" :to="item.link">
        <v-icon class="hidden-xs-only" left>{{item.icon}}</v-icon>
        {{item.title}}
      </v-btn>
      <!-- プロフィール -->
      <v-btn text to="/profile" v-if="user">
        <v-icon class="hidden-sm-only" left>account_box</v-icon>
        <v-badge right color="green darken-2">
          <span slot="badge">1</span>
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
      sideNav: false
    }
  },
  computed:{
    ...mapGetters(['user']),
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
          {icon: 'chat',title:'Posts',link: '/posts'},
          {icon: 'stars',title:'Create Post',link: '/post/add'},
          {icon: 'account_box',title:'Profile',link: '/profile'},
        ]
      }
      return items;
    }
  },
  methods:{
    handlesignoutUser(){
      this.$store.dispatch('signoutUser');
    },
    toggleSideNav(){
      this.sideNav = !this.sideNav;
    }
  }
}
</script>
