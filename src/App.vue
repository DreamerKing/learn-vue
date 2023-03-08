<script setup>
import { ref } from 'vue';
import CustomInput from './components/CustomInput.vue';
const test = ref('hello world');

const fatherClick = () => {
  console.log('father Component clicked')
}
// import HelloWorld from './components/HelloWorld.vue'
// import ReactiveComponet from './components/ReactiveComponet2.vue';
</script>

<template>
  <!-- <ReactiveComponet /> -->
  <CustomInput v-model:name.captial="test" class="test" test="haha" @click="fatherClick" @change="fatherClick"
    data-k="hi"></CustomInput>
  <!-- <HelloWorld msg="Vite + Vue" /> -->
</template>

