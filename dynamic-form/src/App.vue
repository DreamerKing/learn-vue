<template>
  <div id="app">
    <!-- <ChargeRule /> -->
    <DynamicForm />
    <!-- <FormTable /> -->
  </div>
</template>

<script>
import DynamicForm from "./ChargeRule/DynamicForm";
// import FormTable from "./ChargeRule/FormTable";
import ChargeRule from "./chargeRules2";
export default {
  name: "App",
  components: {
    DynamicForm,
    // FormTable,
    // ChargeRule,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
