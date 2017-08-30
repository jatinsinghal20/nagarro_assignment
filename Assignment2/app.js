var express =  require("express"),
    bodyParser = require("body-parser"),
    todo_db = require('./db');

const  PORT = 3000;

var app = express();

app.use('/',bodyParser.urlencoded({extended : true}));
app.get('/api/todos',function (req,res) {
   res.send(todo_db.todos);
});

app.post('/api/todos',function (req,res) {
    var todo = req.body.todo_title;
    if(todo===undefined||todo.trim()===""){
        res.status(400).send("Error!! Bad request!!");
    }else {
        var new_todo = {
            title: todo,
            status: todo_db.status.ACTIVE
        }
        todo_db.todos[todo_db.nextId++] = new_todo;
        res.send(todo_db.todos);
    }
});

app.put('/api/todos/:id',function (req,res) {
    const id =req.params.id;
    if(todo_db.todos[id]===undefined){
        res.status(400).send("Error!! Bad request!!");
    }
    else {
        var todo = req.body;
        if(todo===undefined||todo.todo_title==undefined||todo.todo_title.trim()===""){
            todo_db.todos[id].status= todo_db.status.COMPLETE;
        }
        else todo_db.todos[id].title = todo.todo_title;
        res.send(todo_db.todos[id]);
    }
});

app.delete('/api/todos/:id',function (req,res) {
    const id =req.params.id;
    if(todo_db.todos[id]===undefined){
        res.status(400).send("Error!! Bad request!!");
    }
    else {
        todo_db.todos[id].status = todo_db.status.DELETED;
        res.send(todo_db.todos);
    }
});

app.get('/api/todos/active',function (req,res) {
    var todos_list =[];
    for(var i=1;i<todo_db.nextId;i++){
        if(todo_db.todos[i].status === todo_db.status.ACTIVE){
            todos_list.push(todo_db.todos[i]);
        }
    }
    res.send(todos_list);
});

app.get('/api/todos/complete',function (req,res) {
    var todos_list =[];
    for(var i=1;i<todo_db.nextId;i++){
        if(todo_db.todos[i].status === todo_db.status.COMPLETE){
            todos_list.push(todo_db.todos[i]);
        }
    }
    res.send(todos_list);
});

app.get('/api/todos/deleted',function (req,res) {
    var todos_list =[];
    for(var i=1;i<todo_db.nextId;i++){
        if(todo_db.todos[i].status === todo_db.status.DELETED){
            todos_list.push(todo_db.todos[i]);
        }
    }
    res.send(todos_list);
});

app.put('/api/todos/complete/:id',function (req,res) {
    const id =req.params.id;
    if(todo_db.todos[id]===undefined||todo_db.todos[id]!=todo_db.status.ACTIVE){
        res.status(400).send("Error!! Bad request!!");
    }
    todo_db.todos[id].status = todo_db.status.COMPLETE;
});

app.put('/api/todos/delete/:id',function (req,res) {
    const id =req.params.id;
    if(todo_db.todos[id]===undefined){
        res.status(400).send("Error!! Bad request!!");
    }
    todo_db.todos[id].status = todo_db.status.delete;
});

app.listen(PORT,console.log("Server running on port "+PORT));