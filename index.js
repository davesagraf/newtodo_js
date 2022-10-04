//localStorage
let todoList = JSON.parse(localStorage.getItem("todos")) || [];

//pagination logic variables
let todosPages = [];
let selectedPage;
let selectedIndex;
let startIndex;
let endIndex;
let pagingList;

//ToDo item object
const todoItem = function () {
  this.id = null;
  this.title = "";
  this.complete = false;
};

//initial DOM elements
const appDiv = document.getElementById("app");

const addItemInput = document.getElementById("add-item-input");

//input validation
addItemInput.addEventListener("input", (e) => {
  if (e.target.value.trim().length > 1) {
    const helperText = document.getElementById("helper-message");
    helperText.classList.add("hidden");
  }
});

const addItemBtn = document.getElementById("add-item-btn");

const cardsContainer = document.getElementById("cards-container");

//reRender on page reload
todoList.length > 0
  ? todoList.map((todo) => {
      const newToDoCard = document.createElement("div");

      if (todo.complete === true) {
        newToDoCard.innerHTML = `<div class="new-todo-card" id="${todo.id}">
        <input type="checkbox" checked name="complete-task" id="complete-task">
        <div class="todo-title-wrap" id="todo-title-wrap">
        <h2 class="todo-task-title crossed" id="todo-task-title">${todo.title}</h2>
        </div>
        <button class="delete-item-btn" name="delete-task" id="delete-item-btn">x</button>
    </div>`;
      } else {
        newToDoCard.innerHTML = `<div class="new-todo-card" id="${todo.id}">
    <input type="checkbox" name="complete-task" id="complete-task">
    <div class="todo-title-wrap" id="todo-title-wrap">
    <h2 class="todo-task-title" id="todo-task-title">${todo.title}</h2>
    </div>
    <button class="delete-item-btn" name="delete-task" id="delete-item-btn">x</button>
</div>`;
      }
      cardsContainer.append(newToDoCard);
    })
  : null;

//add item to page
addItem = () => {
  const newToDoItem = new todoItem();

  newToDoItem.id = new Date().getTime();
  newToDoItem.title = addItemInput.value;

  todoList.push(newToDoItem);

  let data = JSON.stringify(todoList);
  localStorage.setItem("todos", data);

  const newToDoCard = document.createElement("div");

  newToDoCard.innerHTML = `<div class="new-todo-card" id=${newToDoItem.id}>
    <input type="checkbox" name="complete-task" id="complete-task">
    <div class="todo-title-wrap" id="todo-title-wrap">
    <h2 class="todo-task-title" id="todo-task-title">${addItemInput.value}</h2>
    </div>
    <button class="delete-item-btn" id="delete-item-btn">x</button>
</div>`;

  cardsContainer.appendChild(newToDoCard);
};

addItemBtn.addEventListener("click", () => {
  //empty title validation
  if (addItemInput.value.trim().length === 0) {
    const helperText = document.getElementById("helper-message");
    helperText.classList.remove("hidden");
  }
  //accept item title
  if (addItemInput.value.trim().length !== 0) {
    addItem();
    addItemInput.value = "";
    //if more than 5 items, pagination starts
    if (todoList.length > 5) {
      injectPage();
      injectPagination();
    }
    //reload page once, when the number of items increases to start the navigation mapping
    //enables the navigation nav bar
    if (todoList.length === 6) {
      location.reload();
    }
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
    //reload page once, when the number of items decreases to fit just one page
    //removes pagination nav bar
    if (todoList.length === 5) {
      location.reload();
    }
  }
});

//pagination navigation
injectPagination = () => {
  pagingList = `
  <li class="pagination-button"><a class="pagination-link" href="javascript:void(0)" onclick="goPrevious()">Previous</a></li>
  <li class="pagination-count"><span class="pagination-link" id="spanSelectedPage">${selectedPage} | ${todosPages.length}</span></li>
  <li class="pagination-button"><a class="pagination-link" href="javascript:void(0)" onclick="goNext()">Next</a></li>
          `;
  document.getElementById("paging").innerHTML = pagingList;
};
//pagination reRender of elements
injectPage = () => {
  const list = todoList
    ? todoList
        .slice(startIndex, endIndex)
        .map((todo, index) =>
          todo.complete
            ? `<div class="new-todo-card" id="${todo.id}">
          <input type="checkbox" checked name="complete-task" id="complete-task">
          <div class="todo-title-wrap" id="todo-title-wrap">
          <h2 class="todo-task-title crossed" id="todo-task-title">${todo.title}</h2>
          </div>
          <button class="delete-item-btn" name="delete-task" id="delete-item-btn">x</button>
      </div>`
            : `<div class="new-todo-card" id="${todo.id}">
      <input type="checkbox" name="complete-task" id="complete-task">
      <div class="todo-title-wrap" id="todo-title-wrap">
      <h2 class="todo-task-title" id="todo-task-title">${todo.title}</h2>
      </div>
      <button class="delete-item-btn" name="delete-task" id="delete-item-btn">x</button>
  </div>`
        )
        .join("")
    : "";
  cardsContainer.innerHTML =
    `<div class="todo-list-title-container" id="todo-list-title-container">
  <h3 class="todo-list-title">To Do</h3>
</div>` + list;
};

//paging logic
let pagesNumber = todoList.length / 5;
const pagesNumberRemainder = pagesNumber % 1;
const pagesNumberWithoutRemainder = Math.floor(pagesNumber);
if (pagesNumberRemainder > 0)
  pagesNumber = Number(pagesNumberWithoutRemainder) + 1;
todosPages = Array(pagesNumber)
  .fill(1)
  .map((x, i) => i + 1);
startIndex = 0;
endIndex = 5;
selectedPage = 1;

if (todoList.length > 5) {
  injectPagination();
  injectPage();
}

goPrevious = () => {
  if (selectedPage != 1) {
    startIndex -= 5;
    endIndex -= 5;
    selectedPage--;
    injectPage();
    injectPagination();
  }
};

goNext = () => {
  if (selectedPage < todosPages.length) {
    startIndex += 5;
    endIndex += 5;
    selectedPage++;
    injectPage();
    injectPagination();
  }
};

//bonus track :)
// const music = new Audio();
// music.src = "./assets/skeyes.mp3";
// music.title = "skeyes";
// music.preload = true;
// music.autoplay = true;
// music.loop = true;
// music.playbackRate = 1;
