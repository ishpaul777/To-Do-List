import { Task, Store, UI } from '../add_remove_update.js';

// ? testing the adding function
describe('Add a new task', () => {
  test(('Adding First Task to storage'), () => {
    // mock task
    const description = 'firstTask';
    const completed = false;
    const index = 0;
    const task = new Task(description, completed, index);
    // TESTING STORAGE UPDATE
    Store.addTask(task);
    expect(Store.getTasks()).toHaveLength(1);
  });
  test(('Adding task to UI'), () => {
    document.body.innerHTML = '<div>'
        + '  <ul class="tasks"></ul>'
        + '</div>';

    // mock task
    const description = 'firstTask';
    const completed = false;
    const index = 0;
    const task = new Task(description, completed, index);
    UI.addTasksToList(task);
    const list = document.querySelectorAll('.task');
    expect(list).toHaveLength(1);
  });
});

// ? test editing a task
describe(('editing a task'), () => {
  test(('Updating task in UI and storage'), () => {
    const editBtn = document.querySelector('.edit-btn');
    const description = document.querySelector('.task-description');
    description.textContent = 'Edited Task';
    UI.updateTask(editBtn);
    Store.updateTask(description);
    const tasks = Store.getTasks();
    expect(tasks[0].description).toMatch('Edited Task');
  });
});

// ?testing update completion status
describe(('Updated Completion status if task is completed'), () => {
  test(('Update true when checkbox is checked'), () => {
    const checkbox = document.querySelector('.task-checkbox');
    checkbox.setAttribute('checked', '');
    Store.updateCompletionStatus(checkbox);
    const tasks = Store.getTasks();
    expect(tasks[0].completed).toBe(true);
  });
  test(('Update false when checkbox is unchecked'), () => {
    const checkbox = document.querySelector('.task-checkbox');
    checkbox.removeAttribute('checked');
    Store.updateCompletionStatus(checkbox);
    const tasks = Store.getTasks();
    expect(tasks[0].completed).toBe(false);
  });
});

// ? testing the removing function
describe(('delete a task'), () => {
  test(('Removing a task from storage'), () => {
    Store.removeTask('Edited Task');
    const tasks = Store.getTasks();
    expect(tasks).toHaveLength(0);
  });
  test(('remove from UI'), () => {
    document.body.innerHTML = `<ul>
        </li class="task">
        <div class="task-field">
            <input type="checkbox" class="task-checkbox" />
            <label class="task-description">First Tasks</label>
        </div>
        <div class="user-interaction">
        <i class="bi bi-pencil edit-btn"></i>
        <i class="bi bi-check2 update-btn"></i>
        <i class="bi bi-x remove-btn remove"></i>
        <div>
        </li>
        </ul>`;
    const removeBtn = document.querySelector('.remove-btn');
    UI.removeTask(removeBtn);
    const list = document.querySelectorAll('.task');
    expect(list).toHaveLength(0);
  });
});

// ? testing the clearalltasks function
describe('Clear All completed tasks', () => {
  test(('Removing all completed tasks from storage'), () => {
    //! adding mock tasks for testing
    // get the tasks from store//!Added 1 task

    // mock task
    let description = 'firstTask';
    let completed = true;// this is going to be removed

    let index = 0;
    let task = new Task(description, completed, index);
    // adding to STORAGE
    Store.addTask(task);
    // get the tasks from store//!Added 2nd task
    // mock task
    description = 'secondTask';
    completed = false;
    index = 3;
    task = new Task(description, completed, index);
    // adding to STORAGE
    Store.addTask(task);

    // get the tasks from store//!Added 3rd task
    // mock task
    description = 'thirdTask';
    completed = true;// this is going to be removed
    index = 2;
    task = new Task(description, completed, index);
    // adding to STORAGE
    Store.addTask(task);
    // testing clear all completed task
    Store.clearCompleted();
    const tasks = Store.getTasks();
    expect(tasks).toHaveLength(1);
  });
});