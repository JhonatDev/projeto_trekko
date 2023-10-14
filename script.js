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

function newTask(columnid) {
    const nameInput = document.getElementById(`${columnid}-nameInput`).value;
    const descriptionInput = document.getElementById(`${columnid}-descriptionInput`).value;

    const boxCreated = createTask(nameInput, descriptionInput);
    document.getElementById(`${columnid}-taskContainer`).appendChild(boxCreated);
    saveTask(); // Chame a função saveTask após criar a nova tarefa
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

            const task = {
                title,
                description
            };

            columnTasks.push(task);
        });

        tasks[columnId] = columnTasks;
    });

    const tasksJSON = JSON.stringify(tasks);

    localStorage.setItem('savedTasks', tasksJSON);
    console.log(tasksJSON);
}
