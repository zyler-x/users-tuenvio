let events = [];
let eventAcc = [];
let arr = []; // cargar informacion
let arrDivs = [] // informacion de los divs con las cuentas

const userMail = document.querySelector('#mail');
const btnAdd = document.querySelector('#buttonAdd');
//const eventMail = document.querySelectorAll('#eventMail');
//const eventDate = document.querySelectorAll('#eventDate');
//const buttonAdd = document.querySelectorAll('#bAdd');
//const listDivs = document.querySelectorAll('.form-main-accounts');
const eventsContainer = document.querySelector('#eventsContainer');
const accountsContainer = document.querySelector('#accounts-list');
var mail = "lol";
var date = "";
var id = 0;

const json = loadMail();
const json1 = load();

try {
    arr = JSON.parse(json);
} catch (error) {
    arr = [];
}
eventAcc = arr ? [...arr] : [];

try {
    arrDivs = JSON.parse(json1);
} catch (error) {
    arrDivs = [];
}
events = arrDivs ? [...arrDivs] : [];

renderEvents();
renderEventsAcc();

document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    addEmail();
});

btnAdd.addEventListener('click', e => {
    e.preventDefault();
    addEmail();
});

const listDivs = document.querySelectorAll('.form-main-accounts');
const buttonAdd = document.querySelectorAll('#bAdd');
const eventMail = document.querySelectorAll('#eventMail');
const eventDate = document.querySelectorAll('#eventDate');
if (listDivs.length != 0) {
    for (let i = 0; i < buttonAdd.length; i++) {
        buttonAdd[i].addEventListener('click', function () {

            id = buttonAdd[i].getAttribute('data-id');
            mail = eventMail[i].textContent;
            date = eventDate[i].value;
            console.log(listDivs)
            console.log(listDivs[i]);
            console.log(listDivs.length);

            if (date == "") {
                return;
            }
            if (dateDiff(date) <= 0) {
                return;
            } else if (dateDiff(date) > 72) {
                return;
            }

            // buttonAdd[i].disabled = true;
            listDivs[i].remove();
            eventAcc = eventAcc.filter(eventAcc => eventAcc.id != id);
            saveMail(JSON.stringify(eventAcc));
            console.log(eventAcc);

        });

    }
}

document.querySelectorAll('#bAdd').forEach(button => {
    button.addEventListener('click', e => {
        e.preventDefault();
        addEvent();

    });
});

function addEvent() {
    if (date == "") {
        alert("Introduzca la fecha correctamente");
        return;
    }

    if (dateDiff(date) <= 0) {
        alert('Ya puede usar esa cuenta');
        return;
    } else if (dateDiff(date) > 72) {
        alert("La fecha no puede ser superior al dia de hoy");
        return;
    }

    const newEvent = {
        id: id,
        mail: mail,
        date: date,
    };

    events.unshift(newEvent);
    save(JSON.stringify(events));
    renderEventsAcc();

}

function addEmail() {
    if (userMail.value == "") {
        alert("Introduzca un correo válido");
        return;
    }

    const newEvent = {
        id: (Math.random() * 100).toString(36).slice(3),
        mail: userMail.value,
    };

    eventAcc.unshift(newEvent);
    saveMail(JSON.stringify(eventAcc));
    userMail.value = "";
    renderEvents();
}

function dateDiff(d) {
    const targetDate = new Date(d);
    const today = new Date();
    const finalDay = new Date(targetDate.getTime() + 1000 * 3600 * 72);
    const difference = finalDay.getTime() - today.getTime();
    const hoursLeft = (difference / 1000 / 3600);
    const roundHour = round(hoursLeft);
    const hour = verifyHours(roundHour);
    return hour - 1;

}

function minutesDiff(d) {
    const targetDate = new Date(d);
    const today = new Date();
    const finalDay = new Date(targetDate.getTime() + 1000 * 3600 * 72);
    const difference = finalDay.getTime() - today.getTime();
    const minutesLeft = Math.floor(difference / 1000 / 60) % 60;
    const minutes = minutesLeft < 10 ? '0' + minutesLeft : minutesLeft;
    return minutes;
}

function round(num) {
    return +(Math.round(num + "e+2") + "e-2");
}

function verifyHours(num) {
    const a = num.toString();

    if (a.length == 4) {
        if (Number(a.charAt(2)) > 5) {
            return Math.ceil(num);
        } else {
            return Math.floor(num);
        }
    } else {
        if (Number(a.charAt(3)) > 5) {
            return Math.ceil(num);
        } else {
            return Math.floor(num);
        }
    }
}

function renderEvents() {
    const eventsHTML = eventAcc.map(event => {
        return `

             <div class="form-main-accounts" class="form-main-account-1">
                 <p id="eventMail">${event.mail}</p>
                 <input type="datetime-local" id="eventDate">              
                 <input type="button" data-id=${event.id} id="bAdd" value="Submit">
              </div>
        `;
    });
    accountsContainer.innerHTML = eventsHTML.join("");
}

function renderEventsAcc() {
    const eventsHTML = events.map(event => {
        const day = new Date(event.date).toLocaleString("en-US");
        return `
            <div class="event">
                <div class="days">
                    <span class="days-number">${dateDiff(event.date)}</span>
                    <span class="days-text"><span>horas</span</span>
                </div>
                <span class="timer-part">: </span>
                <div class="minutes">
                    <span class="minutes-number">${minutesDiff(event.date)}</span>
                    <span class="minutes-text">min</span>
                </div>

                <div class="event-mail">${event.mail}</div>
                <div class="event-date">${day}</div>
                <div class="actions">
                    <button class="bDelete" data-id="${event.id}">Eliminar</button>
                </div>
            </div>
        `;
    });
    eventsContainer.innerHTML = eventsHTML.join("");

    document.querySelectorAll('.bDelete').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = button.getAttribute('data-id');
            const accDeleted = events.filter(event => event.id == id)[0];
            console.log(accDeleted);
            events = events.filter(event => event.id != id);
            save(JSON.stringify(events));

            eventAcc.unshift(accDeleted);
            saveMail(JSON.stringify(eventAcc));

            renderEvents();
            renderEventsAcc();
        });
    });
}

function save(data) {
    localStorage.setItem('items', data);
}

function saveMail(data) {
    localStorage.setItem('mails', data);
}

function load() {
    return localStorage.getItem('items');
}

function loadMail() {
    return localStorage.getItem('mails');
}