// Select elements
const daysContainer = document.getElementById("days");
const monthYearDisplay = document.getElementById("month-year");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

// Define months and get current date
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let currentDate = new Date();

// Function to render calendar
function renderCalendar(date) {
    daysContainer.innerHTML = ""; // Clear previous days
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = new Date();

    // Get first and last day of the month
    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();

    // Display month and year
    monthYearDisplay.textContent = `${months[month]} ${year}`;

    // Add blank days for days of the week before the 1st of the month
    for (let i = 0; i < firstDayIndex; i++) {
        const blankDay = document.createElement("div");
        daysContainer.appendChild(blankDay);
    }

    // Add days of the current month
    for (let day = 1; day <= lastDay; day++) {
        const dayElement = document.createElement("div");
        dayElement.textContent = day;

        // Check if the day is today
        if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
            dayElement.classList.add("today");
        }

        daysContainer.appendChild(dayElement);
    }
}

// Navigation buttons
prevButton.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

nextButton.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

// Initial render
renderCalendar(currentDate);

// Function to format the time remaining
function calculateTimeLeft(taskTime) {
    const currentTime = new Date();
    const deadline = new Date(taskTime);
    const timeDifference = deadline - currentTime;

    if (timeDifference <= 0) {
        return "Time's up!";
    }

    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} hrs ${minutes} mins left`;
}

// Add event to calendar (if using FullCalendar)
function addEventToCalendar(taskName, taskTime, calendar) {
    calendar.addEvent({
        title: taskName,
        start: taskTime,
        allDay: false
    });
}

// Get references to form elements
const taskForm = document.getElementById('taskForm');
const taskNameInput = document.getElementById('taskName');
const taskTimeInput = document.getElementById('taskTime');
const taskPriorityInput = document.getElementById('taskPriority');

// Function to calculate time left until the deadline
function calculateTimeLeft(taskTime) {
    const currentTime = new Date();
    const deadline = new Date(taskTime);
    const timeDifference = deadline - currentTime;

    if (timeDifference <= 0) {
        return "Time's up!";
    }

    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} hrs ${minutes} mins left`;
}

// Handle form submission to add task to both task list and calendar
taskForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get form values
    const taskName = taskNameInput.value;
    const taskTime = taskTimeInput.value;
    const taskPriority = taskPriorityInput.value;
    // Validate that taskName and taskTime are provided
    if (!taskName || !taskTime) {
        alert("Please provide both task name and deadline.");
        return;
    }

    // Display task in a block
    const taskContainer = document.querySelector('.task-container');
    const taskBlock = document.createElement('div');
    taskBlock.classList.add('task-block', `priority-${taskPriority}`);
    taskBlock.innerHTML = `
        <h3>${taskName}</h3>
        <p><strong>Priority: </strong> ${taskPriority}</p>
        <p><strong>Deadline: </strong> ${taskTime}</p>
        <p><strong>Time left: </strong> ${calculateTimeLeft(taskTime)}</p>

        <p><strong>Status:</strong></p>
        <div class="status"><div class="status"></div></div>
    `;
    
    // Append the task block to the task container
    taskContainer.appendChild(taskBlock);

    // Clear form inputs
    taskForm.reset();
    const startTimerButton = taskBlock.querySelector('.start-timer');
    let activeTimer = null;
    let startTime;

    startTimerButton.addEventListener('click', function() {
        if (activeTimer) {
            clearInterval(activeTimer);
            alert("Timer stopped for the previous task.");
        }

        // Start tracking time
        startTime = new Date();
        activeTimer = setInterval(() => {
            const now = new Date();
            const timeElapsed = now - startTime;
            const hours = Math.floor(timeElapsed / (1000 * 60 * 60));
            const minutes = Math.floor((timeElapsed % (1000 * 60 * 60)) / (1000 * 60));
            taskBlock.querySelector('.time-spent').textContent = `${hours} hrs ${minutes} mins spent`;
        }, 1000);
    });
});


let activeTimer = null;
let startTime;

document.querySelector('.task-container').addEventListener('click', function(event) {
    if (event.target.classList.contains('start-timer')) {
        const taskBlock = event.target.closest('.task-block');
        
        // If a timer is already active, stop it
        if (activeTimer) {
            clearInterval(activeTimer);
            activeTimer = null;
            alert("Timer stopped for the previous task.");
        }

        // Start tracking time
        startTime = new Date();
        activeTimer = setInterval(() => {
            const now = new Date();
            const timeElapsed = now - startTime;
            const hours = Math.floor(timeElapsed / (1000 * 60 * 60));
            const minutes = Math.floor((timeElapsed % (1000 * 60 * 60)) / (1000 * 60));
            taskBlock.querySelector('.time-spent').textContent = `${hours} hrs ${minutes} mins spent`;
        }, 1000);
    }
});

const themeToggleBtn = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme in localStorage
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'dark') {
    body.classList.add('dark-theme');
    themeToggleBtn.textContent = "🌙 Dark Mode";
} else {
    themeToggleBtn.textContent = "🌞 Bright Mode";
}

// Toggle theme on button click
themeToggleBtn.addEventListener('click', function () {
    body.classList.toggle('dark-theme');
    
    // Update button text based on current theme
    if (body.classList.contains('dark-theme')) {
        themeToggleBtn.textContent = "🌙 Dark Mode";
        localStorage.setItem('theme', 'dark');  // Save theme preference
    } else {
        themeToggleBtn.textContent = "🌞 Bright Mode";
        localStorage.setItem('theme', 'light'); // Save theme preference
    }
});
