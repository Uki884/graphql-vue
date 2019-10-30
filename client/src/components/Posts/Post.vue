<template>
  <v-container v-if="getPost" class="mt-3" flexbox center>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card hover>
          <v-card-title>
            <h1>{{getPost.title}}</h1>
            <v-btn large icon v-if="user" @click="handleToggleLike">
              <v-icon large :color="checkIfPostLiked(getPost._id) ? 'red' : 'grey'" >favorite</v-icon>
            </v-btn>
            <v-card-subtitle class="ml-3 fontweight-thin">{{getPost.likes}}スキ</v-card-subtitle>
            <v-spacer></v-spacer>
            <v-icon color="info" @click="goToPreviousPage">arrow_back</v-icon>
          </v-card-title>

          <v-tooltip right >
            <span>画像を拡大する</span>
            <template v-slot:activator="{ on }">
          <v-img @click="toggleImageDialog" slot="activator" :src="getPost.imageUrl" id="post__image"></v-img>
            </template>
          </v-tooltip>

          <v-dialog v-model="dialog">
            <v-card>
              <v-img :src="getPost.imageUrl" height="80vh"></v-img>
            </v-card>
          </v-dialog>
          <v-card-text>
            <span v-for="(category,index) in getPost.categories" :key="index">
              <v-chip class="mb-3" color="accent" text-color="white">{{category}}</v-chip>
            </span>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <div class="mt-3">
      <v-layout class="mb-3" v-if="user">
        <v-flex xs12>
          <v-form v-model="isFormvalid" @submit.prevent="handleAddPostMessage" ref="form">
            <v-layout row>
              <v-flex xs12>
                <v-text-field :rules="messageRules" v-model="messageBody" clearable @click:append-outer="handleAddPostMessage" :append-outer-icon=" messageBody && 'send'" label="メッセージ" type="text"
                prepend-icon="email"></v-text-field>
                <!-- @click:append="handleAddPostMessage" -->
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12>
          <v-list subheader two-line >
            <v-subheader>Messages ({{getPost.messages.length}})</v-subheader>
            <template v-for="message in getPost.messages" >
              <v-divider :key="message._id"></v-divider>
              <v-list-item avatar inset :key="message.title">
                <v-list-item-avatar>
                  <img :src="message.messageUser.avatar">
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{message.messageBody}}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{message.messageUser.username}}
                    <span class="grey--text text--lighten-1 hidden-xs-only">{{formatCreatedDate(message.messageDate)}}</span>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon :color="checkIfOwnMessage(message) ? 'accent' : 'grey'">chat_bubble</v-icon>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </div>
  </v-container>
</template>

<script>
import { GET_POST, ADD_POST_MESSAGE, LIKE_POST, UNLIKE_POST} from '@/queries'
import { mapGetters } from 'vuex'
import moment from 'moment';
export default {
  name: "Post",
  props:["postId"],
  data(){
    return{
    dialog: false,
    messageBody: "",
    isFormValid: true,
    postLiked: false,
    messageRules:[
      message => !!message || "内容を入力して下さい",
      message => message.length < 75 || "75文字以内で入力して下さい"
    ]
    }
  },
  apollo: {
    getPost: {
      query: GET_POST,
      variables(){
        return{
          postId: this.postId
        }
      }
    }
  },
  computed:{
  ...mapGetters(['user','userFavorites'])
  },
  methods:{
    formatCreatedDate(date){
      return moment(new Date(date)).fromNow();
    },
    checkIfPostLiked(postId){
      if(this.userFavorites && this.userFavorites.some(fave => fave._id === postId)){
        this.postLiked = true;
        return true
      }else{
        this.postLiked = false;
        return false;
      }
    },
    handleToggleLike(){
      if(this.postLiked){
        this.handleUnLikePost();
      }else{
        this.handleLikePost();
      }
    },
    handleLikePost(){
      const variables = {
        username: this.user.username,
        postId: this.postId
      };
      this.$apollo.mutate({
        mutation: LIKE_POST,
        variables,
        update: (cache, {data: {likePost }}) => {
          console.log(likePost);
          const data = cache.readQuery({
            query: GET_POST,
            variables: { postId: this.postId}
          });
          data.getPost.likes += 1;
          cache.writeQuery({
            query: GET_POST,
            variables: { postId: this.postId},
            data
          });
        }
      }).then(({data}) => {
        const updatedUser = {...this.user, favorites: data.likePost.favorites};
        this.$store.commit('setUser', updatedUser);
      }).catch(err => console.error(err) );
    },
    handleUnLikePost(){
      const variables = {
        username: this.user.username,
        postId: this.postId
      };
      this.$apollo.mutate({
        mutation: UNLIKE_POST,
        variables,
        update: (cache, {data: {unlikePost }}) => {
          console.log(unlikePost);
          const data = cache.readQuery({
            query: GET_POST,
            variables: { postId: this.postId}
          });
          data.getPost.likes -= 1;
          cache.writeQuery({
            query: GET_POST,
            variables: { postId: this.postId},
            data
          });
        }
      }).then(({data}) => {
        const updatedUser = {...this.user, favorites: data.unlikePost.favorites};
        this.$store.commit('setUser', updatedUser);
      }).catch(err => console.error(err) );
    },
    handleAddPostMessage(){
    if ( this.$refs.form.validate()){
      const variables = {
        messageBody: this.messageBody,
        userId: this.user._id,
        postId: this.postId
      };
      this.$apollo
        .mutate({
        mutation: ADD_POST_MESSAGE,
        variables,
        //現在のPOST一覧を取得する。
        update: (cache, {data: { addPostMessage } }) => {
          const data = cache.readQuery({
            query: GET_POST ,
            variables: {postId: this.postId }
            });
            data.getPost.messages.unshift(addPostMessage);
            //POST一覧に新しくPOSTしたオブジェクトで新しい配列を作成する。
            cache.writeQuery({
              query: GET_POST ,
              variables: {postId: this.postId },
              data
            })
          }
      })
      .then(({data} ) => {
        this.$refs.form.reset();
        console.log(data.addPostMessage);
      })
      .catch(err => console.error(err));
    }
    },
    goToPreviousPage(){
      this.$router.go(-1);
    },
    toggleImageDialog(){
      if(window.innerWidth > 500){
        this.dialog = true;
      }
    },
    checkIfOwnMessage(message){
      return this.user && this.user._id === message.messageUser._id;
    },
  }
}
</script>

<style scoped>
#post__image{
  height: 400px !important;
}
</style>