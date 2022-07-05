// //Task class : represents one task
// class Task {
//     constructor(description, completed, index) {
//       this.description = description;
//       this.completed = completed;
//       this.index = index;
//     }
//   }

//   // Store Class: Handles Storage
//   class Store {
//     static getTasks() {
//       let tasks;
//       if (localStorage.getItem("tasks") === null) {
//         //if there is nothing in storage
//         tasks = []; //create empty array
//       } else {
//         tasks = JSON.parse(localStorage.getItem("tasks")); //convert them in array
//       }
//       return tasks;
//     }

//     static addTask(task) {
//       const tasks = Store.getTasks(); //get tasks
//       tasks.push(task); //add new task
//       localStorage.setItem("tasks", JSON.stringify(tasks)); //convert them in string
//     }

//     static removeTask(description) {
//       const tasks = Store.getTasks();
//       let spliced;
//       tasks.forEach((task, index) => {
//         if (task.description === description) {
//           spliced = tasks.splice(index, 1);
//         }
//       });
//       localStorage.setItem("tasks", JSON.stringify(tasks));
//       for (let i = 0; i < tasks.length; i++) {
//         if (tasks[i].index >= spliced[0].index) {
//           tasks[i].index -= 1;
//         }
//       }
//       localStorage.setItem("tasks", JSON.stringify(tasks));
//     }

//     static clearCompleted() {
//       //check in loacal storage
//       let tasks = Store.getTasks();
//       const remainingTasks = [];
//       for (let i = 0; i < tasks.length; i++) {
//         if (tasks[i].completed === false) {
//           remainingTasks.push(tasks[i]);
//         }
//       }
//       localStorage.setItem("tasks", JSON.stringify(remainingTasks));
//       tasks = Store.getTasks();
//       for (let i = 0; i < tasks.length; i++) {
//         tasks[i].index = i;
//       }
//       localStorage.setItem("tasks", JSON.stringify(tasks));
//     }
//   }

//   //Ui class : handles ui tasks
//   class UI {
//     static displayTasks() {
//       const tasks = Store.getTasks(); // getting the tasks from local storage

//       // looping over the stored taskks and add it to list
//       tasks.forEach((task) => UI.addTasksToList(task));
//     }

//     static addTasksToList(task) {
//       const list = document.querySelector(".tasks");

//       const row = document.createElement("li");
//       row.classList.add("task");

//       row.innerHTML = `
//       <div class="task-field">
//           <input type="checkbox" name="" class="task-checkbox" />
//           <label class="task-description">${task.description}</label>
//       </div>
//       <i class="bi bi-x remove-btn remove"></i>`;

//       list.appendChild(row);
//     }

//     // for removing task
//     static removeTask(el) {
//       if (el.classList.contains("remove")) {
//         el.parentElement.remove();
//       }
//     }
//     static showAlert(message, className) {
//       const div = document.createElement("div");
//       div.className = `alert ${className}`;
//       if (className === "invalid") {
//         div.innerHTML = '<i class="bi bi-x-circle"></i>';
//       } else if (className === "success") {
//         div.innerHTML = "";
//       }
//       div.appendChild(document.createTextNode(message));
//       const form = document.querySelector(".field-input-to-do");
//       const btn = document.querySelector(".submit-btn");
//       form.insertBefore(div, btn);

//       // Vanish in 3 seconds
//       setTimeout(() => document.querySelector(".alert").remove(), 1500);
//     }
//   }

//   // Event: Display tasks
//   document.addEventListener("DOMContentLoaded", () => {
//     UI.displayTasks();
//     //after content is loaded check loacal storage if there is any completed task
//     document.querySelectorAll('input[type="checkbox"]').forEach((box) => {
//       const tasks = Store.getTasks();
//       const taskList = document.querySelectorAll(".task");
//       let nodes = Array.prototype.slice.call(taskList); //convert list in array
//       for (let i = 0; i < tasks.length; i++) {
//         //iterate over tasks to find completed tasks
//         let task = tasks[i].completed;
//         if (tasks[i].index === nodes.indexOf(box.parentElement.parentElement)) {
//           //condition if
//           if (task) {
//             //if task is completed
//             box.setAttribute("checked", ""); //fill the check
//           }
//           localStorage.setItem("tasks", JSON.stringify(tasks)); //update storage
//         }
//       }
//     });

//     // Event: update storage when a task is completed
//     document.querySelectorAll('input[type="checkbox"]').forEach((box) => {
//       const tasks = Store.getTasks();
//       const taskList = document.querySelectorAll(".task");
//       box.addEventListener("change", () => {
//         //same on when user take action conditions are opposite
//         let nodes = Array.prototype.slice.call(taskList);
//         for (let i = 0; i < tasks.length; i++) {
//           let completed = tasks[i].completed;
//           if (tasks[i].index === nodes.indexOf(box.parentElement.parentElement)) {
//             if (completed) {
//               box.removeAttribute("checked");
//               tasks[i].completed = false;
//             }
//             if (!completed) {
//               box.setAttribute("checked", "");
//               tasks[i].completed = true;
//             }
//           }
//         }
//         localStorage.setItem("tasks", JSON.stringify(tasks));
//         document.location.reload(true); //for reloading when item is added
//       });
//     });
//   });

//   // Event: Add task To list
//   document.querySelector(".field-input-to-do").addEventListener("submit", (e) => {
//     e.preventDefault();

//     const tasks = Store.getTasks();

//     // get input values
//     let description = document.querySelector(".input-to-do").value;
//     let completed = false;
//     let index = tasks.length;

//     // validations
//     // Validate
//     if (description === "") {
//       UI.showAlert("", "invalid");
//       return;
//     } else {
//       // instantiate task
//       const task = new Task(description, completed, index);

//       // ADD task
//       UI.addTasksToList(task);

//       // Add task to store
//       Store.addTask(task);
//       // Show success message
//       UI.showAlert(" ", "success");
//       // clear input field
//       document.querySelector(".input-to-do").value = "";
//       document.location.reload(true); //for reloading when item is added
//     }
//   });

//   // Event: Remove a Book
//   document.querySelector(".tasks").addEventListener("click", (e) => {
//     //remove from UI
//     UI.removeTask(e.target);
//     //update storage
//     Store.removeTask(e.target.parentElement.children[0].children[1].textContent);
//   });

//   //event: clear completed
//   document.querySelector(".clear-completed").addEventListener("click", () => {
//     //clear from loacal storage
//     Store.clearCompleted();
//     document.location.reload(true); //for reloading when item is added
//   });
