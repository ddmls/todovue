import testData from './testData.js'

export function loadFromLocalStorage() {
  try {
    const json = localStorage.getItem('todos')
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