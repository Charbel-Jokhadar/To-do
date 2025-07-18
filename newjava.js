const todoList = [];
const AtodoList=[];
const DtodoList=[];
let recentlyDeleted=null;
let undoTimeout=null;
let temparr=null;
function addTodo(){
  const nameinput =document.querySelector(`.js-name-input`);
  const dateinput=document.querySelector(`.js-date-input`);
  const descriptioninput=document.querySelector(`.js-description-input`);
  let name= nameinput.value;
  let date= dateinput.value;
  let description= descriptioninput.value;
  if(name===``|| date===``){
    alert(`YOU MUST FILL ALL INPUT`)
    return;
  }

   const namePattern = /^[A-Za-z\s]+$/;
  if (!namePattern.test(name)) {
    alert(`Name must contain only letters and spaces.`);
    nameinput.value = ``;
    return;
  }

 const datePattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const match = date.match(datePattern);//match[0]=full date "string" match[1]=day match[2]=month match[3]=year

    if (!match) {
    alert(`You must enter the date in d/m/y format`);
     dateinput.value = ``;
    return;
  }

  const day = parseInt(match[1]);//parseInt convert string to an integer
  const month = parseInt(match[2]);
  const year = parseInt(match[3]);

   if (day < 1 || day > 31) {
    alert(`Day must be between 1 and 31`);
     dateinput.value = ``;
    return;
  }

   if (month < 1 || month > 12) {
    alert(`Month must be between 1 and 12`);
     dateinput.value = ``;
    return;
  }

  const today = new Date();
  today.setHours(0,0,0,0);

  const enteredDate = new Date(year, month - 1, day);
  enteredDate.setHours(0,0,0,0);

  if (enteredDate < today) {
  alert(`You must enter a date from ${today.toDateString()} or in the future`);
  dateinput.value = ``;
  return;
}

   if(year < 2025 || year >= 2027){
    alert(`year must be between 2025 & 2026`)
    dateinput.value=``;
    return;
  }

  todoList.push({
  name:name,
  done:false,
  date:date,
  description:description
  });
 nameinput.value = ``;
 dateinput.value = ``;
 descriptioninput.value=``;
  add();
}


function add(){
  let todoListHTML = ``;
  let p=``;
  let c=100;

  for (let i=0;i<todoList.length;i++){
   let todo = todoList[i];
   let checkBox = todo.done;

    if (checkBox === true) {
      checkBox = `<input class="press" type="checkbox" checked enabled>`;
      c = 1;
    } else {
      checkBox = `<input class="press" type="checkbox" disabled>`;
      c = 0;
    }
    let color=``;
    if (c === 1) {
      color='background-color: lightgreen;';
      p = `UNDO`;
    } else {
      p = `DONE`;
    }
    
  
    let html = `
       <p class="todo-item" title="Double-click to view description" data-index="${i}" data-name="${todo.name.toLowerCase()}" style="${color}">
      ${todo.name}
      ${checkBox}
      ${todo.date}
        <button onclick="showPopup(${i})">Edit</button>
      </p>
    `;

    todoListHTML += html;
  }

  if (todoList.length != 0) {
    let html = `<button class="dela" onclick="delall()">DELETE ALL</button>
    <button class="alldone" onclick="showdone()">DONE TODO</button>
    <button class="DeleteDoneTodo" onclick="Deletedonetodo()">REMOVE DONE</button>
    <button onclick="saveTodos()">SAVE TODOS</button>
    <button onclick="clearSavedTodos()">CLEAR SAVED TODOS</button>`;
    todoListHTML += html;
  }

   if (todoList.length >= 2) {
    let html = `<button class="Acending-Sort" onclick="ASort()">A-Sorting</button>`;
    todoListHTML += html;
  }
   if (todoList.length >= 2) {
    let html = `<button class="Acending-Sort" onclick="DSort()">D-Sorting</button>`;
    todoListHTML += html;
  }

  document.querySelector(`.js-todo-list`).innerHTML = todoListHTML;

const items = document.querySelectorAll('.todo-item');
  items.forEach(function(item) {
     let originalColor = item.style.backgroundColor;

    item.addEventListener('mouseover', function() {
      item.style.backgroundColor = `#f0f0f0`;
    });
    item.addEventListener('mouseout', function() {
      item.style.backgroundColor = originalColor;
    });
    item.addEventListener('dblclick',function(){
      const i = item.getAttribute('data-index');
    description(i);
    })
});
}

