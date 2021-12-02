const express = require('express')
const { v4: uuidv4} = require('uuid')
const app = express()
app.use(express.json());


const users = []; 
const todos = [];


function checkExistUserAccount (request, response, next) {
    const { username } = request.headers;

    const user = users.find(user => user.username === username)

    if(!user){
        return response.status(400).json({error: "User not found!"})
    }

    request.user = user;

    next();

}

app.post('/users', function (request, response) {
    
   const { name, username} = request.body;
   
    const verifyIfUserExist = users.some(user => 
        user.username === username
    );

    if(verifyIfUserExist){
        return response.status(400).json({error: "Username already exists"})
    }

    users.push({
        id: uuidv4(),
        name,
        username,
        todos: []
    })

    return response.status(201).send();
})

app.get('/todos', checkExistUserAccount, function (request, response) {
    const {user} = request;

    return response.json(user.todos);
})

app.post('/todos', checkExistUserAccount, function (request, response) {
    const {user} = request;
    const {title, deadline} = request.body;

    user.todos.push({
        id: uuidv4(),
        title,
        deadline: new Date(deadline),
        done: false,
        created_at: new Date()
    })

    return response.status(201).json(user.todos);
})

app.put('/todos/:id', checkExistUserAccount, function (request, response) {
    const { user } = request;
    const { id } = request.params;
    const {title, deadline} = request.body;

    todo = user.todos.find(todo => todo.id === id)

    todo.title = title;
    todo.deadline = new Date(deadline)

    return response.status(201).send();
});


app.patch('/todos/:id/done', checkExistUserAccount, function (request, response) {
    const { user } = request;
    const { id } = request.params;

    todo = user.todos.find(todo => todo.id === id)

    if(todo.done === false){
        todo.done = true
    }else{
        todo.done = false
    }

    return response.status(201).json(todo);
})

app.delete('/todos/:id', checkExistUserAccount, function (request, response) {
    const { user } = request;
    const { id } = request.params;

    user.todos.splice(id, 1);

    return response.json(user);

})
app.listen(3333)