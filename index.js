//localStorage
let todoList = JSON.parse(localStorage.getItem("todos")) || [];

//ToDo item object
const todoItem = function () {
  this.id = null;
  this.title = "";
  this.complete = false;
};

//elements
const appDiv = document.getElementById("app");

const addItemInput = document.getElementById("add-item-input");

const addItemBtn = document.getElementById("add-item-btn");

const cardsContainer = document.getElementById("cards-container");

//reRender on page reload
todoList.length > 0
  ? todoList.map((todo) => {
      const newToDoCard = document.createElement("div");

      if (todo.complete === true) {
        newToDoCard.innerHTML = `<div class="new-todo-card" id="${todo.id}">
        <input type="checkbox" checked name="complete-task" id="complete-task">
        <h2 class="todo-task-title crossed" id="todo-task-title">${todo.title}</h2>
        <button class="delete-item-btn" name="delete-task" id="delete-item-btn">Delete Task</button>
    </div>`;
      } else {
        newToDoCard.innerHTML = `<div class="new-todo-card" id="${todo.id}">
    <input type="checkbox" name="complete-task" id="complete-task">
    <h2 class="todo-task-title" id="todo-task-title">${todo.title}</h2>
    <button class="delete-item-btn" name="delete-task" id="delete-item-btn">x</button>
</div>`;
      }
      cardsContainer.append(newToDoCard);
    })
  : null;

//add item to page
function addItem() {
  const newToDoItem = new todoItem();

  newToDoItem.id = new Date().getTime();
  newToDoItem.title = addItemInput.value;

  todoList.push(newToDoItem);

  let data = JSON.stringify(todoList);
  localStorage.setItem("todos", data);

  const newToDoCard = document.createElement("div");

  newToDoCard.innerHTML = `<div class="new-todo-card" id=${newToDoItem.id}>
    <input type="checkbox" name="complete-task" id="complete-task">
    <h2 class="todo-task-title" id="todo-task-title">${addItemInput.value}</h2>
    <button class="delete-item-btn" id="delete-item-btn">x</button>
</div>`;

  cardsContainer.appendChild(newToDoCard);
}

addItemBtn.addEventListener("click", () => {
  if (addItemInput.value.length !== 0) {
    addItem();
    addItemInput.value = "";
  }
});

cardsContainer.addEventListener("click", (e) => {
  //complete task
  if (e.target.id === "complete-task") {
    const completeTaskBtn = e.target;
    //get current task id
    const taskCard = completeTaskBtn.parentElement;
    const taskId = JSON.parse(taskCard.getAttribute("id"));

    //toggle title crossout
    const titleElement = taskCard.getElementsByClassName("todo-task-title");
    const taskTitle = titleElement.item(0);
    taskTitle.classList.toggle("crossed");

    //toggle todo items as complete/incomplete
    const thisToDoItem = todoList.find((todo) => todo.id === taskId);

    thisToDoItem.complete = !thisToDoItem.complete;

    completeTaskBtn.classList.toggle("checked");

    //cache changes
    let incompleteTasks = [];

    incompleteTasks.push(thisToDoItem);

    //update localstorage
    let combinedTasks = [...todoList, ...incompleteTasks];

    const updatedTasks = [...new Set(combinedTasks)];

    let newData = JSON.stringify(updatedTasks);
    localStorage.setItem("todos", newData);
  }

  //delete task
  if (e.target.id === "delete-item-btn") {
    const deleteTaskBtn = e.target;

    //get current task id
    const taskCard = deleteTaskBtn.parentElement;
    const taskId = JSON.parse(taskCard.getAttribute("id"));

    //update localstorage
    let filteredItems = todoList.filter((todo) => todo.id !== taskId);

    let newData = JSON.stringify(filteredItems);
    localStorage.setItem("todos", newData);

    todoList = JSON.parse(localStorage.getItem("todos"));

    taskCard.remove();
  }
});
