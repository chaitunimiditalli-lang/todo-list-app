const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Save tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {
        const li = document.createElement("li");

        li.className = task.completed
            ? "task completed"
            : "task";

        li.dataset.id = task.id;

        li.innerHTML = `
            <span>${task.text}</span>

            <div class="actions">
                <button class="complete-btn">
                    ${task.completed ? "Undo" : "Done"}
                </button>

                <button class="edit-btn">Edit</button>

                <button class="delete-btn">Delete</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

// Add task
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task");
        return;
    }

    tasks.push({
        id: Date.now(),
        text,
        completed: false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
}

// Add button click
addBtn.addEventListener("click", addTask);

// Enter key support
taskInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        addTask();
    }
});

// Event Delegation
taskList.addEventListener("click", e => {
    const li = e.target.closest(".task");

    if (!li) return;

    const id = Number(li.dataset.id);

    // Complete
    if (e.target.classList.contains("complete-btn")) {
        tasks = tasks.map(task =>
            task.id === id
                ? { ...task, completed: !task.completed }
                : task
        );
    }

    // Edit
    if (e.target.classList.contains("edit-btn")) {
        const task = tasks.find(task => task.id === id);

        const updatedText = prompt(
            "Edit Task:",
            task.text
        );

        if (updatedText && updatedText.trim() !== "") {
            task.text = updatedText.trim();
        }
    }

    // Delete
    if (e.target.classList.contains("delete-btn")) {
        tasks = tasks.filter(task => task.id !== id);
    }

    saveTasks();
    renderTasks();
});

// Filter buttons
filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {

        filterBtns.forEach(b =>
            b.classList.remove("active")
        );

        btn.classList.add("active");

        currentFilter = btn.dataset.filter;

        renderTasks();
    });
});

// Initial render
renderTasks();
