const nameOfToDo = document.querySelector('#nameOfToDo');
const dateOfEndToDo = document.querySelector('#dateOfEndToDo');
const timeOfEndToDo = document.querySelector('#timeOfEndToDo');
const noDateOfEndToDo = document.querySelector('#noDateOfEndToDo');
const descOfToDo = document.querySelector('#descOfToDo');
const addToDoBtn = document.querySelector('.btn, .btn_add');
const toDoListDiv = document.querySelector('.toDoListDiv');
const dateInfoDiv = document.querySelector('#dateInfoDiv');

let toDosArray = [];
let today = new Date();
dateInfoDiv.classList.add('hide');

addToDoBtn.addEventListener('click', function () {
    // console.log(dateOfEndToDo.value + ' ' + timeOfEndToDo.value);
    if(endDateValidate(dateOfEndToDo.value + ' ' + timeOfEndToDo.value) || noDateOfEndToDo.checked){    
    addToDo(nameOfToDo, 
        dateOfEndToDo, 
        timeOfEndToDo, 
        noDateOfEndToDo, 
        descOfToDo);
    }
    else{
        dateInfoDiv.classList.remove('hide');
        // console.log(getDateAndTime());
    }
});

function getDateAndTime() {
    // let date = today.getFullYear() + '-' + ('0' + today.getMonth() + 1).slice(-2) + '-' + today.getDate();
    let time = ('0' + today.getHours()).slice(-2) + ":" + ('0' + (today.getMinutes()+1)).slice(-2);
    todayDate = today.getFullYear() + '-' + ('0' + (today.getMonth()+1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    let dateTime = todayDate + ' ' + time;
    return dateTime;
}

noDateOfEndToDo.addEventListener('change', function () {
    if (noDateOfEndToDo.checked === false) {
        dateOfEndToDo.disabled = false;
        timeOfEndToDo.disabled = false;
    }
    else {
        dateOfEndToDo.disabled = true;
        timeOfEndToDo.disabled = true;
    }
})
function clearInputs() {
    nameOfToDo.value = '';
    dateOfEndToDo.value = '';
    timeOfEndToDo.value = '';
    dateOfEndToDo.disabled = false;
    timeOfEndToDo.disabled = false;
    descOfToDo.value = '';
    if (noDateOfEndToDo.checked === true) {
        noDateOfEndToDo.checked = false;
    }
}
function endDateValidate(dateAndTime){
    let validationDate = false;  
    // console.log(dateAndTime)
    // console.log(getDateAndTime())
    if(dateAndTime > getDateAndTime()){
        // console.log("zgadza się");
        validationDate = true;
    }
    else{
        // console.log("nie zgadza się");
        validationDate = false;
    }
    return validationDate;
}

// function sortArray(toDosArray) {
//     toDosArray.sort(function (a, b) {
//         let result = (a.endDate < b.endDate) ? -1 : ((a.endDate > b.endDate) ? 1 : 0);
//     });
// }
function addToLocalStorage(toDosArray) {
    localStorage.setItem('toDos', JSON.stringify(toDosArray));
}
function getFromLocalStorage() {
    let localData = localStorage.getItem('toDos') ? JSON.parse(localStorage.getItem('toDos')) : [];
    toDosArray = localData;
    return localData;
}

function addToDo(nameOfToDo, 
    dateOfEndToDo, 
    timeOfEndToDo, 
    noDateOfEndToDo, 
    descOfToDo){
        dateInfoDiv.classList.add('hide');
// console.log(dateOfEndToDo.value + "sss")
    let toDoObj = {
        name: nameOfToDo.value,
        startDate: getDateAndTime(),
        // new Date().toJSON().slice(0,10).replace(/-/g,'/'),
        endDate: noDateOfEndToDo.checked ? "bezterminowo" : dateOfEndToDo.value,
        // dateOfEndToDo.value,
        // noDateOfEndToDo.checked ? "bezterminowo" : dateOfEndToDo.value,
        endTime: noDateOfEndToDo.checked ? "" : timeOfEndToDo.value,
        isIndefinite: noDateOfEndToDo.checked,
        description: descOfToDo.value,
        isDone: false,
        identificator: Date.now()
    }
    toDosArray.push(toDoObj);
    // console.log(toDosArray);
    // sortArray(toDosArray);
    // console.log(toDosArray);
    addToLocalStorage(toDosArray);
    clearInputs();
    displayToDos(toDosArray);
}


function displayToDos(toDosArray) {
    
    toDoListDiv.innerHTML = '';
   
    toDosArray.forEach(function (toDo) {
        const div = document.createElement('div');
        div.classList.add('toDoList');
        div.innerHTML = `<div class="toDoList__li" data-id=${toDo.identificator}> 
        <div class="toDoList__liTextDiv">${toDo.name}</div> 
        <div class="toDoList__liBtnsDiv">
            <button class="btn btn_delete fas fa-trash"></button>
            <button class="btn btn_check fas fa-check"></button>
        </div>
        </div>
        <div class="toDoList__li__details hide" data-id=${toDo.identificator}>
            <p class="details__startDate">Start: ${toDo.startDate}</p>
            <p class="details__endDate">Koniec: ${toDo.endDate} ${toDo.endTime}</p>
            <p class="details__description">Opis: ${toDo.description}</p>
        </div>`;
        // console.log(toDo.endDate + " end");
        toDoListDiv.appendChild(div);
    });
    const nameDiv = [...document.querySelectorAll('.toDoList__li')];

    nameDiv.forEach(div => {    
        div.addEventListener('click', (event) => {
            if(event.target.classList.contains('toDoList__li')){
                    //po kliknięciu nadaj klasę show dla elementu brat
                    if (div.nextElementSibling.classList.contains('hide')) {
                        div.nextElementSibling.classList.add('show');
                        div.nextElementSibling.classList.remove('hide');
                    }
                    else {
                        div.nextElementSibling.classList.add('hide');
                        div.nextElementSibling.classList.remove('show');
                    }
                }
            });
        });
    nameDiv.forEach(div =>{
        div.addEventListener('click', (event)=>{
            if(event.target.classList.contains('btn_delete')){
                removeToDo(event.target.parentElement.parentElement.dataset.id);
            }
            if(event.target.classList.contains('btn_check')){
                
                console.log(event.target.parentElement.parentElement.dataset.id);
                checkToDo(event.target.parentElement.parentElement.dataset.id);
            }
        });
    });
}
    // let tempItem = cart.find(item => item.id === id);

function removeToDo(id) {
    console.log(id);
    // zwroc do cart all itemsy, które nie mają podanego w parametrze id
    newArray = toDosArray.filter(item => item.identificator != id);
    // console.log(newArray)
    addToLocalStorage(newArray);
    displayToDos(getFromLocalStorage());
}

document.addEventListener("DOMContentLoaded", () => {
    displayToDos(getFromLocalStorage());
});

function checkToDo(idofItem){
    //  let tempItems = toDosArray.find(item => item.identificator == idofItem);
    toDosArray.forEach(item => {
        if(item.identificator == idofItem){
            console.log(item)
            // item.classList.add('checkedToDo');
            item.isDone = true;
        }
    })
    // console.log(tempItems)
   console.log(toDosArray)
    addToLocalStorage(toDosArray);
    displayToDos(getFromLocalStorage());
}