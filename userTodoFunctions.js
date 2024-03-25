const express = require("express");
const app = express();
const sqlite3 = require("sqlite3")
const db = new sqlite3.Database("./data.db")


function loadTodos(email,tableName,io){
    const selectQuery = `SELECT * FROM ${tableName}`;
    db.all(selectQuery,[],(err,rows)=>{
        io.emit("collected todo",rows,email);
    })    
}


function getUserTodo(tableName,email,io){
    console.log(tableName,email)
    const selectQuery = `SELECT * FROM ${tableName}`;
    db.all(selectQuery,[],(err,rows)=>{
        io.emit("collected todo",rows,email);
    })     

}

function addTodoToTable(todoValue,userEmail,tableName,io){
    const insertTodo = `INSERT INTO ${tableName}(todo)  VALUES(?)`;
    db.run(insertTodo,[todoValue],(err)=>{
       if(err){
        console.log("error inserting todo "+err)
       }else{
         getUserTodo(tableName,userEmail,io);
       }
    })
}

function showcompletedTodos(todoId,recievedEmail,io,isChecked){
    io.emit("recievedCompletedTodos",todoId,recievedEmail,isChecked);
}

function removeTodo(todoId,tableName,email,io){
   const deleteQuery = ` DELETE FROM ${tableName} WHERE id = ?`;

    const selectAllQuery = `SELECT * FROM ${tableName}`;
    db.run(deleteQuery,[todoId],(err)=>{
        if(err){
            console.log("error deleting tood "+err)
        }else{
           db.all(selectAllQuery,[],(err,rows)=>{
            if(err){
                console.log("error selecting todos "+err)
            }else{
                io.emit("todoRemoved",rows,email);
            }
           })
        }
    }) 
} 



module.exports = {
    addTodoToTable,
    getUserTodo,
    loadTodos,
    showcompletedTodos,
    removeTodo
}

