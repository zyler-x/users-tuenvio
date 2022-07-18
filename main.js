let events = [];
let arr = []; // cargar informacion

const eventMail = document.querySelector('#eventMail');
const eventDate = document.querySelector('#eventDate');
const buttonAdd = document.querySelector('#bAdd');
const eventsContainer = document.querySelector('#eventsContainer');

const json = load();

try {
    arr = JSON.parse(json);
} catch (error) {
    arr = [];
}
events = arr ? [...arr] : [];

renderEvents();

document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    addEvent();
});

buttonAdd.addEventListener('click', e => {
    e.preventDefault();
    addEvent();
});

function addEvent(){
    if(eventMail.value == "" || eventDate.value == "") {
        alert("Introduzca los datos correctamente");
        return;
    }

    if(dateDiff(eventDate.value) <= 0) {
        alert('Ya puede usar esa cuenta');
        return;
    } else if (dateDiff(eventDate.value) > 72) {
        alert("La fecha no puede ser superior al dia de hoy");
        return;
    }

    const newEvent = {
        id: (Math.random() * 100).toString(36).slice(3),
        mail: eventMail.value,
        date: eventDate.value,
    };

    events.unshift(newEvent);
    save(JSON.stringify(events));
    eventMail.value = "";
    renderEvents();
}

function dateDiff(d) {
    const targetDate = new Date(d);
    const today = new Date();
    const finalDay = new Date (targetDate.getTime() + 1000 * 3600 * 72);
    const difference = finalDay.getTime() - today.getTime();
    const hoursLeft = (difference / 1000 / 3600);
    const roundHour = round(hoursLeft);
    console.log(hoursLeft);
    console.log(roundHour);
    const hour = verifyHours(roundHour);
    console.log(hour);
    return hour;
    
}

function minutesDiff (d) {
    const targetDate = new Date(d);
    const today = new Date();
    const finalDay = new Date (targetDate.getTime() + 1000 * 3600 * 72);
    const difference = finalDay.getTime() - today.getTime();
    const minutesLeft = Math.floor(difference / 1000 / 60) % 60;
    const minutes = minutesLeft < 10 ? '0' + minutesLeft : minutesLeft;
    console.log(minutesLeft);
    return minutes;
}

function round(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

function verifyHours (num) {
    const a = num.toString();

    if (a.length == 4) {
        if (Number(a.charAt(2)) > 5){
            return Math.ceil(num);
        } else {
            return Math.floor(num);
        }
    } else {
        if (Number(a.charAt(3)) > 5){
            return Math.ceil(num);
        } else {
            return Math.floor(num);
        }
    }
}

function renderEvents() {
    const eventsHTML = events.map(event => {
        const day = new Date (event.date).toLocaleString("en-US");
        return `
            <div class="event">
                <div class="days">
                    <span class="days-number">${dateDiff(event.date)}</span>
                    <span class="days-text">horas</span>
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
            events = events.filter(event => event.id != id);
            save(JSON.stringify(events));

            renderEvents();
        });
    });

}

function save(data){
    localStorage.setItem('items', data);
}

function load() {
    return localStorage.getItem('items');
}

