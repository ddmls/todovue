<template>
  
  <!-- <div class="container is-fluid"> -->

  <nav class="panel is-warning">
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
      <a class="is-active">Όλα</a>
      <a>Να γίνουν</a>
      <a>Έγιναν</a>
      <a>Σημαντικά</a>
      <a>Θα δούμε</a>
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
    >
      <div v-for="(todo,index) in sortedTodos" :key="todo.id" 
        class="panel-block"
        :class="[{ 'is-active': todo.id === selectedId }, { 'has-text-grey': todo.priority ===  priority.LOW }, { 'has-background-danger-light': todo.priority === priority.HIGH }]"
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
          <span class="panel-icon" @click="checkTodo(todo, index)">
            <i :class="todo.done ? 'far fa-check-circle' : 'far fa-circle'"></i>
          </span>
          <span :class="todo.done && 'has-text-grey-light is-done'">
            {{ todo.title }}
          </span>

          <div class="todo-toolbox" v-show="todo.id === selectedId">
            <a @click="todo.priority = todo.priority === priority.HIGH ? priority.NORMAL : priority.HIGH">
              <span class="icon has-text-warning">
                <i class="fas fa-star"></i>
              </span>
            </a>
            <a @click="todo.priority = todo.priority === priority.LOW ? priority.NORMAL : priority.LOW">
              <span class="icon has-text-grey">
                <i class="fas fa-thumbs-down"></i>
              </span>
            </a>
            <a @click="deleteTodo(index)">
              <span class="icon has-text-danger">
                <i class="fas fa-trash"></i>
              </span>
            </a>
          </div>

        </template>

      </div>
    </draggable>

  </nav>

  <!-- </div> -->

</template>

<script>
const priority = {
  HIGH: -1,
  NORMAL: 0,
  LOW: 1,
}

function testTodos() {
  return [
    { id: 1, title: "Clean the house", done: false, priority: priority.NORMAL },
    { id: 2, title: "Walk the dog", done: false, priority: priority.NORMAL },
    { id: 3, title: "Eat food", done: false, priority: priority.NORMAL },
    { id: 4, title: "Sleep", done: false, priority: priority.NORMAL },
    { id: 5, title: "Φάε φαγητο", done: false, priority: priority.NORMAL },
    { id: 6, title: "Έλα ρε μεγάλε", done: false, priority: priority.NORMAL },
    { id: 7, title: "Εκείνο να πάρεις", done: false, priority: priority.NORMAL },
    { id: 8, title: "Σοβαρά μιλάμε τώρα", done: false, priority: priority.NORMAL },
    { id: 9, title: "έννοιες δεν έχω", done: false, priority: priority.NORMAL },
    { id: 10, title: "εάλλω η Πόλις", done: false, priority: priority.NORMAL },
    { id: 11, title: "don't do anything", done: false, priority: priority.NORMAL },
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
      maxId: 0,
      priority: priority
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
      this.todos.unshift({
        id: newId,
        title: `Νέο ${newId}`,
        done: false,
        priority: priority.NORMAL
      })
      this.editTodo(newId)
    },
    handleChoose: function (evt) {
      this.selectTodo(this.todos[evt.oldIndex].id);
    },
    isEdited: function (todo) {
      return todo.id === this.editingId
    },
    checkTodo: function (todo, index) {
      this.todos.splice(index, 1)
      if (!todo.done) {
        this.todos.push(todo)
      } else {
        this.todos.unshift(todo)
      }
      todo.done = !todo.done
      this.selectedId = null
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
// div.box {
//   // margin-bottom: 0.5rem;
//   margin-bottom: 0rem;
// }

.is-done {
  text-decoration: line-through;
}

.todo-toolbox {
  margin-left: auto;
}
</style>