function ASort() {
    AtodoList.length = 0;
  let tempList = [...todoList];
  while (tempList.length > 0) {
    let min = 0;
    for (let j = 1; j < tempList.length; j++) {
      const [dayMin, monthMin, yearMin] = tempList[min].date.split('/').map(Number);
      const [dayJ, monthJ, yearJ] = tempList[j].date.split('/').map(Number);
      const dateMin = new Date(yearMin, monthMin - 1, dayMin);
      const dateJ = new Date(yearJ, monthJ - 1, dayJ);
      if (dateJ < dateMin) {
        min = j;
      }
    }
    AtodoList.push(tempList[min]);
    tempList.splice(min, 1);
  }
  todoList.length = 0;
  AtodoList.forEach(item => todoList.push(item));

  add(); 
}

function DSort(){
  DtodoList.length = 0;

let templist = [...todoList];
while(templist.length > 0){
  let max=0;
  for (let j=1;j<templist.length;j++){
    const [dayMax, monthMax, yearMax] = templist[max].date.split(`/`).map(Number);
    const [dayJ, monthJ, yearJ] = templist[j].date.split(`/`).map(Number);
    const dateMax = new Date(yearMax, monthMax -1, dayMax);
    const dateJ = new Date (yearJ, monthJ -1 , dayJ);
    if(dateJ > dateMax){
      max=j;
    }
  }
  DtodoList.push(templist[max])
  templist.splice(max, 1);
}
todoList.length=0;
DtodoList.forEach(item => todoList.push(item));
add();
}


function removeTodo(i) {
  recentlyDeleted={
    todo: todoList[i],
    index: i
  };
  todoList.splice(i, 1);
  add();
  ShowUndo();
  if (undoTimeout !== null && undoTimeout !== undefined){
    clearTimeout(undoTimeout);
  }
    undoTimeout = setTimeout(() => {
    recentlyDeleted = null;
    removeUndoBanner();
  }, 5000);
}

function ShowUndo(){
  removeUndoBanner();
  const banner = document.createElement(`div`);
  banner.className=`undo-banner`;
  banner.innerHTML=`
  Todo deleted.
  <button onclick="undoDelete()">Undo</button>
  `;
  document.body.appendChild(banner);
}

function undoDelete() {
  if (recentlyDeleted !== null && recentlyDeleted !== undefined) {
    const { todo, index } = recentlyDeleted;
    todoList.splice(index, 0, todo); 
    recentlyDeleted = null;
    add();
    removeUndoBanner();

    if (undoTimeout !== null && undoTimeout !== undefined) {
      clearTimeout(undoTimeout);
      undoTimeout = null;
    }
  }
}

function removeUndoBanner() {
  const banner = document.querySelector('.undo-banner');
  if (banner !== null && banner !== undefined) {
    banner.remove();
  }
}



function delall() {
  
   temparr = [...todoList];

  const c = todoList.length;
  todoList.splice(0, c);
  add();
   ShowUndoBanner();
    if (undoTimeout !== null && undoTimeout !== undefined){
    clearTimeout(undoTimeout);
  }
    undoTimeout = setTimeout(() => {
    temparr = null;
    removeUndoBanner();
  }, 5000);
}

function ShowUndoBanner(){
  removeUndoBanner();
  const banner = document.createElement(`div`);
  banner.className=`undo-banner`;
  banner.innerHTML=`
  Todo deleted.
  <button onclick="undoDeleted()">Undo</button>
  `;
  document.body.appendChild(banner);
}

function undoDeleted(){
  if (temparr !== null && temparr !== undefined) {
    temparr.forEach(todo => todoList.push(todo));
    temparr=null;
    add();
    removeUndoBanner();

    if (undoTimeout !== null && undoTimeout !== undefined) {
      clearTimeout(undoTimeout);
      undoTimeout = null;
    }
  }
}


