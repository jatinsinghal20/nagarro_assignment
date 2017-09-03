let express = require('express');
let bodyParser = require('body-parser');
let todoDB = require('./db');

const PORT = 3000;

let app = express();
app.use('/', express.static(__dirname+'/public'));
app.use('/', bodyParser.urlencoded({extended: true}));
app.get('/api/todos', function(req, res) {
   res.send(todoDB.todos);
});

app.post('/api/todos', function(req, res) {
    let todo = req.body.todo_title;
    if (todo===undefined||todo.trim()==='') {
        res.status(400).send('Error!! Bad request!!');
    } else {
        let newTodo = {
            title: todo,
            status: todoDB.status.ACTIVE,
        };
        let id = todoDB.nextId++;
        todoDB.todos[id] = newTodo;
        let finalTodo={};
        finalTodo[id] = newTodo;
        res.send(finalTodo);
    }
});

app.put('/api/todos/:id', function(req, res) {
    const id =req.params.id;
    if (todoDB.todos[id]===undefined) {
        res.status(400).send('Error!! Bad request!!');
    } else {
        if (todoDB.todos[id].status === todoDB.status.ACTIVE) {
            todoDB.todos[id].status = todoDB.status.COMPLETE;
        } else {
            todoDB.todos[id].status = todoDB.status.ACTIVE;
        }
        let final = {};
        final[id] = todoDB.todos[id];
        res.send(final);
    }
});

app.delete('/api/todos/:id', function(req, res) {
    const id =req.params.id;
    if (todoDB.todos[id]===undefined) {
        res.status(400).send('Error!! Bad request!!');
    } else {
        let status = todoDB.todos[id].status;
        todoDB.todos[id].status = todoDB.status.DELETED;
        res.send({status: status, todo: todoDB.todos[id]});
    }
});

app.listen(PORT, console.log('Server running on port '+PORT));
