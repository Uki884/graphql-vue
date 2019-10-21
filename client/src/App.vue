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
    </main>
    </v-content>
  </v-app>
</template>

<script>
  import Navbar from "@/components/Navbar";

export default {
  name: 'App',
  components:{
    Navbar
  },

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
