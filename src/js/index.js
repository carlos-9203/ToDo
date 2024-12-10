import '../styles/main.css';

const Storage = {
    saveProjects(projects) {
        localStorage.setItem('projects', JSON.stringify(projects));
    },
    loadProjects() {
        const projects = localStorage.getItem('projects');
        return projects ? JSON.parse(projects) : [];
    }
};

const DOMController = {
    renderProjects() {
        const projects = Storage.loadProjects();
        const projectList = document.getElementById('project-list');
        projectList.innerHTML = '';

        projects.forEach((project, index) => {
            const li = document.createElement('li');
            li.textContent = project.name;
            li.dataset.index = index;

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => {
                const newName = prompt('Rename project:', project.name);
                if (newName) {
                    projects[index].name = newName;
                    Storage.saveProjects(projects);
                    this.renderProjects();
                }
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                const confirmed = confirm('Are you sure you want to delete this project?');
                if (confirmed) {
                    projects.splice(index, 1);
                    Storage.saveProjects(projects);
                    this.renderProjects();
                    if (projects.length > 0) {
                        this.renderTodos(0); // Render first project by default
                    } else {
                        this.clearTodos(); // Clear todos if no projects remain
                    }
                }
            });

            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            li.addEventListener('click', () => {
                this.renderTodos(index);
                this.setActiveProject(index);
            });

            projectList.appendChild(li);
        });
    },
    renderTodos(projectIndex) {
        const projects = Storage.loadProjects();
        const todos = projects[projectIndex]?.todos || [];
        const todoList = document.getElementById('todo-list');
        const projectTitle = document.getElementById('project-title');

        projectTitle.textContent = projects[projectIndex]?.name || 'No Project Selected';
        todoList.innerHTML = '';

        todos.forEach((todo, todoIndex) => {
            const li = document.createElement('li');
            li.textContent = `${todo.title} (${todo.dueDate})`;

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => {
                const newTitle = prompt('Edit todo title:', todo.title);
                const newDueDate = prompt('Edit due date (YYYY-MM-DD):', todo.dueDate);
                if (newTitle && newDueDate) {
                    todos[todoIndex].title = newTitle;
                    todos[todoIndex].dueDate = newDueDate;
                    Storage.saveProjects(projects);
                    this.renderTodos(projectIndex);
                }
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                const confirmed = confirm('Are you sure you want to delete this todo?');
                if (confirmed) {
                    todos.splice(todoIndex, 1);
                    Storage.saveProjects(projects);
                    this.renderTodos(projectIndex);
                }
            });

            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            todoList.appendChild(li);
        });

        document.getElementById('add-todo').onclick = () => {
            const title = prompt('Enter todo title:');
            const dueDate = prompt('Enter due date (YYYY-MM-DD):');
            if (title && dueDate) {
                todos.push({ title, dueDate });
                Storage.saveProjects(projects);
                this.renderTodos(projectIndex);
            }
        };
    },
    setActiveProject(index) {
        const projectList = document.getElementById('project-list').children;
        Array.from(projectList).forEach((li, i) => {
            li.classList.toggle('active', i === index);
        });
    },
    clearTodos() {
        document.getElementById('todo-list').innerHTML = '';
        document.getElementById('project-title').textContent = 'No Project Selected';
    },
    addEventListeners() {
        document.getElementById('add-project').addEventListener('click', () => {
            const name = prompt('Enter project name:');
            if (name) {
                const projects = Storage.loadProjects();
                projects.push({ name, todos: [] });
                Storage.saveProjects(projects);
                this.renderProjects();
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (!Storage.loadProjects().length) {
        Storage.saveProjects([{ name: 'Default Project', todos: [] }]);
    }
    DOMController.renderProjects();
    DOMController.addEventListeners();
    DOMController.renderTodos(0); // Default to first project on load
});
