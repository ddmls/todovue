<template>
  <!-- <h1> {{ msg }} </h1> -->
  <ul>
    <li v-for="todo in sortedTodos" :key="todo.id">
      {{ todo.message }}
    </li>
  </ul>
</template>

<script>
function testTodos() {
  return [
    { id: 1, message: "Clean the house" },
    { id: 2, message: "Walk the dog" },
    { id: 3, message: "Eat food" },
    { id: 4, message: "Sleep " }
  ];
}

function sortByMessage(a,b) {
  const [x,y] = [a.message, b.message]
  if (x<y) return -1
  if (x>y) return 1
  return 0
}

export default {
  name: "TodoList",
  props: {
    msg: String
  },
  data: function() {
    const todos = testTodos()
    return {
      todos: todos,
      nTodos: todos.length,
      selection: 0,
      selectedId: 1,
    };
  },
  computed: {
    sortedTodos: function() {
      let todosCopy = this.todos.slice()
      // Assumes strings, needs a custom comparison function for numbers
      todosCopy.sort(sortByMessage)
      return todosCopy
    }
  }
};
</script>

// <!-- Add "scoped" attribute to limit CSS to this component only -->
// <style scoped lang="scss">
// h3 {
//   margin: 40px 0 0;
// }
// ul {
//   list-style-type: none;
//   padding: 0;
// }
// li {
//   display: inline-block;
//   margin: 0 10px;
// }
// a {
//   color: #42b983;
// }
//
</style>
