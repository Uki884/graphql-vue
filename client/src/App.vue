<template>
  <v-app style="background: #E3E3EE">
    <!-- side-navbar -->
    <v-content>
    <!-- navbar -->
    <Navbar></Navbar>
    <!-- app contente-->
    <main>
      <v-container class="mt-4">
        <transition name="fade">
          <router-view/>
        </transition>
      </v-container>
      <v-snackbar v-model='authSnackbar' color="success" :timeout="5000">
          <v-icon class="mr-3">check_circle</v-icon>
          <h3>ログインしました</h3>
          <v-btn text @click="authSnackbar = false">Close</v-btn>
      </v-snackbar>

      <v-snackbar v-if="authError" v-model='authErrorSnackbar' color="info" :timeout="5000">
          <v-icon class="mr-3">cancel</v-icon>
          <h3>{{authError.message}}</h3>
          <v-btn text to="/signin">ログイン</v-btn>
      </v-snackbar>

    </main>
    </v-content>
  </v-app>
</template>

<script>
  import Navbar from "@/components/Navbar";
  import {mapGetters} from 'vuex';

export default {
  name: 'App',
  components:{
    Navbar
  },
  data(){
    return{
      authSnackbar: false,
      authErrorSnackbar: false,
    }
  },
  computed:{
    ...mapGetters(['authError','user']),
  },
  watch:{
    user(newValue,oldValue){
      if (oldValue === null){
        this.authSnackbar = true
      }
    },
    authError(Value){
      if (Value !== null){
        this.authErrorSnackbar = true
      }
    }

  }

};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active{
  transition-property:all;
  transition-duration: 0.25s;
}

.fade-enter-active{
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active{
  opacity: 0;
  transform: translateX(-25px);
}

</style>
