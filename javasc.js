const todoList= [];

function add(){
let todoListHTML=``;
let p=``;
let c=100;
for(let i=0;i<todoList.length;i++){
 let todo = todoList[i];
 let checkBox=todo.done;
 if(checkBox===true){
  checkBox=`<input type="checkbox" checked enabled>`;
   c=1;
 }else {
  checkBox=`<input type="checkbox"  disabled>`;
  c=0;
 }
if(c===1){
   p =`UNDO`;
}else{
  p=`DONE`;
}

 let html= `<p>${todo.name} ${checkBox} ${todo.time} 
 <button onclick="removeTodo(${i})">DELETE</button>
 <button onclick="duplicate(${i})">DUPLICATE</button>
 <button onclick="edit(${i})">EDIT</button>
 <button onclick="Done(${i})">${p}</button>
 <button onclick="date(${i})">Date</button>
 </p>`;
 todoListHTML+=html;
} 
if(todoList.length!=0){
html=`<button class="dela" onclick="delall()">DELETEALL</button>`;
todoListHTML+=html;
}
document.querySelector(`.js-todo-list`).innerHTML=todoListHTML;
}


function addTodo() {
const input=document.querySelector(`.js-name-input`);
let name=input.value;
if(name ===''){
  alert(`enter a todo`);
  return;
}
todoList.push({name: name, done: false});
input.value='';
add();
}

function removeTodo(i){
todoList.splice(i,1);
add();
}

function delall(){
  const c=todoList.length ;
todoList.splice(0,c);
add();
}
function duplicate(i){
  todoList.push({name: todoList[i].name, done: false, time: todoList[i].time});
  add();
}

document.querySelector('.js-name-input').addEventListener('keydown', function(event) {
  if(event.key === 'Enter'){
    addTodo();
  }
});
//usestate

function Done(i){
if( todoList[i].done ===false){
  todoList[i].done=true;
}else 
{
  todoList[i].done=false;
}
  add();
}
function edit(i){
  const newName = prompt("Edit your todo");
  if(newName !== null && newName !== ""){
    todoList[i].name = newName;
    add();
  }
}
function Search(){
  let d=0;
const search = prompt("Enter your search");
for(let i=0;i<todoList.length;i++){
if(search===todoList[i].name){
alert("Valid search");
d=1;
}
}
if(d===0){
  alert("Invalid search");
  }
}
function date(i){
const period = prompt("Enter your search");
todoList[i].time=period;
add();
}