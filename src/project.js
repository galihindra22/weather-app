
class Project{
    constructor(name ="Default"){
        this.id = crypto.randomUUID();
        this.name = name;
        this.todos = [];
    }

    addTodo(todo){
        this.todos.push(todo);
    }

    deleteTodo(id){
        this.todos = this.todos.filter((todo) => todo.id !== id);
    }
}

export default Project;