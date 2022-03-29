import { createApp } from "vue";
// import App from './App.vue'
// import Counter from "./components/Counter.vue";

const Counter = {
  data() {
    return {
      counter: 0,
    };
  },
  method: {
    increase() {
      this.counter += 1;
    },
  },
};

createApp(Counter).mount("#app");
