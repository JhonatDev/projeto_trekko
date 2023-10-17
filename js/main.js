var seletorCor = document.getElementById('seletorCor');

seletorCor.addEventListener('input', function() {
  var corSelecionada = seletorCor.value;
  document.body.style.backgroundColor = corSelecionada;
});

function createTask(name, description) {
    const taskBox = document.createElement('div');
    taskBox.className = "containerTask";
    const titleTask = document.createElement('h4');
    titleTask.id = "title_Task"; // Define o ID
    titleTask.innerText = name;
    const descriptionTask = document.createElement('p');
    descriptionTask.id = "description_Task"; // Define o ID
    descriptionTask.innerText = description;
    const deleteButton = document.createElement('button');
    deleteButton.className = "button2"
    const deleteIcon = document.createElement('i');
    deleteIcon.className = "fas fa-trash";
    deleteButton.appendChild(deleteIcon);
    deleteButton.addEventListener('click', function() {
        const confirmDelete = confirm("Tem certeza que deseja deletar esta tarefa?");
        
        if (confirmDelete) {
            taskBox.remove();
            saveTask();
        }
    });
    taskBox.appendChild(titleTask);
    taskBox.appendChild(descriptionTask);
    taskBox.appendChild(deleteButton);
    return taskBox;
    
}

function newTask(columnid) {
    const nameInput = document.getElementById(`${columnid}-nameInput`).value;
    const descriptionInput = document.getElementById(`${columnid}-descriptionInput`).value;

    if (nameInput.trim() === '' || descriptionInput.trim() === '') {
        alert("Por favor, preencha todos os campos antes de adicionar uma tarefa.");
        return; 
    }

    const boxCreated = createTask(nameInput, descriptionInput);
    document.getElementById(`${columnid}-taskContainer`).appendChild(boxCreated);
    saveTask(); 
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
    const savedTasks = localStorage.getItem('savedTasks'); 

    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);

        Object.keys(tasks).forEach(columnId => {
            const column = document.getElementById(columnId);
            const columnTasks = tasks[columnId];

            columnTasks.forEach(taskData => {
                const task = createTask(taskData.title, taskData.description); 
                column.querySelector('.taskbox').appendChild(task); 
            });
        });
    }
}


loadTasks();
var seletorCor = document.getElementById('seletorCor');

seletorCor.addEventListener('input', function() {
  var corSelecionada = seletorCor.value;
  document.body.style.backgroundColor = corSelecionada;
  saveBackgroundColor(corSelecionada); 
});

function saveBackgroundColor(color) {
  localStorage.setItem('backgroundColor', color);
}

function loadBackgroundColor() {
  const savedBackgroundColor = localStorage.getItem('backgroundColor');

  if (savedBackgroundColor) {
    document.body.style.backgroundColor = savedBackgroundColor;
  }
}
loadBackgroundColor();
