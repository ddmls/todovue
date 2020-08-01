<template>
  
  <!-- <div class="container is-fluid"> -->

  <nav class="panel is-warning">
    <p class="panel-heading">
      {{ msg }}
    </p>

    <div class="panel-block">
      <div class="field has-addons">
        <p class="control has-icons-left has-icons-right is-expanded">
          <input class="input" type="text" placeholder="Φίλτρο"
            v-model="filterBy.text"
            @keyup.esc="filterBy.text=''"
          >
          <span class="icon is-small is-left">
            <i class="fas fa-search"></i>
          </span>
          <span
            class="icon is-small is-right is-clickable has-text-danger"
            @click="filterBy.text=''" v-show="filterBy.text"
          >
            <i class="fas fa-ban"></i>
          </span>
         </p>
        <p class="control">
          <a
            class="button is-link is-outlined"
            @click="newTodo">
            <span class="icon is-small">
              <i class="fas fa-plus"></i>
            </span>
          </a>
        </p>
      </div>
    </div>

    <p class="panel-tabs">
      <a class="is-active">Όλα</a>
      <a>Να γίνουν</a>
      <a>Έγιναν</a>
      <a>Σημαντικά</a>
      <a>Θα δούμε</a>
    </p>

    

    <draggable
      v-model="sortedTodos"
      ghost-class="has-background-info-light"
      animation="150"
      :disabled="false"
    >
      <div v-for="todo in sortedTodos" :key="todo.id"
        class="panel-block"
        :class="[{ 'is-active': todo.id === selectedId }, { 'has-text-grey': todo.priority ===  priority.LOW }, { 'has-background-danger-light': todo.priority === priority.HIGH }]"
        @click="!isEdited(todo) && checkTodo(todo)"
        @mouseover="selectedId = todo.id"
        @mouseout="selectedId = null"
      >
        <template v-if="isEdited(todo)">
          <div class="control has-icons-right">
            <input class="input" type="text"
              v-model="todo.title"
              ref="editBox"
              @keyup.enter="acceptEditTodo"
              @keyup.esc="cancelEditTodo(todo)"
            >
              <span
                class="icon is-small is-right is-clickable has-text-info"
                @click.stop="cancelEditTodo(todo)"
              >
                <i class="fas fa-undo"></i>
              </span>
          </div>
        </template>

        <template v-else>
          <span class="panel-icon fa-lg">
            <i :class="todo.done ? 'far fa-check-circle has-text-success' : 'far fa-circle'"></i>
          </span>
          <span :class="todo.done && 'has-text-grey-light is-done'">
            {{ todo.id }} {{ todo.title }}
          </span>

          <div class="todo-toolbox" v-show="todo.id === selectedId">
            <a @click.stop="editTodo(todo)">
              <span class="icon">
                <i class="fas fa-edit has-text-black"></i>
              </span>
            </a>
            <a @click.stop="todo.priority = todo.priority === priority.HIGH ? priority.NORMAL : priority.HIGH">
              <span class="icon has-text-warning">
                <i class="fas fa-star"></i>
              </span>
            </a>
            <a @click.stop="todo.priority = todo.priority === priority.LOW ? priority.NORMAL : priority.LOW">
              <span class="icon has-text-grey">
                <i class="fas fa-thumbs-down"></i>
              </span>
            </a>
            <a @click.stop="deleteTodo(todo)">
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
      filterBy: { text: "" },
      undoTitle: null,
      maxId: 0,
      priority: priority
    };
  },
  computed: {
    filterTest: function () {
      // Split into words, remove extra spaces producing empty arrays
      const filterWords = caseFoldRemoveAccents(this.filterBy.text).split(' ').filter(x => x)
      if (filterWords.length === 0) return function(str) { return true } // eslint-disable-line no-unused-vars
      return function(str) {
        const caseFoldedStr = caseFoldRemoveAccents(str)
        for (const word of filterWords) {
          if (caseFoldedStr.indexOf(word) == -1)
            return false
        }
        return true
      }
    },
    sortedTodos: {
      get: function () {
        const todosCopy = this.todos.filter( a => this.filterTest(a.title) || this.isEdited(a) )

        // todosCopy.sort( (a,b) => this.compareSort(a.title, b.title) )
        return todosCopy
      },
      set: function (newTodos) {
        let i = 0
        this.todos = this.todos.map(todo => {
          if (this.filterTest(todo.title) || this.isEdited(todo)) {
            return newTodos[i++]
          } else {
            return todo
          }
        })
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
    // selectTodo: function (todo) {
    //   this.selectedId = todo.id
    // },
    editTodo: function (todo) {
      this.editingId = todo.id
      this.undoTitle = todo.title
      this.$nextTick(() => {
        this.$refs.editBox[0].focus()
      })
    },
    cancelEditTodo: function (todo) {
      this.editingId = null
      todo.title = this.undoTitle
    },
    acceptEditTodo: function () {
      this.editingId = null
      this.undoTitle = null
    },
    deleteTodo: function (todo) {
      // We can't use the index of v-for because it's the index in the filtered list. We need the index in the original list.
      const index = this.todos.findIndex(t => t.id === todo.id)
      this.todos.splice(index, 1)
    },
    newTodo: function () {
      this.maxId++
      const newTodo = {
        id: this.maxId,
        title: 'Νέο',
        done: false,
        priority: priority.NORMAL
      }
      this.todos.unshift(newTodo)
      this.editTodo(newTodo)
    },
    // handleChoose: function (evt) {
    //   this.selectTodo(this.todos[evt.oldIndex]);
    // },
    isEdited: function (todo) {
      return todo.id === this.editingId
    },
    checkTodo: function (todo) {
      const index = this.todos.findIndex(t => t.id === todo.id)
      this.todos.splice(index, 1)
      if (!todo.done) {
        this.todos.push(todo)
      } else {
        this.todos.unshift(todo)
      }
      todo.done = !todo.done
      // this.selectedId = null
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

div.panel-block:hover {
  background-color: hsl(150, 14%, 91%)
}

// .control .button.is-inside {
//   position: absolute;
//   right: 0;
//   z-index: 4;
//   // pointer-events: auto;
//   background: transparent;
//   &, &:focus {
//       border-color:transparent;
//   }
//   &:focus {
//       box-shadow: none;
//   }
// }

.control .icon.is-clickable {
  pointer-events: auto;
  cursor: pointer;
}

// bulma/sass/components/panel.sass for .panel-block > .control
.panel-block > .field {
  flex-grow: 1;
  flex-shrink: 1;
  width: 100%;
}

</style>
