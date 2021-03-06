let employees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture, email, location, phone, dob &noinfo &nat=US`;
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");
const searchBar = document.getElementById("search");
const modalLeft = document.querySelector(".modal-left");
const modalRight = document.querySelector(".modal-right");

fetch(urlAPI) //fetches data from urlAPI website
    .then(res => res.json()) //formats response as JSON
    .then(res => res.results) //returns results of the response
    .then(displayEmployees) //passes results into displayEmployees function to create the HTML markup
    .catch(err => console.log(err)); //console logs errors

function displayEmployees(employeeData) {
    employees = employeeData;
    let employeeHTML = ''; //stores employee HTML
    employees.forEach((employee, index) => { //loops through each employee and creates HTML
        let name = employee.name;
        let email = employee.email;
        let city = employee.location.city;
        let picture = employee.picture;
        
        //HTML markup that's being added
        employeeHTML += ` 
            <div class="card" data-index = "${index}">
                <img class="avatar" src="${picture.large}"/>
                <div class="text-container">
                    <h2 class="name">${name.first} ${name.last}</h2>
                    <p class="email">${email}</p>
                    <p class="address">${city}</p>
                </div>
            </div> 
        `
    });
    gridContainer.innerHTML = employeeHTML;
};

function displayModal(index) {
    let {name, dob, phone, email, location: {city, street, state, postcode}, picture } = employees[index];
    let date = new Date(dob.date);
    const modalHTML = `
        <img class="avatar" src="${picture.large}">
        <div class="text-container">
            <h2 class="name">${name.first} ${name.last}</h2>
            <p class="email">${email}</p>
            <p class="address">${city}</p>
            <hr/>
            <p>${phone}</p>
            <p class="address">${street.name}, ${street.number}, ${city} ${state} ${postcode}</p>
            <p> Birthday:
                ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
            </div>
    ` ;
    overlay.classList.remove("hidden");
    modalContainer.innerHTML = modalHTML;
};

gridContainer.addEventListener('click', e => {
    if (e.target !== gridContainer) {
        const card = e.target.closest(".card");
        const index = card.getAttribute("data-index");
        displayModal(index);
    }
});

modalClose.addEventListener("click", () => {
    overlay.classList.add("hidden");
});

searchBar.addEventListener("keyup", (e) => {
    let searchString = searchBar.value.toLowerCase(); //gets value of what user types in search bar
    let card = document.querySelectorAll(".card"); //targets the employee cards 
    card.forEach(employee=> {
        let name = employee.querySelector('.name').textContent.toLowerCase();
        if (name.includes(searchString)){
            employee.style.display="";
        }
        else {
            employee.style.display="none";
        }
    }); 
});

let currentItem = 0; 

modalRight.addEventListener("click", function () {
  currentItem++;
  if (currentItem > employees.length - 1) {
    currentItem = 0;
  }
  displayModal(currentItem);
});
// show prev person
modalLeft.addEventListener("click", function () {
  currentItem--;
  if (currentItem < 0) {
    currentItem = employees.length - 1;
  }
  displayModal(currentItem);
});