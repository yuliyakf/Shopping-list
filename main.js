const itemForm = document.querySelector("#item-form");
const itemInput = document.querySelector("#item-input");
const itemList = document.querySelector("#item-list");
const clearBtn=document.querySelector('#clear')
const itemFilter=document.querySelector("#filter")


function addItem(e){
    e.preventDefault();
    const newItem = itemInput.value

    if(newItem === ''){
        alert("please add an item")
        return;
    }

    //create list item
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(newItem))

    const button= createButton("remove-item btn-link text-red") //function for remove button
    li.appendChild(button)

    //adding li to the DOM and here need to check also for UI 
    itemList.appendChild(li)
    checkUI();
    itemInput.value='';
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

function removeItem(e){
    if(e.target.parentElement.classList.contains('remove-item')){
        if (confirm('are you sure')){
        e.target.parentElement.parentElement.remove()
        checkUI()  //have to check for items again here. If none filter and clear all btn will be removed
    }}
}
//checks if there is a first child. as long as it has it it will keep removing it.
//or can just do itemList.innerHTML =''
function clearItems(){
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild)
    }
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
    const items= itemList.querySelectorAll('li') //have to define items inside the function,so it would define items every time the function runs. otherwise if we define it in the global scope it won't check for items when this function runs.
    if(items.length===0){
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    } else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block'; 
    }
}



//event listeners
itemForm.addEventListener('submit', addItem);
itemList.addEventListener('click', removeItem)
clearBtn.addEventListener('click', clearItems)
itemFilter.addEventListener('input', filterItems)

checkUI() //calling the function in global scope so it would run on page load