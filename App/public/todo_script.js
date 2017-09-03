const STATUS_OK = 200;
const RESPONSE_DONE = 4;
const TODO_ACTIVE_ID = 'active';
const TODO_DELETED_ID= 'deleted';
const TODO_COMPLETE_ID = 'complete';
const NEW_TODO_ID = 'new_todo';

/**
 *  Add all todos to their own respective section
 * @param {todoData} todoData of todos
 * @return {void} no data is returned
 * */
function addTodoElements(todoData) {
    let parentActive = document.getElementById(TODO_ACTIVE_ID);
    let parentComplete = document.getElementById(TODO_COMPLETE_ID);
    let parentDeleted = document.getElementById(TODO_DELETED_ID);
    parentActive.innerHTML = parentComplete.innerHTML = parentDeleted.
        innerHTML = '';
    let todos = JSON.parse(todoData);
    let keys = Object.keys(todos);
    keys.forEach(function(key) {
        let newElement = createTodoElement(key, todos[key]);
        if (newElement.parent === 'ACTIVE') {
            parentActive.appendChild(newElement.element);
        } else if (newElement.parent === 'COMPLETE' ) {
            parentComplete.appendChild(newElement.element);
        } else {
            parentDeleted.appendChild(newElement.element);
        }
    });
}

/**
 *
 * @param {id} id of new_todo
 * @param {todo} todo to add
 * @return {{parent: (number|string|*), element: Element}} parent of the _todo
 * along with _todo
 */
function createTodoElement(id, todo) {
    let newElement = document.createElement('div');
    newElement.setAttribute('id', id);
    if (todo.status !== 'DELETED') {
        newElement.setAttribute('class', 'row');
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.setAttribute('value', id);
        checkbox.setAttribute('data-rid', id);
        checkbox.setAttribute('onchange', 'changeStatusTodoAJAX('+id+')');
        if (todo.status === 'COMPLETE') {
            checkbox.checked = 'TRUE';
        }

        checkbox.setAttribute('class', 'col-2 check_box');
        newElement.appendChild(checkbox);
        let label = document.createElement('label');
        label.innerText = todo.title;
        label.setAttribute('class', 'col-8');
        label.setAttribute('for', id);
        newElement.appendChild(label);
        let close = document.createElement('button');
        close.setAttribute('class', 'icon close');
        close.innerHTML = '&times;';
        close.setAttribute('onclick', 'deleteTodoAJAX('+id+')');
        newElement.appendChild(close);
    } else newElement.innerText = todo.title;

    return ({parent: todo.status, element: newElement});
}

/**
 * Function to execute on load
 */
function getTodosAJAX() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/todos', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === RESPONSE_DONE) {
            if (xhr.status === STATUS_OK) {
                addTodoElements(xhr.responseText);
            }
        }
    };

    xhr.send(data=null);
}

/**
 * Function to delete a todo
 * @param {id} id of todo to delete
 */
function deleteTodoAJAX(id) {
    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', '/api/todos/'+id, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState===RESPONSE_DONE) {
            if (xhr.status===STATUS_OK) {
                let oldChild = document.getElementById(id);
                let data = JSON.parse(xhr.responseText);
                if (data.status === 'ACTIVE') {
                    let parentActive = document.getElementById(TODO_ACTIVE_ID);
                    parentActive.removeChild(oldChild);
                } else {
                    let parentComplete = document.
                        getElementById(TODO_COMPLETE_ID);
                    parentComplete.removeChild(oldChild);
                }
                let newElement =createTodoElement(id, data.todo);
                let parentDeleted =document.getElementById(TODO_DELETED_ID);
                parentDeleted.appendChild(newElement.element);
            }
        }
    };
    xhr.send(null);
}

/**
 * Function to perform check uncheck operations
 * @param {id} id of the todo
 */
function changeStatusTodoAJAX(id) {
    let xhr = new XMLHttpRequest();
    xhr.open('PUT', '/api/todos/'+id, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState===RESPONSE_DONE) {
            if (xhr.status===STATUS_OK) {
                let parentActive = document.getElementById(TODO_ACTIVE_ID);
                let parentComplete = document.getElementById(TODO_COMPLETE_ID);
                let oldChild = document.getElementById(id);
                let todo = JSON.parse(xhr.responseText);
                let x = Object.keys(todo)[0];
                let newElement = createTodoElement(x, todo[x]);
                if (newElement.parent==='ACTIVE') {
                    parentComplete.removeChild(oldChild);
                    parentActive.appendChild(newElement.element);
                } else {
                    parentActive.removeChild(oldChild);
                    parentComplete.appendChild(newElement.element);
                }
            }
        }
    };
    xhr.send(null);
}

/**
 * Function to add a new todo
 */
function addTodoAJAX() {
    let todoTitle = document.getElementById(NEW_TODO_ID).value;
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/todos/', true);

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    let data = 'todo_title='+encodeURI(todoTitle);
    xhr.onreadystatechange = function() {
        if (xhr.readyState===RESPONSE_DONE) {
            if (xhr.status===STATUS_OK) {
                let parentActive = document.getElementById(TODO_ACTIVE_ID);
                let todo = JSON.parse(xhr.responseText);
                let x = Object.keys(todo)[0];
                let newElement = createTodoElement(x, todo[x]);
                let inputElement = document.getElementById(NEW_TODO_ID);
                inputElement.value= '';
                inputElement.placeholder = 'ENTER A NEW TASK';
                parentActive.appendChild(newElement.element);
            }
        }
    };
    xhr.send(data);
}

/**
 * Function to hide list of completed and deleted todos
 * @param {divID} divID of the div to hide
 * @param {buttonID} buttonID of button totoggle
 */
function hide(divID, buttonID) {
    let element = document.getElementById(divID);
    let button = document.getElementById(buttonID);
    if (element.style.display==='none') {
        element.style.display = 'block';
        button.innerHTML ='&and;';
    } else {
        element.style.display = 'none';
        button.innerHTML = '&or;';
    }
}

window.onload = getTodosAJAX();
