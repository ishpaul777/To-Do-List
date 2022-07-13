import { Task, Store, UI } from '../add_remove_update.js';

// delete window.location;
// window.location = {
//     reload: jest.fn()
// }
// ? testing the adding function
describe('Add a new task', () => {
  test(('Adding First Task to storage'), () => {
    // get the tasks from store
    const tasks = Store.getTasks();
    // mock task
    const description = 'firstTask';
    const completed = false;
    const index = 0;
    const task = new Task(description, completed, index);
    // TESTING STORAGE UPDATE
    Store.addTask(task);
    expect(tasks).toHaveLength(1);
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

//  testing the removing function 
describe(('delete a task'), () => {
  test(('Removing a task from storage'), () => {
    const tasks = Store.getTasks();
    Store.removeTask('firstTask');
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
