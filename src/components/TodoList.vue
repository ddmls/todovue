<template>
  <section class="section">
    <h1 class="title"> {{ msg }} </h1>
    <div class="container">

      <div class="control has-icons-left">
        <input class="input" type="text" placeholder="Filter"
          v-model="filterBy">
          <span class="icon is-small is-left">
            <i class="fas fa-search"></i>
          </span>
      </div>

      <div class="content">
        <ul>
          <li v-for="todo in sortedTodos" :key="todo.id" :class="todo.id === selectedId && 'has-background-info'">
            {{ todo.message }}
          </li>
        </ul>
      </div>

    </div>
  </section>
</template>

<script>
function testTodos() {
  return [
    { id: 1, message: "Clean the house" },
    { id: 2, message: "Walk the dog" },
    { id: 3, message: "Eat food" },
    { id: 4, message: "Sleep" },
    { id: 5, message: "Φάε φαγητο" },
    { id: 6, message: "Έλα ρε μεγάλε" },
    { id: 7, message: "Εκείνο να πάρεις" },
    { id: 8, message: "Σοβαρά μιλάμε τώρα" },
    { id: 9, message: "έννοιες δεν έχω" },
    { id: 10, message: "εάλλω η Πόλις" },
  ];
}

// function sortByMessage(a,b) {
//   const [x,y] = [a.message, b.message]
//   if (x<y) return -1
//   if (x>y) return 1
//   return 0
// }

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
      selectedId: 3,
      shit: true,
      filterBy: ""
    };
  },
  computed: {
    sortedTodos: function() {
      let todosCopy = this.filterBy ? 
        this.todos.filter( a => a.message.indexOf(this.filterBy) != -1 ) : 
        this.todos.slice()

      // Assumes strings, needs a custom comparison function for numbers
      todosCopy.sort( (a,b) => this.compareSort(a.message, b.message) )
      return todosCopy
    }
  },
  created: function() {
    this.compareSearch = new Intl.Collator('el', { usage: 'search', sensitivity: 'base'}).compare
    // this.compareSort = new Intl.Collator('el', { usage: 'sort', sensitivity: 'case'}).compare
    this.compareSort = new Intl.Collator().compare
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
