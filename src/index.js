import './style.css';

const tasks = [
  {
    description: 'Doctor appointment at 12PM',
    completed: false,
    index: 0,
  },
  {
    description: 'Hangout with friends',
    completed: false,
    index: 1,
  },
  {
    description: 'Complete project for Microverse',
    completed: false,
    index: 2,
  },
  {
    description: 'Take programming tutorials',
    completed: false,
    index: 3,
  },
  {
    description: 'Dinner plan with family',
    completed: false,
    index: 4,
  },
];

function addTasksToList(task) {
  const list = document.querySelector('.tasks');

  const row = document.createElement('li');
  row.classList.add('task');

  row.innerHTML = `
      <div class="task-field">
          <input type="checkbox" name="" class="task-checkbox" />
          <label class="task-description">${task.description}</label>
      </div>
      <i class="bi bi-x remove-btn remove"></i>`;

  list.appendChild(row);
}

for (let i = 0; i < tasks.length; i += 1) {
  addTasksToList(tasks[i]);
}
