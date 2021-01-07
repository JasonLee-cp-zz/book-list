//UserName 
const userSubmitBtn = document.querySelector(".username-submit-button");
const userInput = document.querySelector("#username-input");

const USER_NAME = "userName";
const SHOW_NONE = "show-none";
const SHOW_ON = "show-on";
const STORED_BOOKS = "storedBooks";

function deleteUserInput(className){
    const deletedClass = document.querySelector(`.${className}`); 
    deletedClass.classList.add(SHOW_NONE);
}

function showClass(className){
    const show = document.querySelector(`.${className}`);
    show.classList.add(SHOW_ON);
}

function getUserName(){
    userSubmitBtn.addEventListener("click",()=>{
        const name = userInput.value;

        if(name === ""){ //Blank Entered
            alert("Fill in the username!");
        }else{ //When Successful
        //make username input vanish
        deleteUserInput("username-container");
        showClass("greeting");
        storeUserName(name);
        USER.addHeadName(name);
        }
    })
}

function storeUserName(name){
    localStorage.setItem(USER_NAME,name);
}

//Username Interaction
class USER{
    static addHeadName(name){
        const headName = document.querySelector("#head-username");
        headName.textContent = `${name}'s`;
    }
}

let books = [];

//Booklist
class Book{
    constructor(title,author,price,report,isbn){
        this.title = title;
        this.author = author;
        this.price = price;
        this.report = report;
        this.isbn = isbn;
    }
}

//User Interface
class UI{

    //add book BOTH to local Storage & books array
    static addBook(book){ 
        //addBook to table & local storage
        let bookList = document.querySelector(".book-list");
        let newBook = document.createElement("tr");
        newBook.innerHTML=`
        <th class="text-primary">${book.title}</th>
        <td>${book.author}</td>
        <td>${book.price}</td>
        <td><a href="${book.report}" style="color:gray">Report Link</a></td>
        <td>${book.isbn}</td>
        <td><button type="button" class="btn btn-danger btn-sm">X</button></td>
        `;
        bookList.append(newBook);

        Store.addBooktoStorage(book);
    }

    static removeBook(target){
        const remove_isbn = target.parentElement.previousElementSibling.innerHTML;
        target.parentElement.parentElement.remove();
        Store.removeBookFromStorage(remove_isbn);
    }

    static popAlert(message,colorName){
        const bookForm = document.querySelector("#book-form");
        const alertDiv = document.createElement("div");

        alertDiv.className=`alert alert-${colorName}`;
        alertDiv.textContent=message;
        bookForm.insertAdjacentElement('beforebegin',alertDiv);

        //vanish after 3 seconds
        setTimeout(()=>alertDiv.remove(),3000);
    }

    static clearFields(){
        document.querySelector("#title").value='';
        document.querySelector("#author").value='';
        document.querySelector("#price").value='';
        document.querySelector("#report").value='';
        document.querySelector("#isbn").value='';
    }
}


//Store&Retrieve to&from Local Storage
class Store{
    static setLocalStorage(key,value){
        localStorage.setItem(key,JSON.stringify(value));
    }

    static getLocalStorage(key){
        return JSON.parse(localStorage.getItem(key));
    }

    static removeLocalStorage(key){
        localStorage.removeItem(key);
    }

    static addBooktoStorage(book){
        books.push(book);
        Store.setLocalStorage(STORED_BOOKS,books);
    }

    static removeBookFromStorage(isbn){
        books = books.filter(book => book.isbn != isbn);
        if(books.length == 0){
            localStorage.removeItem(STORED_BOOKS);
            return;
        }
        Store.setLocalStorage(STORED_BOOKS,books);
    }
}


//Book Add
const bookForm = document.querySelector("#book-form");
bookForm.addEventListener("submit",handleSubmit);

function handleSubmit(evt){
    evt.preventDefault();
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const price = document.querySelector("#price").value;
    const report = document.querySelector("#report").value;
    const isbn = document.querySelector("#isbn").value;

    //When any field is blank -> return;
    if(title=='' || author=='' || price=='' || report=='' || isbn==''){
        UI.popAlert("Fill in the all fields!","danger");
        return;
    }

    //All fields successfully entered -> proceed to ADD
    const book = new Book(title,author,price,report,isbn);
    UI.clearFields();
    UI.addBook(book);
    UI.popAlert("Added Successfully","success");
}


//Book Remove
const bookList = document.querySelector(".book-list");
bookList.addEventListener("click",handleRemove);

function handleRemove(evt){
    UI.removeBook(evt.target);
    UI.popAlert("Deleted Successfully","success");
}

//Exit to Log Out
const exit = document.querySelector(".exit");
exit.addEventListener("click",handleExit);
function handleExit(){
    Store.removeLocalStorage(USER_NAME);
    Store.removeLocalStorage(STORED_BOOKS);
    location.reload();
}




function handleInitTable(){
    const local_books = Store.getLocalStorage(STORED_BOOKS);
    if(local_books==null){
        //if there's no data in the storage then just proceed
        return;
    }else{
        //if there's data in the storage, then add to books array and paint them
        Store.removeBookFromStorage(STORED_BOOKS); //refresh storage to avoid overlapping
        local_books.forEach((book)=>UI.addBook(book));
    }
}

//Username Input - beginning
function init(){
    const username = localStorage.getItem(USER_NAME);
    if(username == null){
        getUserName();
    }else{
        deleteUserInput("username-container");
        showClass("greeting");
        USER.addHeadName(username);
        handleInitTable();
    }
}

init();