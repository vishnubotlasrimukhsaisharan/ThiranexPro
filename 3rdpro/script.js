const STORAGE_KEY = "orbit-tasks";
let tasks = loadTasks();
let activeFilter = "all";

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const emptyTitle = document.querySelector("#empty-title");
const emptyCopy = document.querySelector("#empty-copy");

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function visibleTasks() {
  if (activeFilter === "active") return tasks.filter((task) => !task.completed);
  if (activeFilter === "completed") return tasks.filter((task) => task.completed);
  return tasks;
}

function createTaskElement(task) {
  const item = document.createElement("article");
  item.className = `task-item${task.completed ? " is-complete" : ""}`;
  item.dataset.id = task.id;
  item.setAttribute("role", "listitem");
  item.innerHTML = `
    <button class="task-check" type="button" data-action="toggle" aria-label="${task.completed ? "Mark incomplete" : "Mark complete"}">${task.completed ? "✓" : ""}</button>
    <span class="task-title">${escapeHtml(task.title)}</span>
    <span class="task-tag">${task.completed ? "Done" : "Open"}</span>
    <span class="task-actions">
      <button class="icon-button" type="button" data-action="edit" aria-label="Edit task: ${escapeHtml(task.title)}">✎</button>
      <button class="icon-button" type="button" data-action="delete" aria-label="Delete task: ${escapeHtml(task.title)}">×</button>
    </span>`;
  return item;
}

function escapeHtml(value) {
  const element = document.createElement("span");
  element.textContent = value;
  return element.innerHTML;
}

function render() {
  const shown = visibleTasks();
  taskList.replaceChildren(...shown.map(createTaskElement));
  const completed = tasks.filter((task) => task.completed).length;
  const remaining = tasks.length - completed;
  const percentage = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  document.querySelector("#task-count").textContent = String(shown.length);
  document.querySelector("#remaining-count").textContent = `${remaining} task${remaining === 1 ? "" : "s"} left`;
  document.querySelector("#progress-percent").textContent = `${percentage}%`;
  document.querySelector("#progress-bar").style.width = `${percentage}%`;
  document.querySelector("#progress-completed").textContent = String(completed);
  document.querySelector("#progress-total").textContent = String(tasks.length);
  emptyState.hidden = shown.length > 0;
  if (activeFilter === "completed") {
    emptyTitle.textContent = "No completed tasks";
    emptyCopy.textContent = "Complete a task and it will appear here.";
  } else if (activeFilter === "active") {
    emptyTitle.textContent = "All caught up";
    emptyCopy.textContent = "You have no active tasks right now.";
  } else {
    emptyTitle.textContent = "Nothing here yet";
    emptyCopy.textContent = "Add your first task above and start making progress.";
  }
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;
  tasks.unshift({ id: crypto.randomUUID(), title, completed: false });
  saveTasks();
  taskInput.value = "";
  render();
  taskInput.focus();
});

document.querySelector(".filter-group").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  activeFilter = button.dataset.filter;
  document.querySelectorAll("[data-filter]").forEach((filterButton) => {
    const selected = filterButton === button;
    filterButton.classList.toggle("is-active", selected);
    filterButton.setAttribute("aria-pressed", String(selected));
  });
  render();
});

taskList.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;
  const item = actionButton.closest("[data-id]");
  const task = tasks.find((entry) => entry.id === item.dataset.id);
  if (!task) return;
  if (actionButton.dataset.action === "toggle") task.completed = !task.completed;
  if (actionButton.dataset.action === "delete") tasks = tasks.filter((entry) => entry.id !== task.id);
  if (actionButton.dataset.action === "edit") {
    const editedTitle = window.prompt("Update task", task.title)?.trim();
    if (editedTitle) task.title = editedTitle;
  }
  saveTasks();
  render();
});

document.querySelector("[data-action='clear-completed']").addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  render();
});

document.querySelector("#today-label").textContent = new Intl.DateTimeFormat("en", { weekday: "long", month: "short", day: "numeric" }).format(new Date());
render();
