import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify,
  {
    theme:{
    primary:'#009688',
    secondary: "#4caf50",
    accent: "#e91e63",
    error: "#f44336",
    warning: "#ffc107",
    info: "#2196f3",
    success: "#8bc34a"
}
});

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
});
