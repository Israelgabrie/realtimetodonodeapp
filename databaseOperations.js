const express = require("express");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./data.db")


function createTable(){
    const createTableQuery = "CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,email TEXT,password TEXT)"
    db.run(createTableQuery,(err)=>{
        if(err){
            console.log("Error creating table users "+err)
        }
    })
}


function checkEmail(req,res,email,name,password){
  const emailSearchQuery = "SELECT * FROM users WHERE email = ?";
  db.get(emailSearchQuery,[email],(err,rows)=>{
    if(rows){
        res.render("usedEmail")
    }else{
        insertNewUser(name,email,password);
        res.render("login")
    }
  })
}

function insertNewUser(name,email,password){
    const insertQuery = "INSERT INTO users(name,email,password) VALUES(?,?,?)";
    db.run(insertQuery,[name,email,password],(err)=>{
        if(err){
            console.log("Error inserting new user "+err)
        }
    })
}


function newUser(req,res){
    const {name,email,password} = req.body;
    //this returns true if the email is in use
    checkEmail(req,res,email,name,password);
}



function handleDatabaseRequest(request,req,res){
    if(request == "newUser"){
        newUser(req,res);
    }
}

function createUserTable(email){
    var atSymbolStringNumber;
    for(var i =0;i<email.length;i++){
         if(email[i] == "@"){
            atSymbolStringNumber = i;
         }
    }
    const userTableName = email.substr(0,atSymbolStringNumber)
    const query = `CREATE TABLE IF NOT EXISTS ${userTableName}(id INTEGER PRIMARY KEY AUTOINCREMENT,todo TEXT)`;
    db.run(query,[],(err)=>{
        if(err){
            console.log("Error creating user table "+err);
        }
    });
    // sendUserTodos(userTableName)
    return userTableName
}

function userAuthentication(req,res){
    const {email,password} = req.body;
    const validationQuery = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.get(validationQuery,[email,password],(err,rows)=>{
       if(err){
          console.log("Error validating data "+err);
       }else{
        if(rows){
            const table = createUserTable(email);
            const name = rows.name;
             res.render("homepage",{userName:name,userEmail:email,userTable:table});
           }else{
            res.render("noAccount")
           }
       }
    })
}

module.exports = {
    handleDatabaseRequest,
    newUser,
    insertNewUser,
    checkEmail,
    createTable,
    userAuthentication
}