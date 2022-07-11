/* eslint-disable max-classes-per-file */
// Task class : represents one task
export class Task {
  constructor(description, completed, index) {
    this.description = description;
    this.completed = completed;
    this.index = index;
  }
}

// Store Class: Handles Storage
export class Store {
  // Get Tasks : gets the tasks from store
  static getTasks() {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
      // if there is nothing in storage
      tasks = []; // create empty array
    } else {
      tasks = JSON.parse(localStorage.getItem('tasks')); // convert them in array
    }
    return tasks;
  }

  // add the task to store
  static addTask(task) {
    const tasks = Store.getTasks(); // get tasks
    tasks.push(task); // add new task
    localStorage.setItem('tasks', JSON.stringify(tasks)); // convert them in string
    document.querySelector('.tasks-left-num').textContent = tasks.length;
  }

  // remove a task from store
  static removeTask(el, description) {
    if (el.classList.contains('remove')) {
      const tasks = Store.getTasks();
      let spliced;
      tasks.forEach((task, index) => {
        if (task.description === description) {
          spliced = tasks.splice(index, 1);
        }
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
      for (let i = 0; i < tasks.length; i += 1) {
        if (tasks[i].index >= spliced[0].index) {
          tasks[i].index -= 1;
        }
      }
      localStorage.setItem('tasks', JSON.stringify(tasks));
      document.querySelector('.tasks-left-num').textContent = tasks.length;
    }
  }

  // update status when user checks the checkbox
  static updateCompletionStatus(el) {
    const checkbox = el;
    const taskList = document.querySelector('.tasks');
    const tasks = Store.getTasks();
    const nodes = Array.prototype.slice.call(taskList.children);
    for (let i = 0; i < tasks.length; i += 1) {
      if (
        tasks[i].index === nodes.indexOf(checkbox.parentElement.parentElement)
      ) {
        if (!tasks[i].completed) {
          tasks[i].completed = true;
        } else if (tasks[i].completed) {
          tasks[i].completed = false;
        }
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }
    }
  }

  // clear all completed tasks
  static clearCompleted() {
    // check in loacal storage
    let tasks = Store.getTasks();
    const remainingTasks = [];
    for (let i = 0; i < tasks.length; i += 1) {
      if (tasks[i].completed === false) {
        remainingTasks.push(tasks[i]);
      }
    }
    localStorage.setItem('tasks', JSON.stringify(remainingTasks));
    tasks = Store.getTasks();
    for (let i = 0; i < tasks.length; i += 1) {
      tasks[i].index = i;
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // update tasks
  static updateTask(description) {
    const tasks = Store.getTasks();
    const taskList = document.querySelector('.tasks');
    const nodes = Array.prototype.slice.call(taskList.children); // convert list in array
    for (let i = 0; i < tasks.length; i += 1) {
      // iterate over tasks to find completed tasks
      if (
        tasks[i].index
        === nodes.indexOf(description.parentElement.parentElement)
      ) {
        if (description.textContent !== tasks[i].description) {
          tasks[i].description = description.textContent;
        }
      }
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

// Ui class : handles ui tasks
export class UI {
  static displayTasks() {
    const tasks = Store.getTasks(); // getting the tasks from local storage

    // looping over the stored taskks and add it to list
    tasks.forEach((task) => UI.addTasksToList(task));
  }

  static addTasksToList(task) {
    const list = document.querySelector('.tasks');

    const row = document.createElement('li');
    row.classList.add('task');
    row.classList.add('draggable');
    row.setAttribute('draggable', 'true');

    row.innerHTML = `
        <div class="task-field">
            <input type="checkbox" class="task-checkbox" />
            <label class="task-description">${task.description}</label>
        </div>
        <div class="user-interaction">
        <i class="bi bi-pencil edit-btn"></i>
        <i class="bi bi-check2 update-btn"></i>
        <i class="bi bi-x remove-btn remove"></i>
        <div>`;

    list.appendChild(row);
  }

  // for removing task
  static removeTask(el) {
    if (el.classList.contains('remove')) {
      el.parentElement.parentElement.remove();
    }
  }

  // to show Alert when added or Invalid
  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    if (className === 'invalid') {
      div.innerHTML = '<i class="bi bi-x-circle"></i>';
    } else if (className === 'success') {
      div.innerHTML = '';
    }
    div.appendChild(document.createTextNode(message));
    const form = document.querySelector('.field-input-to-do');
    const btn = document.querySelector('.submit-btn');
    form.insertBefore(div, btn);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static updateTask(el) {
    const description = el.parentElement.parentElement.children[0].children[1];
    description.setAttribute('contentEditable', 'true');

    // to select the text that is editable
    const selectText = (ele) => {
      let sel;
      let range;
      // get element id
      if (window.getSelection && document.createRange) {
        // Browser compatibility
        sel = window.getSelection();
        if (sel.toString() === '') {
          // no text selection
          window.setTimeout(() => {
            range = document.createRange(); // range object
            range.selectNodeContents(ele); // sets Range
            sel.removeAllRanges(); // remove all ranges from selection
            sel.addRange(range); // add Range to a Selection.
          }, 1);
        }
      } else if (document.selection) {
        // older ie
        sel = document.selection.createRange();
        if (sel.text === '') {
          // no text selection
          range = document.body.createTextRange(); // Creates TextRange object
          range.moveToElementText(ele); // sets Range
          range.select(); // make selection.
        }
      }
    };

    // select the text that is editable
    selectText(description);
    description.parentElement.parentElement.classList.add('active');

    const editBtn = el;
    const updateBtn = el.nextElementSibling;
    // to remove edit btn
    editBtn.style.display = 'none';
    // to display update btn
    updateBtn.style.display = 'block';

    description.addEventListener('keypress', (keypressed) => {
      if (keypressed.key === 'Enter') {
        updateBtn.click();
        Store.updateTask(description);
      }
    });

    updateBtn.addEventListener('click', () => {
      description.setAttribute('contentEditable', 'false');
      description.parentElement.parentElement.classList.remove('active');
      // to remove edit btn
      editBtn.style.display = 'block';
      // to display update btn
      updateBtn.style.display = 'none';
    });
  }
}

document.querySelector('.tasks-left-num').textContent = Store.getTasks().length;