function duplicate(i) {
  const c = prompt("enter the number of duplicate that u need ");
  for (let j = 0; j < c; j++) {
  todoList.push({ name: todoList[i].name, done: false, date: todoList[i].date });
  add();
}}


document.querySelector('.js-name-input').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    addTodo();
  }
});

document.querySelector('.js-date-input').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    addTodo();
  }
});

document.querySelector('.js-description-input').addEventListener('keydown',function(event){
  if(event.key === 'Enter'){
    addTodo();
  }
})

document.querySelector('.js-search-input').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    Search();
  }
});
document.querySelector('.js-searchdate-input').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    Search();
  }
});
function Done(i) {
  if (todoList[i].done === false) {
    todoList[i].done = true;
  } else {
    todoList[i].done = false;
  }
  add();
}


function edit(i) {
  const newName = prompt("Edit your todo");
  
const namePattern = /^[A-Za-z\s]+$/;
  if (!namePattern.test(newName)) {
    alert(`Name must contain only letters and spaces.`);
    nameinput.value = ``;
    return;
  }


  if (newName !== null && newName !== "") {
    todoList[i].name = newName;
    add();
  }
}


/*function Search() {
  let d = 0;
  const search = prompt("Enter your search");
  for (let i = 0; i < todoList.length; i++) {
    if (search === todoList[i].name) {
      alert("Valid search");
      d = 1;
    }
  }
  if (d === 0) {
    alert("Invalid search");
  }
}*/

