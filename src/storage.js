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

// NOTE: There is one handler per key
// A new handler for the same key overwrites the previous one
// If we need many handlers per key (same list displayed many times) it must be key => [handler1, ...]

export function registerStorageHandler(key, handler) {
  storageHandlers[key] = handler
}

export function unregisterStorageHandler(key, handler) {
  if (storageHandlers[key] === handler)
    delete storageHandlers[key]
}

// Listen for storage save events on other tabs
window.addEventListener('storage', e => {
  const handler = storageHandlers[e.key]
  if ( typeof handler === 'function') {
    console.log('Reloading')
    handler(JSON.parse(e.newValue))
  }
})
