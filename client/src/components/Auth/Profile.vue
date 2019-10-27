<template>
    <v-container class="text-center">
      <v-flex sm6 offset-sm3>
        <v-card class="white--text" color="secondary">
          <v-layout>
            <v-flex xs5>
              <v-img height="125px" contain :src="user.avatar"></v-img>
            </v-flex>
            <v-flex xs7>
              <v-card-title primary-title>
                <div>
                  <div class="headline">{{user.username}}</div>
                  <div> 登録日 {{user.joinDate}}</div>
                  <div class="hidden-xs-only font-weight-thin">({{user.favorites.length}}) お気に入り</div>
                  <div class="hidden-xs-only font-weight-thin">{{userPosts.length}} 投稿</div>
                </div>
              </v-card-title>
            </v-flex>
          </v-layout>
        </v-card>
        <v-container v-if="!user.favorites.length">
        <v-layout row wrap >
          <v-flex xs12>
            <h2>まだ何もお気に入りしてません。</h2>
          </v-flex>
            </v-layout>
        </v-container>
            <div class="mt-3" v-else>
              <v-flex xs12>
                <h2 class="font-weigth-thin">お気に入り
                  <span class="font-weight-thin">({{user.favorites.length}})</span>
                </h2>
              </v-flex>
              <v-layout row wrap>
                <v-flex xs12 sm6 v-for="favorite in user.favorites" :key="favorite._id">
                  <v-card class="mt-3 ml-1 mr-2" hover>
                    <v-img height="30vh" :src="favorite.imageUrl"></v-img>
                    <v-card-text>{{favorite.title}}</v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </div>
      </v-flex>
      <v-container v-if="!userPosts.length">
        <v-layout row wrap>
          <v-flex xs12>
            <h2>まだあなたの投稿が有りません。</h2>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container class="mt-3" v-else>
        <v-flex xs12>
          <h2>あなたの投稿</h2>
          <span> ({{userPosts.length}})</span>
        </v-flex>
        <v-layout row wrap>
          <v-flex xs12 sm6 v-for="post in userPosts" :key="post._id">
            <v-card class="mt-3 ml-1 mr-2" hover>
              <v-btn color="info" floating fab small dark>
                <v-icon>edit</v-icon>
              </v-btn>
              <v-btn color="error" floating fab small dark>
                <v-icon>delete</v-icon>
              </v-btn>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-container>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'Profile',
  computed:{
  ...mapGetters(['user','userPosts']),
  },
  created(){
    this.handleGetUserPosts();
  },
  methods:{
    handleGetUserPosts(){
      this.$store.dispatch('getUserPosts',{
        userId: this.user._id
      })
    }
  }
}
</script>