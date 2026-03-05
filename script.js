const todayDateEl = document.getElementById("todayDate");
const today = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
todayDateEl.innerText = today.toLocaleDateString('en-US', options);
const hourSelect = document.getElementById("taskHour");
for(let i=0; i<24; i++){
    let option = document.createElement("option");
    option.value = i;
    const formattedHour = i.toString().padStart(2, '0') + ":00";
    option.text = formattedHour;
    hourSelect.appendChild(option);
}
const taskDateInput = document.getElementById("taskDate");
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
taskDateInput.value = `${year}-${month}-${day}`;
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
function addTask() {
    const text = document.getElementById("taskInput").value.trim();
    const date = document.getElementById("taskDate").value;
    const hour = document.getElementById("taskHour").value;

    if(text === "" || date === "" || hour === ""){
        alert("Fill all fields");
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        date: date,
        hour: parseInt(hour, 10),
        done: false
    };

    tasks.push(task);
    document.getElementById("taskInput").value = "";
    
    saveTasks();
    renderTasks();
}
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";
    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.hour - b.hour;
    });

    if (sortedTasks.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.7); padding: 20px;">No tasks. Enjoy your day!</p>';
        return;
    }

    sortedTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task";

        if(task.done){
            li.classList.add("completed");
        }
        
        const formattedHour = task.hour.toString().padStart(2, '0') + ":00";
        const dateObj = new Date(task.date);

        const displayDate = new Date(dateObj.getTime() + Math.abs(dateObj.getTimezoneOffset() * 60000)).toLocaleDateString('en-US', {month: 'short', day: 'numeric'});

        li.innerHTML = `
            <div class="task-info">
                <span class="task-text">${escapeHTML(task.text)}</span>
                <span class="task-time">📅 ${displayDate} | ⏰ ${formattedHour}</span>
            </div>
            <div class="task-actions">
                <button class="complete-btn" onclick="completeTask(${task.id})" title="${task.done ? 'Undo' : 'Complete'}">
                    ${task.done ? '↺' : '✓'}
                </button>
                <button class="delete-btn" onclick="deleteTask(${task.id})" title="Delete">
                    🗑
                </button>
            </div>
        `;

        list.appendChild(li);
    });
}
function completeTask(id) {
    tasks = tasks.map(task => {
        if(task.id === id){
            task.done = !task.done;
        }
        return task;
    });

    saveTasks();
    renderTasks();
}
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}
function generateCalendar() {
    const calendar = document.getElementById("calendar");
    calendar.innerHTML = "";
    
    const currYear = today.getFullYear();
    const currMonth = today.getMonth();
    const daysInMonth = new Date(currYear, currMonth + 1, 0).getDate();
    const currDate = today.getDate();

    for(let i=1; i<=daysInMonth; i++) {
        const day = document.createElement("div");
        day.className = "day";
        day.innerText = i;
        
        if (i === currDate) {
            day.classList.add("today");
        }
        day.addEventListener("click", () => {
            const formattedMonth = String(currMonth + 1).padStart(2, '0');
            const formattedDay = String(i).padStart(2, '0');
            taskDateInput.value = `${currYear}-${formattedMonth}-${formattedDay}`;
        });

        calendar.appendChild(day);
    }
}
function generateTimeline() {
    const timeline = document.getElementById("timeline");
    timeline.innerHTML = "";
    
    const currentHour = today.getHours();

    for(let i=0; i<24; i++) {
        const hourDiv = document.createElement("div");
        hourDiv.className = "hour";
        const formattedHour = i.toString().padStart(2, '0') + ":00";
        hourDiv.innerText = formattedHour;
        
        if (i === currentHour) {
            hourDiv.style.background = 'rgba(0, 198, 255, 0.4)';
            hourDiv.style.borderColor = 'var(--primary-color)';
        }
        
        hourDiv.addEventListener("click", () => {
            document.getElementById("taskHour").value = i;
        });

        timeline.appendChild(hourDiv);
    }
}
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
generateCalendar();
generateTimeline();
renderTasks();
