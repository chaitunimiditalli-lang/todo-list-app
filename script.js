const taskInput =
document.getElementById("taskInput");

const addBtn =
document.getElementById("addBtn");

const taskList =
document.getElementById("taskList");

const taskCounter =
document.getElementById("taskCounter");

const clearCompleted =
document.getElementById("clearCompleted");

let currentFilter = "all";

let tasks =
JSON.parse(
localStorage.getItem("tasks")
) || [];

function saveTasks(){

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

function updateCounter(){

    const activeTasks =
    tasks.filter(
        task => !task.completed
    ).length;

    taskCounter.textContent =
    `${activeTasks} task(s) left`;
}

function renderTasks(
    filter = currentFilter
){

    currentFilter = filter;

    taskList.innerHTML = "";

    const filteredTasks =
    tasks.filter(task => {

        if(filter === "active")
            return !task.completed;

        if(filter === "completed")
            return task.completed;

        return true;
    });

    filteredTasks.forEach(task => {

        const index =
        tasks.indexOf(task);

        const li =
        document.createElement("li");

        li.innerHTML = `
        <span class="${
            task.completed
            ? "completed"
            : ""
        }">
            ${task.text}
        </span>

        <div class="task-actions">

            <button
            class="complete-btn"
            onclick="toggleTask(${index})">
            ✓
            </button>

            <button
            class="edit-btn"
            onclick="editTask(${index})">
            Edit
            </button>

            <button
            class="delete-btn"
            onclick="deleteTask(${index})">
            Delete
            </button>

        </div>
        `;

        taskList.appendChild(li);
    });

    updateCounter();
}

function addTask(){

    const text =
    taskInput.value.trim();

    if(text === "") return;

    tasks.push({
        text:text,
        completed:false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
}

addBtn.addEventListener(
    "click",
    addTask
);

taskInput.addEventListener(
    "keypress",
    function(e){

        if(e.key === "Enter"){
            addTask();
        }
    }
);

function toggleTask(index){

    tasks[index].completed =
    !tasks[index].completed;

    saveTasks();
    renderTasks();
}

function editTask(index){

    const updated =
    prompt(
        "Edit Task",
        tasks[index].text
    );

    if(
        updated &&
        updated.trim() !== ""
    ){

        tasks[index].text =
        updated.trim();

        saveTasks();
        renderTasks();
    }
}

function deleteTask(index){

    tasks.splice(index,1);

    saveTasks();
    renderTasks();
}

clearCompleted.addEventListener(
    "click",
    () => {

        tasks =
        tasks.filter(
            task => !task.completed
        );

        saveTasks();
        renderTasks();
    }
);

document
.querySelectorAll("[data-filter]")
.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            renderTasks(
                button.dataset.filter
            );
        }
    );
});

renderTasks();
