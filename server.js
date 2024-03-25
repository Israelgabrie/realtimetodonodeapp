const express = require("express");
const socketIo = require('socket.io')
const app = express();
const cors = require("cors")
const bodyParser = require("body-parser");
const databaseOperations = require("./databaseOperations.js");
const port = 4500;
const userTodoFunctions = require("./userTodoFunctions.js");

app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine","ejs")
app.use(express.static('public'))

databaseOperations.createTable()

app.get("/",(req,res)=>{
    res.render("register")
})
 
app.get("/register",(req,res)=>{
    res.render("homepage");
})

app.get("/homepage",(req,res)=>{
    res.render("register")
})

app.post("/homepage",(req,res)=>{
    databaseOperations.userAuthentication(req,res);
})

app.post("/submitRegister",(req,res)=>{
   databaseOperations.newUser(req,res);
})

app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/login",(req,res)=>{
    res.render("login")
})


app.get("*",(req,res)=>{
    res.render("noPage")
})



const server = app.listen(port, '0.0.0.0',()=>{
    console.log("App is listening on port "+port);
})

const io = socketIo(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
})

io.on("connection",(socket)=>{

    socket.on("todoAdded",(todoValue,userEmail,tableName)=>{
        userTodoFunctions.addTodoToTable(todoValue,userEmail,tableName,io);
})

socket.on("loadTodo",(email,tableName)=>{
    userTodoFunctions.loadTodos(email,tableName,io);
})


socket.on("doneTodo",(todoId,email,isChecked)=>{
    userTodoFunctions.showcompletedTodos(todoId,email,io,isChecked);
})


socket.on("removeTodo",(todoId,tableName,email)=>{
   userTodoFunctions.removeTodo(todoId,tableName,email,io);    
});


})