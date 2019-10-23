<template>
    <v-container class="text-center" mt-5 pt-5>
  <v-layout row wrap>
    <v-flex xs12 sm6 offset-sm3>
      <h1>アカウント登録</h1>
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
        <v-form v-model="isFormValid" @submit.prevent="handleSignupUser" lazy-validation ref="form">
          <v-layout row px-5>
            <!-- ユーザ名 -->
            <v-flex xs12>
              <v-text-field :rules="usernameRules" v-model="username" prepend-icon="face" label="username" type="text" required></v-text-field>
            </v-flex>
          </v-layout>
          <!-- メールアドレス -->
          <v-layout row px-5>
            <v-flex xs12>
              <v-text-field :rules="emailRules" v-model="email" prepend-icon="email" label="email" type="email" required></v-text-field>
            </v-flex>
          </v-layout>
          <!-- パスワード -->
          <v-layout row px-5>
            <v-flex xs12>
              <v-text-field :rules="passwordRules" v-model="password" prepend-icon="extension" label="password" type="password" required></v-text-field>
            </v-flex>
          </v-layout>
          <!-- パスワード確認 -->
          <v-layout row px-5>
            <v-flex xs12>
              <v-text-field :rules="passwordRules" v-model="passwordConfirmation" prepend-icon="gavel" label="confirm password" type="password" required></v-text-field>
            </v-flex>
          </v-layout>
          <!-- 登録ボタン -->
          <v-layout row px-5>
            <v-flex xs12>
              <v-btn :loading="loading" :disabled="!isFormValid || loading " color="info" type="submit">登録</v-btn>
              <h5 style="margin-top:12px;">アカウントを既に持っていますか？
              <router-link to="/signin">ログイン</router-link>
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
  name: 'Signup',
  data(){
    return{
      isFormValid:true,
      username:"",
      email:"",
      password:"",
      passwordConfirmation:"",
      usernameRules:[
        username =>!!username || "ユーザー名を入力してください",
        username => username.length < 10 || "ユーザ名は10文字以下で入力して下さい"
      ],
      emailRules:[
        email => !!email || "メールアドレスを入力してください",
        email => /.@+./.test(email) || "メールアドレスの形式が間違っています"

      ],
      passwordRules:[
        password =>!!password || "パスワードを入力してください",
        password => password.length >= 4 || "パスワードは4文字以上で入力して下さい",
        confirmation => confirmation === this.password || "同じパスワードを入力してください"
      ],

    }
  },
  watch:{
    user(value){
      if(value){
        this.$router.push("/");
      }
    }
  },
  computed:{
    ...mapGetters(['loading','error','user'])
  },
  methods:{
    handleSignupUser(){
      if (this.$refs.form.validate()){
        this.$store.dispatch('signupUser',{
          username: this.username,
          email: this.email,
          password: this.password,
        });
      }
    }
  }
}
</script>