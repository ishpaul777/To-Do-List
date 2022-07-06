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
    document.location.reload(true); // for reloading when item is added
  }
});

// Event: Remove a Task
document.querySelector('.tasks').addEventListener('click', (e) => {
  if (e.target.classList.contains('remove')) {
    // remove from UI
    UI.removeTask(e.target);
    // update storage
    const description = e.target.parentElement.parentElement.children[0].children[1].textContent;
    Store.removeTask(e.target, description);
  }
});

// event: Update a task
const taskList = document.querySelector('.tasks');
taskList.addEventListener('click', (e) => {
  if (e.target.classList.contains('edit-btn')) {
    UI.updateTask(e.target);
  }
});

/// USER INTERACTIONS
// event: clear completed
document.querySelector('.clear-completed').addEventListener('click', () => {
  // clear from loacal storage
  Store.clearCompleted();
  document.location.reload(true); // for reloading after clearing s completed items
});

// Load tasks
UI.displayTasks();

  //after content is loaded check loacal storage if there is any completed task
  document.querySelectorAll('input[type="checkbox"]').forEach((box) => {
    const tasks = Store.getTasks();
    const taskList = document.querySelectorAll(".task");
    let nodes = Array.prototype.slice.call(taskList); //convert list in array
  for (let i = 0; i < tasks.length; i+= 1) {
    //iterate over tasks to find completed tasks
    let task = tasks[i].completed;
    if (tasks[i].index === nodes.indexOf(box.parentElement.parentElement)) {
      //condition if
      if (task) {
        //if task is completed
        box.setAttribute("checked", ""); //fill the check
      }
      localStorage.setItem("tasks", JSON.stringify(tasks)); //update storage
    }
  }

  // Event: update storage when a task is completed
  document.querySelectorAll('input[type="checkbox"]').forEach((box) => {
    const tasks = Store.getTasks();
    const taskList = document.querySelectorAll(".task");
    box.addEventListener("change", () => {
      //same on when user take action conditions are opposite
      let nodes = Array.prototype.slice.call(taskList);
      for (let i = 0; i < tasks.length; i+= 1) {
        let completed = tasks[i].completed;
        if (tasks[i].index === nodes.indexOf(box.parentElement.parentElement)) {
          if (completed) {
            box.removeAttribute("checked");
            tasks[i].completed = false;
          }
          if (!completed) {
            box.setAttribute("checked", "");
            tasks[i].completed = true;
          }
        }
      }
      localStorage.setItem("tasks", JSON.stringify(tasks));

//for reloading and updating everytime a task is completed //! Any better way?
     document.location.reload(true);
    });
  });
});