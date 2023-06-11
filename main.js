const itemForm = document.querySelector("#item-form");
const itemInput = document.querySelector("#item-input");
const itemList = document.querySelector("#item-list");
const clearBtn=document.querySelector('#clear')
const itemFilter=document.querySelector("#filter")
const formBtn = itemForm.querySelector('button')
let isEditMode=false;

function displayItems(){
    let itemFromStorage=getItemsFromStorage();
    itemFromStorage.forEach(item => addItemToDOM(item))

    checkUI(); //check UI again
}

function onAddItemSubmit(e){
    e.preventDefault();
    const newItem = itemInput.value

    if(newItem === ''){
        alert("please add an item")
        return;
    }

    //check for edit mode
    if (isEditMode){
        const itemToEdit=itemList.querySelector('.edit-mode')

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }else{
        if (checkIfItemExists(newItem)){
            alert('That item already exists!')
            return;
        }
    }

    //create item DOM element
    addItemToDOM(newItem)

    //add item to local storage
    addItemToStorage(newItem)

    //check for UI 
    checkUI();
    itemInput.value='';
}

function addItemToDOM(item){
//create list item
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(item))

    const button= createButton("remove-item btn-link text-red") //function for remove button
    li.appendChild(button)

    //adding li to the DOM 
    itemList.appendChild(li)
}

function createButton(classes){
    const button= document.createElement("button");
    button.className= classes;
    const icon= createIcon("fa-solid fa-xmark")
    button.appendChild(icon)
    return button;
}

function createIcon(classes){
    const icon= document.createElement('li');
    icon.className = classes;
    return icon;
}

function addItemToStorage(item){
    let itemFromStorage = getItemsFromStorage;
    
    if(localStorage.getItem('items') === null){
        itemFromStorage = []
    }else {
        itemFromStorage = JSON.parse(localStorage.getItem('items'))
    }
    itemFromStorage.push(item);   //add new item to array

    //Convert to JSON string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemFromStorage))
}

function getItemsFromStorage(){
    let itemFromStorage;
    
    if(localStorage.getItem('items') === null){
        itemFromStorage = []
    }else {
        itemFromStorage = JSON.parse(localStorage.getItem('items'))
    }
    return itemFromStorage
}

function onClickItem(e){
    if(e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement)
        }else{
            setItemToEdit(e.target);
        }
}

function checkIfItemExists(item){
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}

function setItemToEdit(item){
    isEditMode= true;
    //removing styling class so all but just one item to edit will be black color
    itemList.querySelectorAll('li').forEach((li) => li.classList.remove('edit-mode'))

    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class= "fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor= "#228B22";
    itemInput.value= item.textContent;
}

function removeItem(item){  //this item is the actual element coming from parameter when we called this function
    if(confirm('are you sure?')){
        //remove item from DOM
        item.remove();

        //remove item from storage
        removeItemFromStorage(item.textContent)

        checkUI();
    }
}

function removeItemFromStorage(item){
    let itemsFromStorage=getItemsFromStorage()
    //filter item out to be removed
    itemsFromStorage=itemsFromStorage.filter((i)=> i !== item)

    //reset to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))

}

//checks if there is a first child. as long as it has it it will keep removing it.
//or can just do itemList.innerHTML =''
function clearItems(){
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild)
    }

    //clear from local storage
    localStorage.removeItem('items')

    checkUI()  //have to check for items again here. If none filter and clear all btn will be removed
}
// function clearItems(){
//     itemList.innerHTML=''
// }

function filterItems(e){
    const items = itemList.querySelectorAll('li');
    const text =e.target.value.toLowerCase();

    items.forEach((item) => {
        const itemName=item.innerText.toLowerCase();
        //need to compare itemName with text typed in filter. if matches true, if not its -1
        if(itemName.indexOf(text) != -1){
            item.style.display = 'flex'
        }else{
            item.style.display ='none'
        }
    })
}

//checking for items. if none clear all button and filter won't show
function checkUI(){
    itemInput.value='';
    
    let items= itemList.querySelectorAll('li') //have to define items inside the function,so it would define items every time the function runs. otherwise if we define it in the global scope it won't check for items when this function runs.
    if(items.length===0){
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    } else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block'; 
    }
    formBtn.innerHTML= '<i class= "fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor="black"
    isEditMode=false;

}

//we can keep event listeners in the global scope or we can put them all in one function and only call that function in the global scope instead of having all listeners in the global scope. anything that should happen on load can go in this function.

function init(){

itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', onClickItem)
clearBtn.addEventListener('click', clearItems)
itemFilter.addEventListener('input', filterItems)
document.addEventListener('DOMContentLoaded', displayItems)

checkUI() //originally calling the function in global scope so it would run on page load, but then put it inside init function which will have the same effect.
}

init();