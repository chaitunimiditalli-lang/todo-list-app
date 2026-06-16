const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {

    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {

        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}">
                ${task.text}
            </span>

            <div>
                <button onclick="toggleTask(${task.id})">✓</button>
                <button onclick="editTask(${task.id})">Edit</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

addBtn.addEventListener("click", () => {

    const text = taskInput.value.trim();

    if (text === "") return;

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
});

function toggleTask(id) {

    const task = tasks.find(t => t.id === id);

    if (task) {
        task.completed = !task.completed;
    }

    saveTasks();
    renderTasks();
}

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

function editTask(id) {

    const task = tasks.find(t => t.id === id);

    if (!task) return;

    const newTask = prompt("Edit Task", task.text);

    if (newTask && newTask.trim() !== "") {

        task.text = newTask.trim();

        saveTasks();
        renderTasks();
    }
}

document.querySelectorAll("[data-filter]").forEach(btn => {

    btn.addEventListener("click", () => {

        document.querySelectorAll("[data-filter]").forEach(b => {
            b.classList.remove("active");
        });

        btn.classList.add("active");

        currentFilter = btn.dataset.filter;

        renderTasks();
    });

});

renderTasks();
