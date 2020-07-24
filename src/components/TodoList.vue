<template>
  <section class="section">
    <h1 class="title"> {{ msg }} </h1>
    <h2 class="subtitle"> {{ dateTimeFormat.format(new Date()) }} </h2>
    <div class="container">

      <div class="control has-icons-left">
        <input class="input" type="text" placeholder="Filter"
          v-model="filterBy"
          @keyup.esc="filterBy=''"
        >
          <span class="icon is-small is-left">
            <i class="fas fa-search"></i>
          </span>
      </div>

      <div class="content">
        <ul>
          <li v-for="todo in sortedTodos" :key="todo.id" 
            :class="todo.id === selectedId && 'has-background-info'"
            @click="selectTodo(todo.id)"
            @dblclick="editingId = todo.id"
          >
            <template v-if="todo.id === editingId">
              <div class="control">
                <input class="input" type="text"
                  v-model="todo.title"
                  @keyup.enter="editingId = null"
                  @focus="undoTitle = todo.title"
                  @keyup.esc="editingId = null; todo.title = undoTitle"
                >
              </div>
            </template>
            <template v-else>
              {{ todo.title }}
            </template>
          </li>
        </ul>
      </div>

    </div>
  </section>
</template>

<script>
function testTodos() {
  return [
    { id: 1, title: "Clean the house" },
    { id: 2, title: "Walk the dog" },
    { id: 3, title: "Eat food" },
    { id: 4, title: "Sleep" },
    { id: 5, title: "Φάε φαγητο" },
    { id: 6, title: "Έλα ρε μεγάλε" },
    { id: 7, title: "Εκείνο να πάρεις" },
    { id: 8, title: "Σοβαρά μιλάμε τώρα" },
    { id: 9, title: "έννοιες δεν έχω" },
    { id: 10, title: "εάλλω η Πόλις" },
    { id: 11, title: "don't do anything"}
  ];
}

function caseFoldRemoveAccents(str) {
  // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
  // Use uppercase to also handle final sigma
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .normalize("NFC")
    .toLocaleUpperCase()
}

function filterTest(filter) {
  // Split into words, remove extra spaces producing empty arrays
  const filterWords = caseFoldRemoveAccents(filter).split(' ').filter(x => x)
  return function(str) {
    const caseFoldedStr = caseFoldRemoveAccents(str)
    for (const word of filterWords) {
      if (caseFoldedStr.indexOf(word) == -1)
        return false
    }
    return true
  }
}

export default {
  name: "TodoList",
  props: {
    msg: String
  },
  data: function () {
    const todos = testTodos()
    return {
      todos: todos,
      nTodos: todos.length,
      selection: 0,
      selectedId: 3,
      editingId: null,
      filterBy: "",
      undoTitle: null,
    };
  },
  computed: {
    sortedTodos: function () {
      let todosCopy
      if (this.filterBy) {
        const f = filterTest(this.filterBy)
        todosCopy = this.todos.filter( a => f(a.title) )
      } else {
        todosCopy = this.todos.slice()
      }

      todosCopy.sort( (a,b) => this.compareSort(a.title, b.title) )
      return todosCopy
    }
  },
  created: function () {
    this.compareSearch = new Intl.Collator('el', { usage: 'search', sensitivity: 'base'}).compare
    // this.compareSort = new Intl.Collator('el', { usage: 'sort', sensitivity: 'case'}).compare
    // console.log(new Intl.Collator().resolvedOptions())
    this.compareSort = new Intl.Collator().compare
    this.dateTimeFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'full' })
    // console.log(caseFoldRemoveAccents("  Ε! Αμάν ΠιΆ με αυτές τις πατάτες  "))
  },
  methods: {
    selectTodo: function (id) {
      this.selectedId = id
      if (this.editingId != this.selectedId) this.editingId = null
    }
  }
};
</script>

<style scoped lang="scss">
li {
  user-select: none
}
</style>

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
