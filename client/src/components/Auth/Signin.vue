<template>
<v-container class="text-center" mt-5 pt-5>
  <v-layout row wrap>
    <v-flex xs12 sm6 offset-sm3>
      <h1>ログイン</h1>
    </v-flex>
  </v-layout>
<!-- エラー -->
<v-layout v-if="error" row wrap>
  <v-flex xs12 sm6 offset-sm3>
    <form-alert :message="error.message"></form-alert>
  </v-flex>
</v-layout>

<v-layout row wrap>
  <v-flex xs12 sm6 offset-sm3>
    <v-card>
      <v-container>
        <v-form v-model="isFormValid" @submit.prevent="handleSigninUser" lazy-validation ref="form">
          <v-layout row px-5>
            <v-flex xs12>
              <v-text-field :rules="usernameRules" v-model="username" prepend-icon="face" label="username" type="text" required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row px-5>
            <v-flex xs12>
              <v-text-field :rules="passwordRules" v-model="password" prepend-icon="extension" label="password" type="password" required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row px-5>
            <v-flex xs12>
              <v-btn :loading="loading" :disabled="!isFormValid || loading" color="accent" type="submit">ログイン</v-btn>
              <h5 style="margin-top:12px;">アカウントを持ってない？
              <router-link to="/signup">アカウント登録</router-link>
              </h5>
              </v-flex>
          </v-layout>
        </v-form>
      </v-container>
    </v-card>
  </v-flex>

</v-layout>
</v-container>

</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'Signin',
  data(){
    return{
      isFormValid:true,
      username:"",
      password:"",
      usernameRules:[
          username =>!!username || "ユーザー名を入力してください",
          username => username.length < 10 || "ユーザ名は10文字以下で入力して下さい"
      ],
      passwordRules:[
        password =>!!password || "パスワードを入力してください",
        password => password.length >= 4 || "パスワードは4文字以上で入力して下さい"
      ]
    }
  },
  computed:{
    ...mapGetters(['loading','user','error'])
  },
  watch:{
    //ユーザー情報がある場合は"/"に飛ばす
    user(value){
      if(value){
        this.$router.push("/");
      }
    }
  },
  methods:{
    handleSigninUser(){
      if (this.$refs.form.validate()){
        this.$store.dispatch('signinUser',{
          username:this.username,
          password: this.password
        })
      }
    }
  }
}
</script>

<style>
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>