document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("task-form");
  const taskTitle = document.getElementById("task-title");
  const taskDesc = document.getElementById("task-desc");
  const taskList = document.getElementById("task-list");
  const searchInput = document.getElementById("search-input");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function saveAndRender() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks(tasks);
  }

  function renderTasks(tasksToRender) {
    // Keep header or clear container
    const existingCards = taskList.querySelectorAll(".task-card");
    existingCards.forEach((card) => card.remove());

    tasksToRender.forEach((task, index) => {
      const card = document.createElement("div");
      card.className = `task-card ${task.completed ? "completed" : ""}`;
      card.innerHTML = `
        <div>
          <h3>${task.title}</h3>
          <p>${task.desc}</p>
        </div>
        <div class="task-actions">
          <button class="btn-complete" onclick="toggleTask(${index})">
            ${task.completed ? "Undo" : "Complete"}
          </button>
          <button class="btn-delete" onclick="deleteTask(${index})">Delete</button>
        </div>
      `;
      taskList.appendChild(card);
    });
  }

  // Add Task
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = taskTitle.value.trim();
    const desc = taskDesc.value.trim();

    if (title) {
      tasks.push({ title, desc, completed: false });
      taskTitle.value = "";
      taskDesc.value = "";
      saveAndRender();
    }
  });

  // Toggle Complete Status
  window.toggleTask = (index) => {
    tasks[index].completed = !tasks[index].completed;
    saveAndRender();
  };

  // Delete Task
  window.deleteTask = (index) => {
    tasks.splice(index, 1);
    saveAndRender();
  };

  // Search Filter
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.desc.toLowerCase().includes(query)
      );
      renderTasks(filtered);
    });
  }

  // Initial Load
  renderTasks(tasks);
});
