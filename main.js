const nameOfToDo = document.querySelector('#nameOfToDo');
const dateOfEndToDo = document.querySelector('#dateOfEndToDo');
const timeOfEndToDo = document.querySelector('#timeOfEndToDo');
const noDateOfEndToDo = document.querySelector('#noDateOfEndToDo');
const descOfToDo = document.querySelector('#descOfToDo');
const addToDoBtn = document.querySelector('.btn, .btn_add');
const toDoListDiv = document.querySelector('.toDosDiv');
const dateErrorDiv = document.querySelector('#dateErrorDiv');
const nameErrorDiv = document.querySelector('#nameErrorDiv');

let toDosArray = [];
let today = new Date();

document.addEventListener("DOMContentLoaded", () => {
    displayToDos(getFromLocalStorage());
});

addFunctinalityToAddBtn();
disableDateWhenIndefiniteCompletion();

//events
function addFunctinalityToAddBtn(){
    addToDoBtn.addEventListener('click', function () {
        if(nameOfToDo.value.length < 3) {
            if(endDateValidate(dateOfEndToDo.value + ' ' + timeOfEndToDo.value) || noDateOfEndToDo.checked)  dateErrorDiv.classList.add('hide');
            nameErrorDiv.classList.remove('hide');
            return}
        if(nameOfToDo.value.length >= 3) nameErrorDiv.classList.add('hide');

        if(endDateValidate(dateOfEndToDo.value + ' ' + timeOfEndToDo.value) || noDateOfEndToDo.checked){   
        addToDo(nameOfToDo, 
            dateOfEndToDo, 
            timeOfEndToDo, 
            noDateOfEndToDo, 
            descOfToDo);
        }
        else{
            dateErrorDiv.classList.remove('hide');
        }
    });
}
function disableDateWhenIndefiniteCompletion(){
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
}

//usefull functions
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
    if(dateAndTime > getDateAndTime()){
        validationDate = true;
    }
    else{
        validationDate = false;
    }
    return validationDate;
}
function getDateAndTime() {
    let time = ('0' + today.getHours()).slice(-2) + ":" + ('0' + (today.getMinutes()+1)).slice(-2);
    todayDate = today.getFullYear() + '-' + ('0' + (today.getMonth()+1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    let dateTime = todayDate + ' ' + time;
    return dateTime;
}

//todos functions
function addToDo(nameOfToDo, 
    dateOfEndToDo, 
    timeOfEndToDo, 
    noDateOfEndToDo, 
    descOfToDo){
        dateErrorDiv.classList.add('hide');
        nameErrorDiv.classList.add('hide');
        
        let toDoObj = {
            name: nameOfToDo.value,
            startDate: getDateAndTime(),
            endDate: noDateOfEndToDo.checked ? "bezterminowo" : dateOfEndToDo.value,
            endTime: noDateOfEndToDo.checked ? "" : timeOfEndToDo.value,
            isIndefinite: noDateOfEndToDo.checked,
            description: descOfToDo.value,
            isDone: false,
            identificator: Date.now()
    }
    toDosArray.push(toDoObj);
    addToLocalStorage(toDosArray);
    clearInputs();
    displayToDos(toDosArray);
}
function displayToDos(toDosArray) {
    toDoListDiv.innerHTML = '';

    toDosArray.forEach(function (toDo) {
        const div = document.createElement('div');
        div.classList.add('toDoList');
        div.innerHTML = `<div class="toDosDiv__toDoMainElement" data-id=${toDo.identificator}> 
        <div class="toDosDiv__toDoMainElement__TextDiv">${toDo.name}</div> 
        <div class="toDosDiv__toDoMainElement__BtnsDiv">
            <button class="btn btn_delete fas fa-trash"></button>
            <button class="btn btn_check fas fa-check"></button>
        </div>
        </div>
        <div class="toDosDiv__toDoMainElement__details hide" data-id=${toDo.identificator}>
            <p class="details__startDate">Start: ${toDo.startDate}</p>
            <p class="details__endDate">Koniec: ${toDo.endDate} ${toDo.endTime}</p>
            <p class="details__description">Opis: ${toDo.description}</p>
        </div>`;
        if(toDo.isDone == true){
             div.firstElementChild.classList.add('checkedToDo');
             div.firstElementChild.lastElementChild.lastElementChild.classList.add('checkBtnInavtive');
        }
        toDoListDiv.appendChild(div);
    });
    const nameDiv = [...document.querySelectorAll('.toDosDiv__toDoMainElement')];

    nameDiv.forEach(div => {    
        div.addEventListener('click', (event) => {
            if(event.target.classList.contains('toDosDiv__toDoMainElement')){
                    if (div.nextElementSibling.classList.contains('hide')) {
                        div.nextElementSibling.classList.add('expand');
                        div.nextElementSibling.classList.remove('hide');
                    }
                    else {
                        div.nextElementSibling.classList.remove('expand');
                        div.nextElementSibling.classList.add('hide');                   

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
                checkToDo(event);
            }
        });
    });
}
function removeToDo(id) {
    newArray = toDosArray.filter(item => item.identificator != id);
    addToLocalStorage(newArray);
    displayToDos(getFromLocalStorage());
}
function checkToDo(event){
    let idOfItem = event.target.parentElement.parentElement.dataset.id;
    toDosArray.forEach(item => {
        if(item.identificator == idOfItem && item.isDone == false){
            item.isDone = true;
        }
    })
    addToLocalStorage(toDosArray);
    displayToDos(getFromLocalStorage());
}

//Local Storage
function addToLocalStorage(toDosArray) {
    localStorage.setItem('toDos', JSON.stringify(toDosArray));
}

function getFromLocalStorage() {
    let localData = localStorage.getItem('toDos') ? JSON.parse(localStorage.getItem('toDos')) : [];
    toDosArray = localData;
    return localData;
}