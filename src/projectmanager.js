import Project from "./project.js";
import Todo from "./todo.js";

class ProjectManager{
    constructor(){
        this.projects = [];
        this.activeProjectId = null;
        this.load();
    }

    createDefaultProject() {
        const defaultProject = new Project("Home");
        defaultProject.addTodo(
            new Todo("Groceries", "buy veggies", "2026-09-15", "Medium")
        );
        this.projects = [defaultProject];
        this.activeProjectId = defaultProject.id;
        this.save();
    }

    save() {
        localStorage.setItem("todo_app_projects", JSON.stringify(this.projects));
    }

    load(){
        const rawData = localStorage.getItem("todo_app_projects");

        if(!rawData){
            this.createDefaultProject();
            return;
        }

        try{
            const parsed = JSON.parse(rawData);

            if (!Array.isArray(parsed) || parsed.length === 0) {
                this.createDefaultProject();
                return;
            }

            this.projects = parsed.map((projData) => {
                const project = new Project(projData.name);
                project.id = projData.id;

                project.todos = (projData.todos || []).map((todoData) =>{
                    const todo = new Todo(
                        todoData.title,
                        todoData.description,
                        todoData.dueDate,
                        todoData.priority,
                        todoData.note,
                        todoData.isChecked
                    );
                    todo.id = todoData.id;
                    return todo;
                });
                return project;
            });

            this.activeProjectId = this.projects[0].id;
        }   
        catch(e){
            console.log("Storage got corrupted", e);
            this.createDefaultProject();
        }
    }

    addProject(name){
        const project = new Project(name);
        this.projects.push(project);
        return project;
    }

    getActiveProject(){
        return this.projects.find((project) => project.id === this.activeProjectId);
    }

    switchActiveProject(projectId){
        const project = this.projects.find((project) => project.id === projectId);
        if(project){
            this.activeProjectId = projectId;
        }
    }

    deleteProject(projectId){
        if(this.projects.length <= 1) return;

        this.projects = this.projects.filter((project) => project.id !== projectId);
        
        if(this.activeProjectId === projectId){
            this.activeProjectId = this.projects[0].id;
        }
    }
}

export default ProjectManager;