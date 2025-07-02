const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

let todos = [];

// Загрузка из localStorage
window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('todos');
    if (saved) {
        todos = JSON.parse(saved);
        todos.forEach(todo => renderTodo(todo, false));
    }
});

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodo(todo, animate = true) {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.completed ? ' completed' : '') + (animate ? ' added' : '');
    li.dataset.id = todo.id;

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;
    text.tabIndex = 0;

    //Два клика или кнопка для редактировния
    text.addEventListener('dblclick', () => startEditTodo(todo.id, text));

    const actions = document.createElement('div');
    actions.className = 'todo-actions';

    const doneBtn = document.createElement('button');
    doneBtn.innerHTML = todo.completed ? '✅' : '✔️';
    doneBtn.title = 'Отметить как выполнено';
    doneBtn.onclick = () => toggleComplete(todo.id);
    actions.appendChild(doneBtn);

    const editBtn = document.createElement('button');
    editBtn.innerHTML = '✏️';
    editBtn.title = 'Редактировать';
    editBtn.onclick = () => startEditTodo(todo.id, text);
    actions.appendChild(editBtn);

    const delBtn = document.createElement('button');
    delBtn.innerHTML = '🗑️';
    delBtn.title = 'Удалить';
    delBtn.onclick = () => removeTodo(todo.id, li);
    actions.appendChild(delBtn);

    li.appendChild(text);
    li.appendChild(actions);
    todoList.appendChild(li);

    if (animate) {
        setTimeout(() => li.classList.remove('added'), 400);
    }
}

function addTodo(text) {
    const todo = {
        id: Date.now(),
        text,
        completed: false
    };
    todos.push(todo);
    renderTodo(todo);
    saveTodos();
}

todoForm.addEventListener('submit', e => {
    e.preventDefault();
    const value = todoInput.value.trim();
    if (value) {
        addTodo(value);
        todoInput.value = '';
    }
});

todoInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        todoForm.dispatchEvent(new Event('submit'));
    }
});

function removeTodo(id, li) {
    li.classList.add('removed');
    setTimeout(() => {
        todos = todos.filter(t => t.id !== id);
        li.remove();
        saveTodos();
    }, 300);
}

function toggleComplete(id) {
    todos = todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
    updateList();
    saveTodos();
}

function startEditTodo(id, textElem) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = todo.text;
    input.className = 'todo-text';
    input.onkeydown = e => {
        if (e.key === 'Enter') {
            finishEditTodo(id, input.value, textElem);
        } else if (e.key === 'Escape') {
            textElem.style.display = '';
            input.remove();
        }
    };
    input.onblur = () => finishEditTodo(id, input.value, textElem);
    textElem.style.display = 'none';
    textElem.parentNode.insertBefore(input, textElem);
    input.focus();
    input.select();
}

function finishEditTodo(id, newText, textElem) {
    newText = newText.trim();
    if (newText) {
        todos = todos.map(todo => todo.id === id ? { ...todo, text: newText } : todo);
        updateList();
        saveTodos();
    }
    textElem.style.display = '';
    if (textElem.previousSibling && textElem.previousSibling.tagName === 'INPUT') {
        textElem.previousSibling.remove();
    }
}

function updateList() {
    todoList.innerHTML = '';
    todos.forEach(todo => renderTodo(todo, false));
} 