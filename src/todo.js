class Todo{
    constructor(title, description, dueDate, priority, note, isChecked = false){
        this.id = crypto.randomUUID();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.note = note;
        this.isChecked = isChecked;
    }
    
    toggleCheck(){
        this.isChecked = !this.isChecked;
    }

    updateDetails(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    } 
}

export default Todo;