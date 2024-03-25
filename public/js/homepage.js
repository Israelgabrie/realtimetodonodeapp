const socket = io("http://192.168.7.12:4500")

document.getElementById("addTodo").onclick = () =>{
 if(document.getElementById("todoValue").value){
    socket.emit("todoAdded",document.getElementById("todoValue").value,email,tableName)
    document.getElementById("todoValue").value = '';
 }else{
    alert("Please enter a valid todo");
 }
}

document.addEventListener("keydown",(e)=>{
    if(e.code == "Enter"){
        if(document.getElementById("todoValue").value){
            socket.emit("todoAdded",document.getElementById("todoValue").value,email,tableName)
            document.getElementById("todoValue").value = '';
         }else{
            alert("Please enter a valid todo");
         }
    }
})


window.addEventListener('load',()=>{
    socket.emit("loadTodo",email,tableName)
})


function displayTodos(todos){
    document.getElementById("todo-list").innerHTML = "";
    for(var i =0;i<todos.length;i++){
        document.getElementById("todo-list").innerHTML += `<div class="todo-item" id="${todos[i].id}">
        <input type="checkbox" class="checkBoxes" onChange="checkBoxchange(this.parentNode.id,this.checked)">
        <label>${todos[i].todo}</label>
        <button class="remove-btn" id="removeTodo" onClick="removeTodoFunction(this.parentNode.id)">Remove</button>
      </div>`;
    }
}

function checkBoxchange(identity,isChecked){
   socket.emit("doneTodo",identity,email,isChecked);
}


function asyncCheckedTodo(id,done){
  var element = document.getElementById(`${id}`);
  var todoElement = element.querySelector(".checkBoxes");
  todoElement.checked = done;

}


socket.on("recievedCompletedTodos",(todoIdentity,recievedEmail,isDone)=>{
    if(recievedEmail == email){
        asyncCheckedTodo(todoIdentity,isDone)
    }
})



socket.on("collected todo",(rows,sentEmail)=>{
    if(sentEmail == email){
     displayTodos(rows);
    }
 })



function removeTodoFunction(todoId){
    socket.emit("removeTodo",todoId,tableName,email);
}

function displayNewTodos(rows){
    document.getElementById("todo-list").innerHTML = "";
    for(var i =0;i<rows.length;i++){
        document.getElementById("todo-list").innerHTML += `<div class="todo-item" id="${rows[i].id}">
        <input type="checkbox" class="checkBoxes" onChange="checkBoxchange(this.parentNode.id)" >
        <label>${rows[i].todo}</label>
        <button class="remove-btn" id="removeTodo" onClick(removeTodoFunction(this.parentNode.id))>Remove</button>
      </div>`; 
    }
}


socket.on("todoRemoved",(rows,deliveredEmail)=>{
   if(email == deliveredEmail){
    displayNewTodos(rows);
   }
});