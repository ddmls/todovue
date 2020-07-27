<template>
  <section class="section">
  <!-- <div class="container is-fluid"> -->

  <nav class="panel">
    <p class="panel-heading">
      {{ msg }}
    </p>

    <div class="panel-block">
      <div class="control has-icons-left">
        <input class="input" type="text" placeholder="Φίλτρο"
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

    <p class="panel-tabs">
      <a class="is-active">All</a>
      <a>Public</a>
      <a>Private</a>
      <a>Sources</a>
      <a>Forks</a>
    </p>

    <a class="panel-block">
        <button
          class="button is-link is-outlined"
          @click="newTodo">
          Νέο
        </button>
    </a>

    <draggable
      v-model="sortedTodos"
      ghost-class="has-background-info-light"
      animation="150"
      @choose="handleChoose"
      @start="drag=true"
      @end="drag=false">
      <div v-for="(todo,index) in sortedTodos" :key="todo.id" 
        class="panel-block"
        :class="todo.id === selectedId && 'has-background-info'"
        @dblclick="editTodo(todo.id)"
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
          <div class="columns is-mobile">
            <div class="column is-narrow">
              <a @click="todo.done = !todo.done">
                <span class="icon has-text-black">
                  <i :class="todo.done ? 'far fa-check-circle' : 'far fa-circle'"></i>
                </span>
              </a>
            </div>
            <div class="column">
              <span :class="todo.done && 'has-text-grey-light is-done'">
              {{ todo.title }}
              </span>
            </div>
            <div class="column is-narrow">
              <a @click="deleteTodo(index)">
                <span class="icon has-text-danger">
                  <i class="fas fa-trash"></i>
                </span>
              </a>
            </div>
          </div>
        </template>
      </div>
    </draggable>

  </nav>

  <!-- </div> -->
  </section>

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
      maxId: 0
    };
  },
  computed: {
    sortedTodos: {
      get: function () {
        let todosCopy
        if (this.filterBy) {
          const f = filterTest(this.filterBy)
          todosCopy = this.todos.filter( a => f(a.title) || this.isEdited(a) )
        } else {
          todosCopy = this.todos.slice()
        }

        // todosCopy.sort( (a,b) => this.compareSort(a.title, b.title) )
        return todosCopy
      },
      set: function (newTodos) {
        const f = this.filterBy ? filterTest(this.filterBy) : null;
        for (let i = 0, j = 0; i < this.todos.length; i++) {
          if (!this.filterBy || f(this.todos[i].title) || this.isEdited(this.todos[i])) {
            this.$set(this.todos, i, newTodos[j++])
          }
        }
      }
    }
  },
  created: function () {
    // Find maxId of todos
    let maxId = 0
    for (const todo of this.todos) {
      if (todo.id > maxId) maxId = todo.id
    }
    this.maxId = maxId
  },
  methods: {
    selectTodo: function (id) {
      this.selectedId = id
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
      this.maxId++
      const newId = this.maxId
      this.todos.push({
        id: newId,
        title: `Edit me ${newId}`,
        done: false
      })
      this.editTodo(newId)
    },
    handleChoose: function (evt) {
      this.selectTodo(this.todos[evt.oldIndex].id);
    },
    isEdited: function (todo) {
      return todo.id === this.editingId
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
div.box {
  // margin-bottom: 0.5rem;
  margin-bottom: 0rem;
}

.is-done {
  text-decoration: line-through;
}
</style>
