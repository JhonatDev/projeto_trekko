function newTask(columnid) {
    const nameInput = document.getElementById(`${columnid}-nameInput`).value;
    const descriptionInput = document.getElementById(`${columnid}-descriptionInput`).value;

    const boxCreated = createTask(nameInput, descriptionInput);
    document.getElementById(`${columnid}-taskContainer`).appendChild(boxCreated);
   
}

function createTask(name, description) {
    const taskBox = document.createElement('div');
    taskBox.className = "containerTask";
    const titleTask = document.createElement('h4');
    titleTask.innerText = name;
    const descriptionTask = document.createElement('p');
    descriptionTask.innerText = description;
    taskBox.appendChild(titleTask);
    taskBox.appendChild(descriptionTask);
    return taskBox;
}

function saveTask() {
    const columns = document.querySelectorAll(".column");
    const tasks = {};

    columns.forEach(column => {
        const columnId = column.id;
        const taskContainer = column.querySelector(".taskbox");
        const taskElements = taskContainer.querySelectorAll(".containerTask");
        
        const columnTasks = [];

        taskElements.forEach(taskElement => {
            const title = taskElement.querySelector("h4").innerText;
            const description = taskElement.querySelector("p").innerText;

            // Crie um objeto para representar cada tarefa
            const task = {
                title,
                description
            };
            
            columnTasks.push(task);
        });

        // Adicione as tarefas da coluna ao objeto tasks
        tasks[columnId] = columnTasks;
    });

    // Agora, você pode fazer algo com o objeto 'tasks', como convertê-lo em JSON
    const tasksJSON = JSON.stringify(tasks);

    // Exemplo: Salve o objeto como JSON no localStorage
    localStorage.setItem('savedTasks', tasksJSON);

    console.log(tasksJSON);
}
