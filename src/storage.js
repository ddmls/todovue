import testData from './testData.js'

const localStorageKey = 'todos'

const storageHandlers = {}

export function loadFromLocalStorage() {
  try {
    const json = localStorage.getItem(localStorageKey)
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

export function saveToLocalStorage(todos) {
  const json = JSON.stringify(todos)
  try {
    localStorage.setItem(localStorageKey, json)
    console.log(`SAVED! ${json}`)
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
