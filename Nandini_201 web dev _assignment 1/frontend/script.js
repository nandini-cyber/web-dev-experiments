function addTask() {

    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();

    // Prevent empty task
    if (taskText === "") {
        alert("Task cannot be empty!");
        return;
    }

    const li = document.createElement("li");

    // Checkbox for completion
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // Task text
    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = taskText;

    // Edit Button
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";

    editBtn.onclick = function () {
        const newTask = prompt("Edit Task:", span.textContent);
        if (newTask !== null && newTask.trim() !== "") {
            span.textContent = newTask.trim();
        }
    };

    // Delete Button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    deleteBtn.onclick = function () {
        li.remove();
        updateCount();
    };

    // Completion Toggle
    checkbox.onchange = function () {
        span.classList.toggle("completed");
        updateCount();
    };

    const btnDiv = document.createElement("div");
    btnDiv.className = "task-buttons";
    btnDiv.appendChild(editBtn);
    btnDiv.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(btnDiv);

    document.getElementById("taskList").appendChild(li);

    input.value = "";

    updateCount();
}

function updateCount() {

    const tasks = document.querySelectorAll("#taskList li");
    let completed = 0;

    tasks.forEach(task => {
        const checkbox = task.querySelector("input[type='checkbox']");
        if (checkbox.checked) completed++;
    });

    document.getElementById("completedCount").textContent = completed;
    document.getElementById("pendingCount").textContent = tasks.length - completed;
}