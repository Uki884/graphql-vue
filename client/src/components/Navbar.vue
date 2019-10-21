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
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>
<script>
export default {
  name: 'Appbar',
  data(){
    return{
      sideNav: false
    }
  },
  computed:{
    horizontalNavItems(){
      return[
        {icon: 'chat',title:'Posts',link: '/posts'},
        {icon: 'lock_open',title:'Sign In',link: '/signin'},
        {icon: 'create',title:'Sign up',link: '/signup'},
      ]
    },
    sideNavItems(){
      return[
        {icon: 'chat',title:'Posts',link: '/posts'},
        {icon: 'lock_open',title:'Sign In',link: '/signin'},
        {icon: 'create',title:'Sign up',link: '/signup'},
      ]
    }
  },
  methods:{
    toggleSideNav(){
      this.sideNav = !this.sideNav;
    }
  }
}
</script>