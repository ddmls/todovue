<template>
  
  <!-- <div class="container is-fluid"> -->

  <nav class="panel is-primary">
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
            class="button is-link"
            @click="newTodo">
            <span class="icon is-small">
              <i class="fas fa-plus"></i>
            </span>
          </a>
        </p>
      </div>
    </div>

    <p class="panel-tabs">
      <a
        :class="{ 'is-active': filterBy.done === null && filterBy.minPriority === priority.LOW }"
        @click="filterBy.done = null; filterBy.minPriority = priority.LOW"
      >
      Όλα
      </a>
      <a
        :class="{ 'is-active': filterBy.done === false }"
        @click="filterBy.done = false"
      >
      Να γίνουν
      </a>
      <a
        :class="{ 'is-active': filterBy.done === true }"
          @click="filterBy.done = true"
      >
      Έγιναν
      </a>
      <a
        :class="{ 'is-active': filterBy.minPriority === priority.HIGH }"
        @click="filterBy.minPriority = filterBy.minPriority === priority.HIGH ? priority.NORMAL : priority.HIGH"
      >
      Σημαντικά
      </a>
      <a
        :class="{ 'is-active': filterBy.minPriority === priority.LOW }"
        @click="filterBy.minPriority = filterBy.minPriority === priority.LOW ? priority.NORMAL : priority.LOW"
      >
      Θα δούμε
      </a>
      <a
        :class="{ 'is-active': someDone }"
        @click="deleteDone"
      >
      Εκκαθάριση
      </a>
    </p>

    <draggable
      v-model="sortedTodos"
      ghost-class="has-background-info-light"
      animation="150"
      :disabled="false"
    >
      <transition-group type="transition" name="flip-list">
        <div v-for="todo in sortedTodos" :key="todo.id"
          class="panel-block"
          :class="{ 'is-active': todo.id === selectedId, 'todo-priority-low': todo.priority ===  priority.LOW, 'todo-priority-high': todo.priority === priority.HIGH }"
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
              {{ todo.title }}
            </span>

            <transition name="fade">
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
            </transition>

          </template>

        </div>
      </transition-group>
    </draggable>

  </nav>

  <!-- </div> -->

</template>

<script>
function caseFoldRemoveAccents(str) {
  // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
  // Use uppercase to also handle final sigma
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .normalize("NFC")
    .toLocaleUpperCase()
}

const saveDelay = 2000

import { priority } from '../todoModel.js'
import { loadFromLocalStorage, saveToLocalStorage, registerStorageHandler, unregisterStorageHandler } from '../storage.js'
import draggable from 'vuedraggable'
import debounce from 'lodash/debounce'

export default {
  name: "TodoList",
  props: {
    msg: String,
    todosName: String,
  },
  components: {
    draggable,
  },
  data: function () {
    return {
      todos: loadFromLocalStorage(this.todosName),
      selectedId: null,
      editingId: null,
      filterBy: { text: "", done: null, minPriority: priority.NORMAL },
      undoTitle: null,
      maxId: 0,
      priority: priority,
    };
  },
  computed: {
    filterTest: function () {
      // Split into words, remove extra spaces producing empty arrays
      const filterWords = caseFoldRemoveAccents(this.filterBy.text).split(' ').filter(x => x)
      // if (filterWords.length === 0) return function(todo) { return true } // eslint-disable-line no-unused-vars
      return function(todo) {
        if (this.filterBy.done != null && todo.done != this.filterBy.done) return false
        if (todo.priority > this.filterBy.minPriority) return false

        const caseFoldedStr = caseFoldRemoveAccents(todo.title)
        for (const word of filterWords) {
          if (caseFoldedStr.indexOf(word) == -1)
            return false
        }
        return true
      }
    },
    sortedTodos: {
      get: function () {
        const todosCopy = this.todos.filter( todo => this.filterTest(todo) || this.isEdited(todo) )

        // todosCopy.sort( (a,b) => this.compareSort(a.title, b.title) )
        return todosCopy
      },
      set: function (newTodos) {
        let i = 0
        this.todos = this.todos.map(todo => {
          if (this.filterTest(todo) || this.isEdited(todo)) {
            return newTodos[i++]
          } else {
            return todo
          }
        })
      }
    },
    someDone() {
      return this.todos.some(todo => todo.done)
    }
  },
  watch: {
    todos: {
      deep: true,
      handler: function (val) {
        this.debouncedSave(this.todosName, val)
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

    // Debounced save to localStorage
    this.debouncedSave = debounce(saveToLocalStorage, saveDelay)
    window.addEventListener('beforeunload', this.onBeforeUnload)
    // Notified when there are changes in other tabs
    registerStorageHandler(this.todosName, this.onStorage)
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.onBeforeUnload)
    unregisterStorageHandler(this.todosName, this.onStorage)
  },
  methods: {
    onBeforeUnload() {
      this.debouncedSave.flush()
    },
    onStorage(newTodos) {
      this.todos = newTodos
      // Skip the first automatically triggered save-after-load
      const realDebouncedSave = this.debouncedSave
      this.debouncedSave = function() {
        this.debouncedSave = realDebouncedSave
      }
    },
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
    },
    deleteDone() {
      this.todos = this.todos.filter(todo => !todo.done)
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
  background-color: whitesmoke;
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

// div.panel-block {
//   transition: background-color 0.25s ease-out, color 0.25s ease-out;
// }

.fade-enter-active {
  transition: opacity 1s ease;
}

.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

// ??? 
// https://github.com/SortableJS/Vue.Draggable/blob/master/example/components/transition-example.vue
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}

// ???
// https://vuejs.org/v2/guide/transitions.html#Transitioning-Between-Elements
.flip-list-enter-active, .flip-list-leave-active {
  transition: all 1s ease;
}

.flip-list-leave-active {
  position: absolute;
}

.flip-list-enter, .flip-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

</style>
