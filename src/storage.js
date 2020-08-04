import testData from './testData.js'

// const localStorageKey = 'todos'

const storageHandlers = {}

export function loadFromLocalStorage(key) {
  try {
    const json = localStorage.getItem(key)
    if (json) {
      return JSON.parse(json)
    }
  }
  catch (e) {
    console.log(`Could not load, error code ${e.code}, name ${e.name}`)
  }
  console.log('No saved data, using test data')
  return testData
}

export function saveToLocalStorage(key, todos) {
  const json = JSON.stringify(todos)
  try {
    localStorage.setItem(key, json)
    console.log('SAVED!')
  }
  catch (e) {
    console.log(`Could not save, error code ${e.code}, name ${e.name}`)
  }
}

export function registerStorageHandler(key, handler) {
  storageHandlers[key] = handler
}

// Listen for storage save events on other tabs
window.addEventListener('storage', e => {
  const handler = storageHandlers[e.key]
  if ( typeof handler === 'function') {
    console.log('Reloading')
    handler(JSON.parse(e.newValue))
  }
})
