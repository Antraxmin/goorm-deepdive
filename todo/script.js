const todoList = document.getElementById('list');
const createTodoButton = document.getElementById('create-btn');

let todos = [];

createTodoButton.addEventListener('click', handleCreateNewTodo);

function handleCreateNewTodo() {
    const newTodo = createTodoObject();
    todos.unshift(newTodo);
    renderTodo(newTodo);
    saveTodosToLocalStorage();
}

function renderTodo(todo) {
    const { todoElement, inputElement } = createTodoElement(todo);
    todoList.prepend(todoElement);
    focusAndEnableInput(inputElement);
}

function loadAndDisplayTodos() {
    loadTodosFromLocalStorage();
    todos.forEach(renderTodo);
}

function createTodoObject() {
    return {
        id: Date.now(),
        text: '',
        isComplete: false
    };
}

function createTodoElement(todo) {
    const todoElement = document.createElement('div');
    todoElement.classList.add('item');

    const checkboxElement = createCheckboxElement(todo, todoElement);
    const inputElement = createInputElement(todo);
    const actionsElement = createActionsElement(todo, todoElement, inputElement);

    todoElement.append(checkboxElement, inputElement, actionsElement);

    return { todoElement, inputElement };
}

function createCheckboxElement(todo, todoElement) {
    const checkboxElement = document.createElement('input');
    checkboxElement.type = 'checkbox';
    checkboxElement.checked = todo.isComplete;

    if (todo.isComplete) {
        todoElement.classList.add('complete');
    }

    checkboxElement.addEventListener('change', () => handleTodoStatusChange(todo, todoElement, checkboxElement));

    return checkboxElement;
}

function createInputElement(todo) {
    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.value = todo.text;
    inputElement.setAttribute('disabled', '');

    inputElement.addEventListener('blur', () => disableInput(inputElement));
    inputElement.addEventListener('input', () => updateTodoText(todo, inputElement));

    return inputElement;
}

function createActionsElement(todo, todoElement, inputElement) {
    const actionsElement = document.createElement('div');
    actionsElement.classList.add('actions');

    const editButton = createActionButton('edit', () => enableEditMode(inputElement));
    const removeButton = createActionButton('remove_circle', () => removeTodo(todo, todoElement));

    actionsElement.append(editButton, removeButton);

    return actionsElement;
}

function createActionButton(iconName, onClickHandler) {
    const button = document.createElement('button');
    button.classList.add('material-icons');
    button.innerText = iconName;
    button.addEventListener('click', onClickHandler);
    return button;
}

function handleTodoStatusChange(todo, todoElement, checkboxElement) {
    todo.isComplete = checkboxElement.checked;
    todoElement.classList.toggle('complete', todo.isComplete);

    const inputElement = todoElement.querySelector('input[type="text"]');

    if (todo.isComplete) {
        inputElement.style.textDecoration = 'line-through';
        inputElement.style.color = '#888';
    } else {
        inputElement.style.textDecoration = 'none';
        inputElement.style.color = '';
    }

    saveTodosToLocalStorage();
}

function updateTodoText(todo, inputElement) {
    todo.text = inputElement.value;
    saveTodosToLocalStorage();
}

function enableEditMode(inputElement) {
    inputElement.removeAttribute('disabled');
    inputElement.focus();
}

function disableInput(inputElement) {
    inputElement.setAttribute('disabled', '');
}

function removeTodo(todo, todoElement) {
    todos = todos.filter(t => t.id !== todo.id);
    todoElement.remove();
    saveTodosToLocalStorage();
}

function focusAndEnableInput(inputElement) {
    inputElement.removeAttribute('disabled');
    inputElement.focus();
}

function saveTodosToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodosFromLocalStorage() {
    const storedTodos = localStorage.getItem('todos');
    todos = storedTodos ? JSON.parse(storedTodos) : [];
}

loadAndDisplayTodos();