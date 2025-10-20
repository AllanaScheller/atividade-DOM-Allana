// Seletores DOM
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll('.filters button');

// Array para armazenar o estado das tarefas
let tasks = [];
let currentFilter = 'all'; // Filtro inicial

// --- Funções de Renderização e Lógica ---

/**
* Cria o HTML de um item de tarefa.
* @param {object} task - Objeto da tarefa { id, text, completed }
*/
function createTaskElement(task) {
const li = document.createElement('li');
li.className = `task-item ${task.completed ? 'completed' : ''}`;
li.dataset.id = task.id;

// Estrutura do item: Texto + Botões de Ação
li.innerHTML = `
<span class="task-text">${task.text}</span>
<div class="task-actions">
<button class="complete-btn" title="Marcar como Concluída">
${task.completed ? 'Desfazer' : 'Concluir'}
</button>
<button class="edit-btn" title="Editar Tarefa">Editar</button>
<button class="delete-btn" title="Excluir Tarefa">Excluir</button>
</div>
`;
return li;
}

/**
* Renderiza a lista de tarefas com base no filtro atual.
*/
function renderTasks() {
taskList.innerHTML = ''; // Limpa a lista atual

// Aplica o filtro
const filteredTasks = tasks.filter(task => {
if (currentFilter === 'pending') return !task.completed;
if (currentFilter === 'completed') return task.completed;
return true; // 'all'
});

filteredTasks.forEach(task => {
const taskElement = createTaskElement(task);
taskList.appendChild(taskElement);
});
}

/**
* Adiciona uma nova tarefa ao array e renderiza.
* @param {string} text - O texto da nova tarefa.
*/
function addTask(text) {
const newTask = {
id: Date.now(), // ID único baseado no timestamp
text: text.trim(),
completed: false
};
tasks.push(newTask);
renderTasks();
taskInput.value = ''; // Limpa o input
}

/**
* Alterna o estado de 'completed' de uma tarefa.
* @param {number} id - ID da tarefa a ser alterada.
*/
function toggleCompleteTask(id) {
const taskIndex = tasks.findIndex(t => t.id === id);
if (taskIndex > -1) {
tasks[taskIndex].completed = !tasks[taskIndex].completed;
renderTasks(); // Renderiza para atualizar a classe e o texto do botão
}
}

/**
* Edita o texto de uma tarefa.
* @param {number} id - ID da tarefa a ser editada.
* @param {string} newText - O novo texto da tarefa.
*/
function editTask(id, newText) {
const taskIndex = tasks.findIndex(t => t.id === id);
if (taskIndex > -1) {
tasks[taskIndex].text = newText.trim();
renderTasks();
}
}

/**
* Exclui uma tarefa do array.
* @param {number} id - ID da tarefa a ser excluída.
*/
function deleteTask(id) {
tasks = tasks.filter(t => t.id !== id);
renderTasks();
}


// --- Lógica de Eventos ---

// 1. Evento do Formulário para Adicionar Tarefa
taskForm.addEventListener('submit', function(event) {
event.preventDefault();
if (taskInput.value.trim()) {
addTask(taskInput.value);
}
});


// 2. Delegação de Eventos na Lista de Tarefas (taskList)
// Este é o foco da aula: um único listener controla todos os cliques na lista.
taskList.addEventListener('click', function(event) {
const target = event.target;
// Encontra o item <li> mais próximo (o container da tarefa)
const taskItem = target.closest('.task-item');

if (!taskItem) return; // Se o clique não foi em um item de tarefa, ignora

// Obtém o ID da tarefa (convertido de string para number)
const taskId = Number(taskItem.dataset.id);

if (target.classList.contains('complete-btn')) {
// Marcar como concluída
toggleCompleteTask(taskId);
} else if (target.classList.contains('edit-btn')) {
// Editar tarefa
const currentText = taskItem.querySelector('.task-text').textContent;
const newText = prompt('Editar tarefa:', currentText);

if (newText !== null && newText.trim() !== '') {
editTask(taskId, newText);
}
} else if (target.classList.contains('delete-btn')) {
// Excluir tarefa
if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
deleteTask(taskId);
}
}
});


// 3. Eventos dos Botões de Filtro
filterButtons.forEach(button => {
button.addEventListener('click', function() {
// Remove a classe 'active' de todos os botões
filterButtons.forEach(btn => btn.classList.remove('active'));

// Adiciona a classe 'active' no botão clicado
button.classList.add('active');

// Atualiza o filtro e renderiza
currentFilter = button.dataset.filter;
renderTasks();
});
});

// Inicialização: Renderiza a lista de tarefas ao carregar a página (vazia ou com dados)
renderTasks();