function filterTodos() {
  const searchInput = document.querySelector('.js-search-input');
  const searchValue = searchInput.value.trim().toLowerCase();

  const todoItems = document.querySelectorAll('.todo-item');

  todoItems.forEach(function(item) {
    const todoText = item.getAttribute('data-name');

    if (todoText.includes(searchValue)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}


function filterDate() {
   const searchDateInput = document.querySelector('.js-searchdate-input');
  const searchDateValue = searchDateInput.value.trim();

  const todoItems = document.querySelectorAll('.todo-item');

 if (searchDateValue === '') {
    todoItems.forEach(function(item) {
      item.style.display = '';
    });
    return; 
  }

  todoItems.forEach(function(item) {
 
    const todoDate = item.textContent.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
    if (todoDate) {
      if (todoDate[0].includes(searchDateValue)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    } else {
      item.style.display = 'none';
    }
  });
}
document.querySelector('.js-search-input').addEventListener('input', function() {
  filterTodos();
});
document.querySelector(`.js-searchdate-input`).addEventListener(`input`,function(){
   filterDate();
})

  function ResetTodo(){
    document.querySelector(`.js-search-input`).value=``;
    filterTodos();
  }
function ResetDate(){
   document.querySelector(`.js-searchdate-input`).value=``;
   filterDate(); 
  }

function date(i) {
  const period = prompt("Enter your search");

const datePattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const match = period.match(datePattern);

    if (!match) {
    alert(`You must enter the date in d/m/y format`);
     dateinput.value = ``;
    return;
  }

  const day = parseInt(match[1]);
  const month = parseInt(match[2]);
  const year = parseInt(match[3]);

   if (day < 1 || day > 31) {
    alert(`Day must be between 1 and 31`);
     dateinput.value = ``;
    return;
  }

   if (month < 1 || month > 12) {
    alert(`Month must be between 1 and 12`);
     dateinput.value = ``;
    return;
  }

  const today = new Date();
  today.setHours(0,0,0,0);

  const enteredDate = new Date(year, month - 1, day);
  enteredDate.setHours(0,0,0,0);

  if (enteredDate < today) {
  alert(`You must enter a date from ${today.toDateString()} or in the future`);
  dateinput.value = ``;
  return;
}

  if(year < 2025 || year >= 2027){
    alert(`year must be between 2025 & 2026`)
    dateinput.value=``;
    return;
  }
  todoList[i].date = period;
  add();
}




function showPopup(i) {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '1000';

  
  const popup = document.createElement('div');
  popup.style.backgroundColor = 'white';
  popup.style.padding = '20px';
  popup.style.borderRadius = '8px';
  popup.style.textAlign = 'center';

  
let p;
if (todoList[i].done) {
  p = "UNDO";
} else {
  p = "DONE";
}


  
  popup.innerHTML = `
    <button onclick="removeTodo(${i}); closePopup()">DELETE</button>
    <button onclick="duplicate(${i}); closePopup()">DUPLICATE</button>
    <button onclick="edit(${i}); closePopup()">CHANGE NAME</button>
    <button onclick="date(${i}); closePopup()">CHANGE DATE</button>
    <button onclick="Done(${i}); closePopup()">${p}</button>
    <br><br>
    <button onclick="closePopup()">CLOSE</button>
  `;

  overlay.appendChild(popup);
  document.body.appendChild(overlay);
}


function closePopup() {
  const overlay = document.querySelector('body > div[style*="z-index: 1000"]');
  if (overlay) {
    overlay.remove();
  }
}
function chooseDate() {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '1000';


  const popup = document.createElement('div');
  popup.style.backgroundColor = 'white';
  popup.style.padding = '20px';
  popup.style.borderRadius = '8px';
  popup.style.textAlign = 'center';

  popup.innerHTML = `<h3>Choose Date</h3>`;

  const daySelect = document.createElement('select');
  for (let d = 1; d <= 31; d++) {
    const option = document.createElement('option');
    option.value = d;
    option.textContent = d;
    daySelect.appendChild(option);
  }


  const monthSelect = document.createElement('select');
  for (let m = 1; m <= 12; m++) {
    const option = document.createElement('option');
    option.value = m;
    option.textContent = m;
    monthSelect.style.marginTop=`10px`;
    monthSelect.appendChild(option);
  }


  const yearSelect = document.createElement('select');
  for (let y = 2025; y <= 2026; y++) {
    const option = document.createElement('option');
    option.value = y;
    option.textContent = y;
    yearSelect.style.marginTop=`10px`;
    yearSelect.appendChild(option);
  }


  const confirmBtn = document.createElement('button');
  confirmBtn.textContent = 'CONFIRM';
  confirmBtn.style.marginTop = '10px';
  confirmBtn.onclick = function() {
    const day = daySelect.value;
    const month = monthSelect.value;
    const year = yearSelect.value;
    const formattedDate = `${day}/${month}/${year}`;
    document.querySelector('.js-date-input').value = formattedDate;
    overlay.remove();
  };


  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'CLOSE';
  closeBtn.style.marginTop = '10px';
  closeBtn.onclick = function() {
    overlay.remove();
  };

  popup.appendChild(document.createTextNode('Day: '));
  popup.appendChild(daySelect);
  popup.appendChild(document.createElement('br'));

  popup.appendChild(document.createTextNode('Month: '));
  popup.appendChild(monthSelect);
  popup.appendChild(document.createElement('br'));

  popup.appendChild(document.createTextNode('Year: '));
  popup.appendChild(yearSelect);
  popup.appendChild(document.createElement('br'));

  popup.appendChild(confirmBtn);
  popup.appendChild(document.createElement('br'));
  popup.appendChild(closeBtn);

  overlay.appendChild(popup);
  document.body.appendChild(overlay);
}

function showdone() {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '1000';

  const popup = document.createElement('div');
  popup.style.backgroundColor = '#fff';
  popup.style.padding = '20px';
  popup.style.borderRadius = '10px';
  popup.style.width = '300px';
  popup.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  popup.style.textAlign = 'center';

  const title = document.createElement('h3');
  title.textContent = 'Done Todos';
  title.style.color = '#8e44ad';
  popup.appendChild(title);

  let hasDone = false;

  for (let i = 0; i < todoList.length; i++) {
    if (todoList[i].done === true) {
      hasDone = true;

      const todoItem = document.createElement('div');
      todoItem.style.padding = '8px';
      todoItem.style.margin = '5px 0';
      todoItem.style.backgroundColor = '#f0f0f0';
      todoItem.style.borderLeft = '4px solid #8e44ad';
      todoItem.style.borderRadius = '5px';

      todoItem.textContent = `${todoList[i].name} - ${todoList[i].date}`;
      popup.appendChild(todoItem);
    }
  }

  if (!hasDone) {
    const noTodo = document.createElement('p');
    noTodo.textContent = 'No done todos yet.';
    noTodo.style.color = '#555';
    popup.appendChild(noTodo);
  }

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'CLOSE';
  closeBtn.style.marginTop = '10px';
  closeBtn.onclick = function() {
    overlay.remove();
  };
  popup.appendChild(closeBtn);

  overlay.appendChild(popup);
  document.body.appendChild(overlay);
}


function Deletedonetodo(){
  let z=0;
  for (let i = todoList.length - 1; i >= 0; i--){
    if(todoList[i].done===true){
    removeTodo(i)
    z=1;
    }
  }
  if (z===0){
 const overlay= document.createElement(`div`);
 overlay.style.position=`fixed`;
 overlay.style.top=`0`;
 overlay.style.left=`0`;
 overlay.style.width=`100%`;
 overlay.style.height=`100%`;
 overlay.style.backgroundColor=`rgba(0,0,0,0.5)`;
 overlay.style.display=`flex`;
 overlay.style.justifyContent=`center`;
 overlay.style.alignItems=`center`;
 overlay.style.zIndex=`1000`;

const popup=document.createElement(`div`);
popup.style.backgroundColor = 'white';
popup.style.padding = '20px';
popup.style.borderRadius = '8px';
popup.style.textAlign = 'center';

  const title = document.createElement('h3');
  title.textContent = 'No done todos to remove';
  popup.style.borderRadius = '8px';
  popup.style.textAlign = 'center';
  popup.appendChild(title);

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'OK';
  closeBtn.style.marginTop = '10px';
  closeBtn.onclick = function() {
  overlay.remove();
};
    popup.appendChild(closeBtn);
    overlay.appendChild(popup);
    document.body.appendChild(overlay); 
}
}


function saveTodos() {
  try {
    localStorage.setItem('todoList', JSON.stringify(todoList));
    alert("✅ Todos saved successfully!");
  } catch (e) {
    console.error("Save failed:", e);
    alert("❌ Failed to save todos.");
  }
}

function loadTodos() {
  try {
    const saved = localStorage.getItem('todoList');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        parsed.forEach(todo => todoList.push(todo));
        add();
        alert("✅ Todos loaded successfully!");
      } else {
        alert("❌ Saved data is corrupted.");
      }
    } else {
      alert("⚠️ No saved todos found.");
    }
  } catch (e) {
    console.error("Load failed:", e);
    alert("❌ Failed to load todos.");
  }
}

function clearSavedTodos() {
  localStorage.removeItem('todoList');
  alert("✅ Saved todos cleared.");
}

function description(i) {

  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '1000';

  const popup = document.createElement('div');
  popup.style.backgroundColor = '#fff';
  popup.style.padding = '20px';
  popup.style.borderRadius = '10px';
  popup.style.width = '300px';
  popup.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  popup.style.textAlign = 'center';

  const title = document.createElement('h3');
  title.textContent = 'Description';
  title.style.color = '#8e44ad';
  popup.appendChild(title);

  const d = document.createElement('p');
  const description = todoList[i].description;

  if (!description || description === '') {
    d.textContent = 'No description available.';
  } else {
    d.textContent = description;
  }

  d.style.color = '#555';
  popup.appendChild(d);

  const change = document.createElement('button');
  change.textContent = 'Change Description';
  change.style.marginTop = '10px';
  change.onclick = function() {
    let f= prompt('Enter the new description');
    if (f!== null && f!== ``){
   todoList[i].description=f ;
   d.textContent=f;
   }
  };
popup.appendChild(change);
  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'OK';
  closeBtn.style.marginTop = '10px';
  closeBtn.onclick = function() {
    overlay.remove();
  };
  popup.appendChild(closeBtn);

  overlay.appendChild(popup);
  document.body.appendChild(overlay);
}

