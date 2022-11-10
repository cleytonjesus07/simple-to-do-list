const INPUT = document.querySelector(".containerInput > input");
const ADDTASK_BUTTON = document.querySelector(".containerInput > button");
const TASKLIST = document.getElementsByClassName("tasksList")[0];
const DELETEALL_BUTTON = document.querySelector(".removeContainer > button");
let id = 0;
let tasks = [];

ADDTASK_BUTTON.setAttribute("disabled", true);
DELETEALL_BUTTON.onclick = () => deleteAllTasks(true);
INPUT.onkeyup = (e) => !e.target.value.length ? ADDTASK_BUTTON.setAttribute("disabled", true) : ADDTASK_BUTTON.removeAttribute("disabled");


ADDTASK_BUTTON.onclick = () => {
    const DATE = new Date();
    if (INPUT.value.length > 0) {
        tasks.push({
            id: id++,
            done: false,
            desc: INPUT.value,
            time: {
                day: DATE.getDay(),
                hours: DATE.getHours(),
                minutes: DATE.getMinutes(),
                seconds: DATE.getSeconds()
            }
        })
    }
    deleteAllTasks();
    fillTasksList();
}

function deleteAllTasks(forever) {
    (!forever) && Array.from(TASKLIST.children).forEach((child) => child.remove());

    if (forever && confirm("Você está prestes a excluir todas as tarefas registradas, deseja continuar?")) {
        tasks.length = 0;
        Array.from(TASKLIST.children).forEach((child) => child.remove());
        fillTasksList();
        return;
    }
}

function fillTasksList() {

    DELETEALL_BUTTON.style.visibility = (tasks.length) ? "visible" : "hidden";

    if (tasks.length > 0) {
        document.getElementsByClassName("info")[0].style.display = "none";

        tasks.forEach(({ id, done, desc, time: { day, hours, minutes, seconds } }) => {
            TASKLIST.
                insertAdjacentHTML
                ("afterbegin",
                    `
                    <li id='${id}'>
                        <div class="task">
                            <input onchange="marked(${id})" type="checkbox" ${done && 'checked'}/>
                            <span>${desc}</span>
                            <span id='timestamp'>${getTime(hours, minutes, seconds)} - (${convertDay(day)})</span>
                            <button onClick="deleteTask(${id})">🗑️</button>
                        </div>
                    </li>
                    `
                )
        })
    } else {
        document.getElementsByClassName("info")[0].style.display = "flex";
    }
    return;
}

function marked(id) {
    const CHECKED = event.target.checked;
    tasks.map(task => {
        if (task.id === Number(id)) {
            task.done = CHECKED;
        }
    })
}


function getTime(hours, minutes, seconds) {
    return `${hours < 10 ? '0' + hours : hours} : ${minutes < 10 ? '0' + minutes : minutes} : ${(seconds < 10) ? '0' + seconds : seconds}`;
}

function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    deleteAllTasks();
    fillTasksList();
}

function convertDay(day) {
    switch (day) {
        case 0:
            return "Domingo";
        case 1:
            return "Segunda-Feira";
        case 2:
            return "Terça-Feira";
        case 3:
            return "Quarta-Feira";
        case 4:
            return "Quinta-Feira";
        case 5:
            return "Sexta-Feira";
        case 6:
            return "Sábado";
        default:
            break;
    }
}

fillTasksList();