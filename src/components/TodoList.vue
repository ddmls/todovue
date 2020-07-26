<template>
<div> <!-- Temporary fix for single root -->

  <header class="hero is-primary is-bold">
    <div class="hero-body">
        <h1 class="title"> {{ msg }} </h1>
        <h2 class="subtitle"> {{ dateTimeFormat.format(new Date()) }} </h2>
      <div class="container"></div>
    </div>
  </header>

  <section class="section">

    <div class="field has-addons">
      <div class="control has-icons-left">
        <input class="input" type="text" placeholder="Filter"
          v-model="filterBy"
          @keyup.esc="filterBy=''"
        >
        <span class="icon is-small is-left">
          <i class="fas fa-search"></i>
        </span>
      </div>
      <a class="control" @click="filterBy=''">
        <button class="button">
          <span class="icon is-small has-text-danger">
            <i class="fas fa-ban"></i>
          </span>
        </button>
      </a>
    </div>
    <div class="field">
      <div class="control">
        <a
          class="button is-link"
          @click="newTodo">
          New
        </a>
      </div>
    </div>

    <div class="content">
      <draggable
        v-model="sortedTodos"
        ghost-class="has-background-info-light"
        animation="150"
        @choose="handleChoose"
        @start="drag=true"
        @end="drag=false">
        <div v-for="(todo,index) in sortedTodos" :key="todo.id" 
          @dblclick="editTodo(todo.id)"
          class="box"
          :class="todo.id === selectedId && 'has-background-info'"
        >
          <template v-if="todo.id === editingId">
            <div class="control">
              <input class="input" type="text"
                v-model.lazy="todo.title"
                ref="editBox"
                @keyup.enter="editingId = null"
                @focus="undoTitle = todo.title"
                @blur="editingId = null"
                @keyup.esc="editingId = null; todo.title = undoTitle"
              >
            </div>
          </template>
          <template v-else>
            <a @click="todo.done = !todo.done">
              <span class="icon has-text-black">
                <i :class="todo.done ? 'far fa-check-circle' : 'far fa-circle'"></i>
              </span>
            </a>
            <span>
            {{ todo.title }}
            </span>
            <a @click="deleteTodo(index)">
              <span class="icon has-text-danger">
                <i class="fas fa-trash"></i>
              </span>
            </a>
          </template>
        </div>
      </draggable>
    </div>

  </section>

</div>
</template>

<script>
function testTodos() {
  return [
    { id: 1, title: "Clean the house", done: false },
    { id: 2, title: "Walk the dog", done: false },
    { id: 3, title: "Eat food", done: false },
    { id: 4, title: "Sleep", done: false },
    { id: 5, title: "Φάε φαγητο", done: false },
    { id: 6, title: "Έλα ρε μεγάλε", done: false },
    { id: 7, title: "Εκείνο να πάρεις", done: false },
    { id: 8, title: "Σοβαρά μιλάμε τώρα", done: false },
    { id: 9, title: "έννοιες δεν έχω", done: false },
    { id: 10, title: "εάλλω η Πόλις", done: false },
    { id: 11, title: "don't do anything", done: false }
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

import draggable from 'vuedraggable'
// import camelCase from 'lodash/camelCase'

export default {
  name: "TodoList",
  props: {
    msg: String
  },
  components: {
    draggable,
  },
  data: function () {
    const todos = testTodos()
    return {
      todos: todos,
      selectedId: null,
      editingId: null,
      filterBy: "",
      undoTitle: null,
    };
  },
  computed: {
    sortedTodos: {
      get: function () {
        let todosCopy
        if (this.filterBy) {
          const f = filterTest(this.filterBy)
          todosCopy = this.todos.filter( a => f(a.title) )
        } else {
          todosCopy = this.todos.slice()
        }

        // todosCopy.sort( (a,b) => this.compareSort(a.title, b.title) )
        return todosCopy
      },
      set: function (newTodos) {
        // this.todos = newTodos.slice()
        // console.log(JSON.stringify(this.todos))
        const f = this.filterBy ? filterTest(this.filterBy) : null;
        for (let i = 0, j = 0; i < this.todos.length; i++) {
          if (!this.filterBy || f(this.todos[i].title)) {
            this.$set(this.todos, i, newTodos[j++])
          }
        }
      }
    }
  },
  created: function () {
    this.compareSearch = new Intl.Collator('el', { usage: 'search', sensitivity: 'base'}).compare
    // this.compareSort = new Intl.Collator('el', { usage: 'sort', sensitivity: 'case'}).compare
    // console.log(new Intl.Collator().resolvedOptions())
    this.compareSort = new Intl.Collator().compare
    this.dateTimeFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'full' })
    // console.log(caseFoldRemoveAccents("  Ε! Αμάν ΠιΆ με αυτές τις πατάτες  "))
    // console.log(camelCase('this is a test'))
  },
  methods: {
    selectTodo: function (id) {
      this.selectedId = id
      // Handled by "blur" event?
      // if (this.editingId != this.selectedId) this.editingId = null
    },
    editTodo: function (id) {
      this.editingId = id
      this.$nextTick(() => {
        this.$refs.editBox[0].focus()
      })
    },
    deleteTodo: function (index) {
      this.todos.splice(index, 1)
    },
    newTodo: function () {
      const newId = this.todos.length + 1 // Starting from 1
      this.todos.push({
        id: newId,
        title: `Edit me ${newId}`,
        done: false
      })
      this.editTodo(newId)
      console.log(newId)
    },
    handleChoose: function (evt) {
      this.selectTodo(this.todos[evt.oldIndex].id);
    }
  }
};
</script>

<style scoped lang="scss">
// li {
//   user-select: none
// }
div.box {
  // margin-bottom: 0.5rem
  margin-bottom: 0rem
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
