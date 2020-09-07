 import { priority } from './todoModel.js'
 
 const testData = [
      { id: 1, title: "Clean the house", done: false, priority: priority.NORMAL },
      { id: 2, title: "Walk the dog", done: false, priority: priority.NORMAL },
      { id: 3, title: "Eat food", done: false, priority: priority.NORMAL },
      { id: 4, title: "Sleep", done: false, priority: priority.NORMAL },
      { id: 5, title: "Φάε φαγητό", done: false, priority: priority.NORMAL },
      { id: 6, title: "Πάρε τηλέφωνο", done: false, priority: priority.HIGH },
      { id: 7, title: "Στείλε το email", done: false, priority: priority.NORMAL },
      { id: 8, title: "Πήγαινε εκεί", done: false, priority: priority.LOW },
      { id: 9, title: "Έλα εδώ", done: false, priority: priority.LOW },
      { id: 10, title: "Διάβασε τις σημειώσεις", done: false, priority: priority.NORMAL },
      { id: 11, title: "Upload to Github", done: true, priority: priority.NORMAL },
    ]

export default testData