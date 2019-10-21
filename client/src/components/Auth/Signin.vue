<template>
<v-container class="text-center" mt-5 pt-5>
<v-layout row wrap>
<v-flex xs12 sm6 offset-sm3>
  <h1>Welcome Back!</h1>
</v-flex>
</v-layout>

<v-layout row wrap>
  <v-flex xs12 sm6 offset-sm3>
    <v-card>
      <v-container>
        <v-form @submit.prevent="handleSigninUser">
          <v-layout row px-5>
            <v-flex xs12>
              <v-text-field v-model="username" prepend-icon="face" label="username" type="text" required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row px-5>
            <v-flex xs12>
              <v-text-field v-model="password" prepend-icon="extension" label="password" type="password" required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row px-5>
            <v-flex xs12>
              <v-btn color="accent" type="submit">ログイン</v-btn>
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
export default {
  name: 'Signin',
  data(){
    return{
      username:"",
      password:""
    }
  },
  methods:{
    handleSigninUser(){
      this.$store.dispatch('signinUser',{
        username:this.username,
        password: this.password
      })
    }
  }
}
</script>