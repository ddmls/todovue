<template>
  <div id="app">
    <DaySummary msg="Τι θα κάνω σήμερα"/>
    <section class="section">
      <TodoList msg="Τεστ"/>
    </section>
  </div>
</template>

<script>
import TodoList from './components/TodoList.vue'
import DaySummary from './components/DaySummary.vue'

export default {
  name: 'App',
  components: {
    TodoList,
    DaySummary
  }
}
</script>

// <style lang="scss">
// #app {
//   font-family: Avenir, Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
//   margin-top: 60px;
// }
// </style>
