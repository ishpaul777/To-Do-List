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

const taskList = document.querySelector('.tasks');

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
//Draggging and dropping tasks
const draggables = document.querySelectorAll('.draggable');//select all tasks in UI <li> element

const taskContainer = document.querySelector('.tasks');//Select the <ul> el
draggables.forEach((draggable) => {
  let draggedElement; //element to be dragged
  let draggedTask; //task in storge that to be dragged
  let tasks = Store.getTasks()//get the tasks from local storage
  let taskList = [...draggables] //convert task <li> elements in array
  draggable.addEventListener('dragstart', () => {//dragging start
    draggable.classList.add('dragging');//add a class dragging to element
    for(let i = 0;i<tasks.length;i++){//loop through task
      if(taskList.indexOf(draggable) === tasks[i].index){//index of draggable el. = task index(every task in local storage has a index property) 
        draggedTask  = tasks.splice(i,1);//tasks will be spliced from tasks in local storage 
        draggedElement = taskList.splice(i,1);//taslist will be spliced
      }
    }
    for (let i = 0; i < tasks.length; i += 1) {
      tasks[i].index = i;
    }//all the tasks in storage will assign a new index as one el. is removed
    localStorage.setItem('tasks', JSON.stringify(tasks)); // update storage 
  });
  draggable.addEventListener('dragend', (e) => {//dragging end
    let droppedIndex;//for getting the index
    let afterElement = getDragAfterElement(e.clientY)//this function get the el. after where it is dropped 
    droppedIndex = taskList.indexOf(afterElement)//get the el. index
    if(afterElement === undefined){//if element is droppen at last of list
      draggedTask[0].index = tasks.length//index of task will be last index 
      tasks.push(draggedTask[0])//push the task
      taskList.push(draggedElement[0])//push the to taskList 
      localStorage.setItem('tasks', JSON.stringify(tasks)); // update storage//Working fine till here 
    }else{//if there is a afterEl.
      tasks.splice(droppedIndex,0,draggedTask[0])//enter in between storage
      taskList.splice(droppedIndex,0,draggedElement[0])//enter in between taskList
      for (let i = 0; i < tasks.length; i += 1) {//reindex all task in storage
        tasks[i].index = i;
      }
      localStorage.setItem('tasks', JSON.stringify(tasks)); // update storage
    }
    draggable.classList.remove('dragging');//remove the class draggging
  });
});

function getDragAfterElement(y) {
  const draggableElements = [...taskContainer.querySelectorAll('.draggable:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    }
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

taskContainer.addEventListener('dragover', (e) => {
  e.preventDefault();
  const afterElement = getDragAfterElement(e.clientY);
  const draggable = document.querySelector('.dragging');
  if (afterElement == null) {
    taskContainer.appendChild(draggable);
  } else {
    taskContainer.insertBefore(draggable, afterElement);
  }
});


