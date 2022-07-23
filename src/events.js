import { Task, Store, UI } from './add_remove_update.js';

// Event: Add task To list
document.querySelector('.field-input-to-do').addEventListener('submit', (e) => {
  e.preventDefault();
  const tasks = Store.getTasks();

  // get input values
  const description = document.querySelector('.input-to-do').value;
  const completed = false;
  const index = tasks.length;

  // validations
  // Validate
  if (description === '') {
    UI.showAlert('', 'invalid');
  } else {
    // instantiate task
    const task = new Task(description, completed, index);

    // ADD task
    UI.addTasksToList(task);

    // Add task to store
    Store.addTask(task);
    // Show success message
    UI.showAlert(' ', 'success');
    // clear input field
    document.querySelector('.input-to-do').value = '';
    // document.location.reload(true); // for reloading when item is added
  }
});

let taskList = document.querySelector('.tasks');
// Event: Remove a Task
taskList.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove')) {
    // remove from UI
    UI.removeTask(e.target);
    // update storage
    const description = e.target.parentElement.parentElement.children[0].children[1].textContent;
    Store.removeTask(e.target, description);
  }
  // event: Update a task
  if (e.target.classList.contains('edit-btn')) {
    UI.updateTask(e.target);
  }
  if (e.target.classList.contains('task-checkbox')) {
    Store.updateCompletionStatus(e.target);
  }
});

/// USER INTERACTIONS
// event: clear completed
document.querySelector('.clear-completed').addEventListener('click', () => {
  // clear from loacal storage
  Store.clearCompleted();
  // TODO> CHANGE THIS TO SOMTHING THAT DO NOT RELOAD AND STILL CLEAR THE UI
  document.location.reload(true); // for reloading after clearing s completed items
});

// Load tasks
UI.displayTasks();

// after content is loaded check loacal storage if there is any completed task
document.querySelectorAll('input[type="checkbox"]').forEach((box) => {
  const tasks = Store.getTasks();
  const taskList = document.querySelectorAll('.task');
  const nodes = Array.prototype.slice.call(taskList); // convert list in array
  for (let i = 0; i < tasks.length; i += 1) {
    // iterate over tasks to find completed tasks
    const task = tasks[i].completed;
    if (tasks[i].index === nodes.indexOf(box.parentElement.parentElement)) {
      // condition if
      if (task) {
        // if task is completed
        box.setAttribute('checked', ''); // fill the check
      }
      localStorage.setItem('tasks', JSON.stringify(tasks)); // update storage
    }
  }
});

const toggler = document.querySelector('.mode-toggler');
toggler.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  document.querySelector('.ball').classList.toggle('active');
  if (localStorage.getItem('darkMode') === null) {
    localStorage.setItem('darkMode', 'true');
  } else if (localStorage.getItem('darkMode') === 'false') {
    localStorage.setItem('darkMode', 'true');
  } else if (localStorage.getItem('darkMode') === 'true') {
    localStorage.setItem('darkMode', 'false');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
    document.querySelector('.ball').classList.add('active');
  }
  if (localStorage.getItem('darkMode') === 'false') {
    document.body.classList.remove('dark');
    document.querySelector('.ball').classList.remove('active');
  }
});


// Draggging and dropping tasks
let draggables = document.querySelectorAll('.draggable');// select all tasks in UI <li> element
draggables.forEach((draggable) => {
  let draggedTask;
  let afterElement;
  let taskList = [...draggables]; // convert task <li> elements in array
  draggable.addEventListener('dragstart', () => { // dragging start
    draggable.classList.add('dragging');// add a class dragging to element
    draggedTask = Store.removeTask(draggable, draggable.children[0].children[1].textContent)
  });

  function getDragAfterElement(y) {
    let taskContainer = document.querySelector('.tasks');// Select the <ul> el
    let draggableElements = [...taskContainer.querySelectorAll('.draggable:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }
      return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }
  
let taskContainer = document.querySelector('.tasks');// Select the <ul> el
taskContainer.addEventListener('dragover', (e) => {
  e.preventDefault();
  const draggable = document.querySelector('.dragging');
  afterElement = getDragAfterElement(e.clientY);
  if (afterElement == null) {
    taskContainer.appendChild(draggable);
  } else {
    taskContainer.insertBefore(draggable, afterElement);
  }
});

draggable.addEventListener('dragend', (e) => { // dragging end
  afterElement = getDragAfterElement(e.clientY);
  console.log(taskList.indexOf(afterElement))
  let tasks = Store.getTasks();// get the tasks from local storage
  let droppedIndex;
  droppedIndex = taskList.indexOf(afterElement);// get the el. index
  console.log(droppedIndex)
  if (droppedIndex === -1) { // if element is dropped at last of list
    draggedTask[0].index = tasks.length;// index of task will be last index
    tasks.push(draggedTask[0])
    localStorage.setItem('tasks', JSON.stringify(tasks)); //update storage
    draggable.parentNode.removeChild(draggable) //remove draggable
    taskContainer.appendChild(draggable) //append to last
    draggables =  document.querySelectorAll('.draggable') //reassign draggables
    taskList = [...draggables] //reassign task list
  }
   else if(droppedIndex === 0) {//if el. dropped at first
    tasks.splice(droppedIndex,0,draggedTask[0])//drop it in tasks 
    for (let i = 0; i < tasks.length; i += 1) {
      tasks[i].index = i
    }//reindex all tasks
   localStorage.setItem('tasks', JSON.stringify(tasks)); // update storage//Working fine till here
   taskContainer.innerHTML = ''; //delete all tasks
   UI.displayTasks() //display tasks from storage
  //  document.location.reload() //!uncomment this everthing works fine
   draggable.classList.remove('dragging');// remove the class draggging
   } else {// if el. dropped in between 
    tasks.splice(droppedIndex - 1,0,draggedTask[0])
    for (let i = 0; i < tasks.length; i += 1) {
      tasks[i].index = i
    }
   localStorage.setItem('tasks', JSON.stringify(tasks)); // update storage//Working fine till here
   taskContainer.innerHTML = '';
   UI.displayTasks()
   //document.location.reload() //!uncomment this everthing works fine
   draggable.classList.remove('dragging');// remove the class draggging
   }
  });
});

