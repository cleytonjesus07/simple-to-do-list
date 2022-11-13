const INPUT = document.querySelector(".containerInput > input");
const ADDTASK_BUTTON = document.querySelector(".containerInput > button");
const TASKLIST = document.getElementsByClassName("tasksList")[0];
const DELETEALL_BUTTON = document.querySelector(".removeContainer > button");
let id = 0;
let tasks = [];

window.addEventListener("keypress", (e) => (e.key === "Enter") && addTask());

ADDTASK_BUTTON.setAttribute("disabled", true);
DELETEALL_BUTTON.onclick = () => deleteAllTasks(true);
INPUT.onkeyup = (e) => !e.target.value.length ? ADDTASK_BUTTON.setAttribute("disabled", true) : ADDTASK_BUTTON.removeAttribute("disabled");
ADDTASK_BUTTON.onclick = () => addTask();


function addTask() {
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
    INPUT.value = "";
    return;
}

function deleteTask(el, id) {
    let taskDescription = el.parentNode.children[1].innerText;
    if (confirm(`Deseja excluir a tarefa: ${taskDescription}`)) {
        tasks = tasks.filter((task) => task.id !== id);
        deleteAllTasks();
        fillTasksList();
    }
    return;
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
                            <span title="Clique em mim para me editar!" onClick='editTask(this,${id})'>${desc}</span>
                            <span id='timestamp'>${getTime(hours, minutes, seconds)} - (${convertDay(day)})</span>
                            <button onClick="deleteTask(this,${id})">🗑️</button>
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

function editTask(el, id) {
    el.contentEditable = true;
    el.style.color = "#000";
    el.style.backgroundColor = "#fff";
    el.style.padding = "1em 0";
    el.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            tasks.filter(task => {
                if (task.id === id && el.innerText) {
                    task.desc = el.innerText
                }
            })
            el.style.color = "#fff";
            el.style.backgroundColor = "transparent";
            el.style.padding = "initial";
        }
    })

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


/* Start */
fillTasksList();