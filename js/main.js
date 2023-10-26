// Obtém o elemento do seletor de cor
var seletorCor = document.getElementById('seletorCor');

/* Adicione um ouvinte de evento ao elemento de seleção de cores. 
O evento 'input' é acionado sempre que o seletor de cores for alterado. 
Quando o evento é acionado, ele realiza as seguintes ações:
Obtém o valor da cor selecionada e o armazena na variável 'corselecionada'.
Define o estilo do elemento 'body' da página selecionada para 'corselecionada', 
alterando assim a cor de fundo da página.
Em seguida, chame a função 'saveBackground(corselecionada)' 
para salvar a cor de fundo no armazenamento local.*/
seletorCor.addEventListener('input', function() {
  var corSelecionada = seletorCor.value;
  document.body.style.backgroundColor = corSelecionada;
  saveBackgroundColor(corSelecionada);
});

/* A função é responsável por carregar a cor de fundo armazenada no localStorage.
 Ela verifica se há um valor salvo com a chave 'backgroundColor' no armazenamento local. 
 Se esse valor existir, a função define o estilo do elemento body com essa cor.*/
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

// Impede o comportamento padrão para o evento 'dragover'
function allowDrop(event) {
  event.preventDefault();
}

/*Esta função é chamada quando um elemento é solto em uma área alvo. Ela realiza o seguinte:
Previne o comportamento padrão do sistema que evitaria a soltura dos elementos.
Obtém os elementos que estão sendo arrastados pela classe 'dragging'.
Encontra a coluna alvo mais próxima, pela classe 'column', onde o elemento está sendo solto.
Obtém o contêiner de tarefas dentro da coluna alvo.
Adiciona o elemento arrastado ao contêiner de tarefas.
Chama a função 'saveTask' para salvar as informações sobre as tarefas.*/ 
function drop(event) {
  event.preventDefault();
  const draggedTask = document.querySelector('.dragging');
  const targetColumn = event.target.closest('.column');
  const taskContainer = targetColumn.querySelector('.taskbox');
  taskContainer.appendChild(draggedTask);
  saveTask();
}

// Cria uma nova tarefa com nome e descrição
function createTask(name, description) {
  const taskBox = document.createElement('div');
  taskBox.className = "containerTask";
  const titleTask = document.createElement('h4');
  titleTask.id = "title_Task";
  titleTask.innerText = name;
  const descriptionTask = document.createElement('p');
  descriptionTask.id = "description_Task";
  descriptionTask.innerText = description;
   // Torna a tarefa arrastável
  taskBox.draggable = true;
  taskBox.addEventListener('dragstart', function(event) {
    event.dataTransfer.setData('text/plain', null);
    event.target.classList.add('dragging');

  });

  taskBox.addEventListener('dragend', function(event) {
    event.target.classList.remove('dragging');

  });
   // Cria um botão de exclusão para a tarefa
  const deleteButton = document.createElement('button');
  deleteButton.className = "button2";
  const deleteIcon = document.createElement('i');
  deleteIcon.className = "fas fa-trash";
  deleteButton.appendChild(deleteIcon);
  // Adiciona um listener de evento para o botão de exclusão
  deleteButton.addEventListener('click', function myConfirmBox(message) {
    // Cria uma caixa de confirmação
    let element = document.createElement("div");
    element.classList.add("box-background");
    element.innerHTML = `<div class="box">
                                    <h3>Deseja realmente excluir?</h3>
                                    <div>
                                        <button id="trueButton" class="btn green">Sim</button>
                                        <button id="falseButton" class="btn red">Não</button>
                                    </div>
                                </div>`;
/*o código cria um diálogo de confirmação, anexa-o ao corpo da página e, em seguida, 
retorna uma promessa que pode ser resolvida com true ou false, 
dependendo da escolha do usuário no diálogo de confirmação. 
Essa promessa pode ser usada para continuar a execução do código com base na decisão do usuário.*/                         
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
   // Anexa o título, descrição e botão de exclusão à caixa da tarefa
  taskBox.appendChild(titleTask);
  taskBox.appendChild(descriptionTask);
  taskBox.appendChild(deleteButton);
  return taskBox;
}

// Cria uma nova tarefa com os inputs fornecidos na coluna especificada
function newTask(columnid) {
  const nameInput = document.getElementById(`${columnid}-nameInput`).value;
  const descriptionInput = document.getElementById(`${columnid}-descriptionInput`).value;

  if (nameInput.trim() === '' || descriptionInput.trim() === '') {
      // Mostra um alerta se os campos estiverem vazios
      let element = document.createElement("div");
      element.classList.add("box-background");
      element.innerHTML = `<div class="box-alerta">
                                    <h3>Por favor, preencha todos os campos antes de adicionar uma tarefa.</h3>
                                    <div>
                                        <button id="falseButton" class="btn ok">OK</button>
                                    </div>
                                </div>`;
      document.body.appendChild(element);
/*Após exibir o diálogo de alerta, a função retorna uma promessa (Promise) que permite ao código que a chamou lidar com a resposta do usuário. 
A promessa é criada com new Promise
A promessa aguarda a resposta do usuário, que é tratada quando o botão "OK" no diálogo de alerta é clicado. 
A função de callback associada a esse botão chama resolve(false) para indicar que o usuário reconheceu o alerta, mas não preencheu os campos necessários.
Finalmente, o diálogo de alerta é removido do corpo da página com document.body.removeChild(element)*/
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

/*, a função saveTask percorre todas as colunas e tarefas na interface do usuário, organiza os dados em um formato estruturado, 
converte os dados em JSON e os armazena no armazenamento local. 
Isso garante que as tarefas sejam persistidas e possam ser restauradas em sessões futuras */
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

/*a função loadtask e responsavel por carregar as informaçoes sobre as tarefas salvas no armazenamento 
 local e exibilas na pagina ela faz os seguinte 
obtem os dados das tarefas do armazenamento local com a chave savetask
verifica se exitem tarefas salvas  se houver elas sao recuperadas e convertidas de json  para objetos en javascript
itera sobre as colunas e as tarefas carregadas criando elementos html para cada tarefa e adicionando os as 
colunas apropiadas isso restaura as tarefas na pagina quando ela e recarregada
 */
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
