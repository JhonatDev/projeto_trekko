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
function loadTasks() {
    const savedTasks = localStorage.getItem('savedTasks'); // Corrija o nome da chave

    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);

        Object.keys(tasks).forEach(columnId => {
            const column = document.getElementById(columnId);
            const columnTasks = tasks[columnId];

            columnTasks.forEach(taskData => {
                const task = createTask(taskData.title, taskData.description); // Corrija o acesso aos dados da tarefa
                column.querySelector('.taskbox').appendChild(task); // Certifique-se de que está acessando a classe correta para a lista de tarefas
            });
        });
    }
}

// Chame a função loadTasks para carregar tarefas ao carregar a página
loadTasks();
