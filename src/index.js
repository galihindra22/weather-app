import Todo from "./todo.js";
import ProjectManager from "./projectmanager.js";
import './styles.css';
import { format, formatDistanceToNow, parseISO, isValid } from "date-fns";

function init() {
    const manager = new ProjectManager();

    const projectList = document.querySelector("#project-list");
    const todoList = document.querySelector("#todo-list");
    const activeTitle = document.querySelector("#active-project-title");
    const newProjectForm = document.querySelector("#new-project-form");
    const projectInput = document.querySelector("#project-input");
    const newTodoForm = document.querySelector("#new-todo-form");
    const collapseTodoBtn = document.querySelector("#collapse-add-todo");
    const collapseProjectBtn = document.querySelector("#collapse-add-project");

    function renderSidebar() {
        projectList.innerHTML = "";

        manager.projects.forEach((project) => {
            const li = document.createElement("li");
            const btn = document.createElement("button");

            btn.textContent = project.name;
            if (project.id === manager.activeProjectId) {
                btn.classList.add("active");
            }

            btn.addEventListener("click", () => {
                manager.switchActiveProject(project.id);
                render();
            });

            li.appendChild(btn);
            projectList.appendChild(li);
        });
    }

    function renderTodos() {
        const currentProject = manager.getActiveProject();
        activeTitle.textContent = currentProject.name;
        todoList.innerHTML = "";

        if (currentProject.todos.length === 0) {
            const emptyMsg = document.createElement("p");
            emptyMsg.textContent = "No tasks yet.";
            todoList.appendChild(emptyMsg);
            return;
        }

        currentProject.todos.forEach((todo) => {
            const card = document.createElement("div");
            card.classList.add("todo-card");
            if (todo.isChecked) card.classList.add("completed");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = todo.isChecked;
            checkbox.addEventListener("change", () => {
                todo.toggleCheck();
                manager.save();
                renderTodos();
            });

            const titleSpan = document.createElement("span");
            titleSpan.classList.add("title-item");
            titleSpan.textContent = todo.title;

            const description = document.createElement("p");
            description.classList.add("description-item");
            description.textContent = todo.description;

            const dueSpan = document.createElement("span");
            dueSpan.classList.add("due-date");
            dueSpan.textContent = displayDate(todo.dueDate);

            const prioritySpan = document.createElement("span");
            prioritySpan.classList.add("priority-item");
            prioritySpan.textContent = todo.priority;

            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.classList.add("edit-btn");

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.addEventListener("click", () => {
                currentProject.deleteTodo(todo.id);
                manager.save();
                renderTodos();
            });

            editBtn.addEventListener("click", () => {
                card.innerHTML = "";

                const editForm = document.createElement("form");
                editForm.classList.add("edit-todo-form");

                const editTitle = document.createElement("input");
                editTitle.type = "text";
                editTitle.value = todo.title;
                editTitle.required = true;

                const editDesc = document.createElement("textarea");
                editDesc.value = todo.description;

                const editDate = document.createElement("input");
                editDate.type = "date";
                editDate.value = todo.dueDate;

                const editPriority = document.createElement("select");
                ["Low", "Medium", "High"].forEach((lvl) => {
                    const opt = document.createElement("option");
                    opt.value = lvl;
                    opt.textContent = lvl;
                    if (todo.priority === lvl) opt.selected = true;
                    editPriority.appendChild(opt);
                });

                const saveBtn = document.createElement("button");
                saveBtn.type = "submit";
                saveBtn.textContent = "Save";

                const cancelBtn = document.createElement("button");
                cancelBtn.type = "button";
                cancelBtn.textContent = "Cancel";
                cancelBtn.addEventListener("click", () => renderTodos());

                editForm.append(editTitle, editDesc, editDate, editPriority, saveBtn, cancelBtn);

                editForm.addEventListener("submit", (e) => {
                    e.preventDefault();
                    const newTitle = editTitle.value.trim();
                    if (!newTitle) return;

                    todo.updateDetails(
                        newTitle,
                        editDesc.value,
                        editDate.value,
                        editPriority.value
                    );
                    manager.save();
                    renderTodos();
                });
                card.appendChild(editForm);
            });
            if(prioritySpan.textContent === "Low"){
                prioritySpan.style.backgroundColor = "green";
            }
            else if(prioritySpan.textContent === "Medium"){
                prioritySpan.style.backgroundColor = "yellow";
            }
            else if(prioritySpan.textContent === "High"){
                prioritySpan.style.backgroundColor = "red";
            }

            if(checkbox.checked){
                titleSpan.style.textDecoration = "line-through";
                description.style.textDecoration = "line-through";
                dueSpan.style.textDecoration = "line-through";
                prioritySpan.style.textDecoration = "line-through";
            }

            card.append(checkbox, titleSpan, description, dueSpan, prioritySpan, editBtn, deleteBtn);
            todoList.appendChild(card);
        });
    }

    function render() {
        renderSidebar();
        renderTodos();
    }

    collapseTodoBtn.addEventListener("click", () => {
        const todoFormContent = document.querySelector(".todo-form-content");
        if (todoFormContent.style.display === "block") todoFormContent.style.display = "none";
        else todoFormContent.style.display = "block";
        if (collapseTodoBtn.textContent === "Add Task") collapseTodoBtn.textContent = "Close";
        else collapseTodoBtn.textContent = "Add Task";
    });

    collapseProjectBtn.addEventListener("click", () => {
        const projectFormContent = document.querySelector(".project-form-content");
        if (projectFormContent.style.display === "block") projectFormContent.style.display = "none";
        else projectFormContent.style.display = "block";
        if (collapseProjectBtn.textContent === "Add Project") collapseProjectBtn.textContent = "Close";
        else collapseProjectBtn.textContent = "Add Project";
    });

    newProjectForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = projectInput.value.trim();
        if (!name) return;

        const newProject = manager.addProject(name);
        manager.switchActiveProject(newProject.id);
        projectInput.value = "";
        render();
    });

    newTodoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const titleInput = document.querySelector("#todo-title");
        const descriptionInput = document.querySelector("#todo-description");
        const dateInput = document.querySelector("#todo-date");
        const priorityInput = document.querySelector("#todo-priority");

        const title = titleInput.value.trim();
        if (!title) return;

        const activeProject = manager.getActiveProject();
        activeProject.addTodo(new Todo(title, descriptionInput.value, dateInput.value, priorityInput.value));
        manager.save();

        newTodoForm.reset();
        renderTodos();
    });

    render();
}


function displayDate(rawDate) {
    if (!rawDate) return "no date";

    const parsed = parseISO(rawDate);
    if (!isValid(parsed)) return "Invalid date";

    return format(parsed, "MMM d, yyyy");
}

init();