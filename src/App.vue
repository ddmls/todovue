<template>
  <div id="app">
    <DaySummary msg="Τι θα κάνω σήμερα"/>
    <section class="section">
      <TodoList msg="Τεστ" :todos-src=todos :key=key />
    </section>
  </div>
</template>

<script>
import TodoList from './components/TodoList.vue'
import DaySummary from './components/DaySummary.vue'
import { loadFromLocalStorage, registerStorageHandler } from './storage.js'

export default {
  name: 'App',
  components: {
    TodoList,
    DaySummary
  },
  data: function () {
    return {
      todos: loadFromLocalStorage(),
      key: 0
    }
  },
  created: function () {
    registerStorageHandler('todos', this.onStorage)
  },
  methods: {
    onStorage: function(newTodos) {
      this.todos = newTodos
      this.key++
    }
  },
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
