flatpickr("#taskTime", {
    enableTime: true,              // Enables time selection
    dateFormat: "Y-m-d H:i",       // Format for date and time (YYYY-MM-DD HH:mm)
    time_24hr: true                // Use 24-hour time format
});

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
        <div class="status ${getStatusClass()}">${getStatus()}</div>
        <div class="task-details">
            <p><strong>Priority: </strong> ${taskPriority}</p>
            <p><strong>Deadline: </strong> ${taskTime}</p>
            <p><strong>Time left: </strong> ${calculateTimeLeft(taskTime)}</p>
        </div>
    `;
    
    // Append the task block to the task container
    taskContainer.appendChild(taskBlock);

    // Clear form inputs
    taskForm.reset();

    let activeTimer = null;
    let startTime;

    // Start timer functionality
    taskBlock.addEventListener('click', function() {
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
    });
});

// Function to calculate time left (just an example)
function calculateTimeLeft(deadline) {
    const currentTime = new Date();
    const deadlineTime = new Date(deadline);
    const timeDifference = deadlineTime - currentTime;
    const hoursLeft = Math.floor(timeDifference / (1000 * 60 * 60));
    return `${hoursLeft} hours`;
}

// Function to get the status of the task (for illustration)
function getStatus() {
    return 'In Progress'; // Replace with logic to dynamically set status
}

// Function to get the status class (for illustration)
function getStatusClass() {
    return 'in-progress'; // Replace with dynamic status classes ('completed', 'in-progress', etc.)
}

// Add styles for hover functionality in the CSS
// .task-details {
//    display: none;
// }

// .task-block:hover .task-details {
//     display: block;
// }


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

let currentReport = 'today'; // Tracks the current report (today, month, overall)

// Sample data for reports
const reports = {
    today: { hoursFocused: 5, tasksCompleted: 3 },
    month: { hoursFocused: 50, tasksCompleted: 30 },
    overall: { hoursFocused: 500, tasksCompleted: 300 },
};

// Function to update the displayed report data
function updateReport() {
    const reportTitle = document.getElementById('report-title');
    const hoursFocused = document.getElementById('hours-focused');
    const tasksCompleted = document.getElementById('tasks-completed');
    
    reportTitle.textContent = currentReport.charAt(0).toUpperCase() + currentReport.slice(1); // Capitalize the first letter of the report name
    hoursFocused.textContent = `${reports[currentReport].hoursFocused} hours`;
    tasksCompleted.textContent = `${reports[currentReport].tasksCompleted} tasks`;
}

// Event listeners for navigation buttons
document.getElementById('prev-report').addEventListener('click', () => {
    if (currentReport === 'today') {
        currentReport = 'overall'; // Move to overall
    } else if (currentReport === 'month') {
        currentReport = 'today'; // Move to today
    } else if (currentReport === 'overall') {
        currentReport = 'month'; // Move to month
    }
    updateReport();
});

document.getElementById('next-report').addEventListener('click', () => {
    if (currentReport === 'today') {
        currentReport = 'month'; // Move to month
    } else if (currentReport === 'month') {
        currentReport = 'overall'; // Move to overall
    } else if (currentReport === 'overall') {
        currentReport = 'today'; // Move to today
    }
    updateReport();
});

// Initialize the report
updateReport();
