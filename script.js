document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("taskForm");
  const taskTitle = document.getElementById("taskTitle");
  const taskDescription = document.getElementById("taskDescription");
  const searchInput = document.getElementById("searchInput");
  const taskList = document.getElementById("taskList");
  const emptyState = document.getElementById("emptyState");
  const filterButtons = document.querySelectorAll(".filter-btn");

  // Load tasks from LocalStorage
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let currentFilter = "all";

  // Save tasks and refresh UI
  function saveAndRender() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }

  // Render task list based on search query and active filter
  function renderTasks() {
    taskList.innerHTML = "";
    const searchQuery = searchInput.value.toLowerCase().trim();

    const filteredTasks = tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery) ||
        task.description.toLowerCase().includes(searchQuery);

      if (currentFilter === "pending") return matchesSearch && !task.completed;
      if (currentFilter === "completed") return matchesSearch && task.completed;
      return matchesSearch;
    });

    // Toggle Empty State message
    if (filteredTasks.length === 0) {
      emptyState.hidden = false;
    } else {
      emptyState.hidden = true;
    }

    // Render each task card
    filteredTasks.forEach((task) => {
      const card = document.createElement("div");
      card.className = `task-card ${task.completed ? "completed" : ""}`;

      card.innerHTML = `
        <div class="task-content">
          <h3>${escapeHtml(task.title)}</h3>
          <p>${escapeHtml(task.description)}</p>
        </div>
        <div class="task-actions">
          <button class="btn-toggle" onclick="toggleTask(${task.id})">
            ${task.completed ? "Undo" : "Complete"}
          </button>
          <button class="btn-delete" onclick="deleteTask(${task.id})">
            Delete
          </button>
        </div>
      `;

      taskList.appendChild(card);
    });
  }

  // Utility to prevent HTML injection
  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // Handle Form Submission
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();

    if (title && description) {
      const newTask = {
        id: Date.now(),
        title: title,
        description: description,
        completed: false,
      };

      tasks.push(newTask);
      taskForm.reset();
      saveAndRender();
    }
  });

  // Toggle Complete / Undo
  window.toggleTask = (id) => {
    tasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveAndRender();
  };

  // Delete Task
  window.deleteTask = (id) => {
    tasks = tasks.filter((task) => task.id !== id);
    saveAndRender();
  };

  // Live Search Input Listener
  searchInput.addEventListener("input", renderTasks);

  // Filter Buttons Handler (All / Pending / Completed)
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      currentFilter = btn.getAttribute("data-filter");
      renderTasks();
    });
  });

  // Initial render when page loads
  renderTasks();
});
