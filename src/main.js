import { createApp } from 'vue';
import './style.css'
import App from './App.vue'

const app = createApp(App)
const app2 = app.mount('#app');
app.config.errorHandler = (e) => {
  console.error(e.message);
}

/* 
const { createApp } = Vue;

const app = createApp({
  data() {
    return { count: 0 }
  }
});
app.mount('#app'); 
*/


