var seletorCor = document.getElementById('seletorCor');

seletorCor.addEventListener('input', function() {
  var corSelecionada = seletorCor.value;
  document.body.style.backgroundColor = corSelecionada;
  saveBackgroundColor(corSelecionada);
});

function loadBackgroundColor() {
  const savedBackgroundColor = localStorage.getItem('backgroundColor');

  if (savedBackgroundColor) {
    document.body.style.backgroundColor = savedBackgroundColor;
  }
  
}
loadBackgroundColor();
function saveBackgroundColor(color) {
  localStorage.setItem('backgroundColor', color);
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const draggedTask = document.querySelector('.dragging');
  const targetColumn = event.target.closest('.column');
  const taskContainer = targetColumn.querySelector('.taskbox');
  taskContainer.appendChild(draggedTask);
  saveTask();
}

function createTask(name, description) {
  const taskBox = document.createElement('div');
  taskBox.className = "containerTask";
  const titleTask = document.createElement('h4');
  titleTask.id = "title_Task";
  titleTask.innerText = name;
  const descriptionTask = document.createElement('p');
  descriptionTask.id = "description_Task";
  descriptionTask.innerText = description;
  taskBox.draggable = true;
  taskBox.addEventListener('dragstart', function(event) {
    event.dataTransfer.setData('text/plain', null);
    event.target.classList.add('dragging');

  });

  taskBox.addEventListener('dragend', function(event) {
    event.target.classList.remove('dragging');

  });
  const deleteButton = document.createElement('button');
  deleteButton.className = "button2";
  const deleteIcon = document.createElement('i');
  deleteIcon.className = "fas fa-trash";
  deleteButton.appendChild(deleteIcon);
  deleteButton.addEventListener('click', function myConfirmBox(message) {
    let element = document.createElement("div");
    element.classList.add("box-background");
    element.innerHTML = `<div class="box">
                                    <h3>Deseja realmente excluir?</h3>
                                    <div>
                                        <button id="trueButton" class="btn green">Yes</button> <!-- Set Id for both buttons -->
                                        <button id="falseButton" class="btn red">No</button>
                                    </div>
                                </div>`;
    document.body.appendChild(element);
    return new Promise(function(resolve, reject) {
      document.getElementById("trueButton").addEventListener("click", function() {
        resolve(true);
        taskBox.remove();
        saveTask();
        document.body.removeChild(element);
      });
      document.getElementById("falseButton").addEventListener("click", function() {
        resolve(false);
        document.body.removeChild(element);
      });
    });
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

      let element = document.createElement("div");
      element.classList.add("box-background");
      element.innerHTML = `<div class="box-alerta">
                                    <h3>Por favor, preencha todos os campos antes de adicionar uma tarefa.</h3>
                                    <div>
                                        <button id="falseButton" class="btn ok">OK</button>
                                    </div>
                                </div>`;
      document.body.appendChild(element);
      return new Promise(function(resolve, reject) {
        document.getElementById("falseButton").addEventListener("click", function() {
          resolve(false);
          document.body.removeChild(element);
        });
      });
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
