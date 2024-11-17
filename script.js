flatpickr("#taskTime", {
    enableTime: true,              // Enables time selection
    dateFormat: "Y-m-d H:i",       // Format for date and time (YYYY-MM-DD HH:mm)
    time_24hr: true                // Use 24-hour time format
});
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

// Handle form submission to add a task to both task list and calendar
taskForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    // Get form values
    const taskName = taskNameInput.value.trim();
    const taskTime = taskTimeInput.value.trim();
    const taskPriority = taskPriorityInput.value.trim();

    // Validate that taskName and taskTime are provided
    if (!taskName || !taskTime) {
        alert("Please provide both task name and deadline.");
        return;
    }

    // Display task in a block
    const taskContainer = document.querySelector('.task-container');
    const taskBlock = document.createElement('div');
    taskBlock.classList.add('task-block', `priority-${taskPriority}`);

    // Generate task block content
    taskBlock.innerHTML = `
        <h3>${taskName}</h3>
        <div class="status pending">Pending</div>
        <div class="task-details">
            <p><strong>Priority: </strong> ${capitalizeFirstLetter(taskPriority)}</p>
            <p><strong>Deadline: </strong> ${taskTime}</p>
            <p><strong>Time left: </strong> ${calculateTimeLeft(taskTime)}</p>
        </div>
        <input type="checkbox" class="mark-complete" />
    `;

    // Append the task block to the task container
    taskContainer.appendChild(taskBlock);

    // Add event listener for the "Mark Complete" checkbox
    const completeCheckbox = taskBlock.querySelector('.mark-complete');
    const statusDiv = taskBlock.querySelector('.status');

    completeCheckbox.addEventListener('change', function () {
        if (completeCheckbox.checked) {
            taskBlock.classList.add('completed');
            statusDiv.className = 'status completed';
            statusDiv.textContent = 'Completed';
        } else {
            taskBlock.classList.remove('completed');
            statusDiv.className = 'status pending';
            statusDiv.textContent = 'Pending';
        }
    });

    // Check if deadline is passed periodically
    const interval = setInterval(() => {
        if (isDeadlinePassed(taskTime)) {
            statusDiv.textContent = 'Deadline Passed';
            statusDiv.className = 'status deadline-passed';
            clearInterval(interval); // Stop checking once the status is updated
        } else {
            statusDiv.textContent = 'Pending';
            statusDiv.className = 'status pending';
        }
    }, 1000);

    // Clear form inputs
    taskForm.reset();
});

// Helper function: Capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Helper function: Check if the deadline has passed
function isDeadlinePassed(taskTime) {
    const deadline = new Date(taskTime);
    const now = new Date();
    return now >= deadline;
}

// Helper function: Calculate time left until deadline
function calculateTimeLeft(taskTime) {
    const deadline = new Date(taskTime);
    const now = new Date();
    const timeLeft = deadline - now;

    if (timeLeft <= 0) {
        return "Deadline passed";
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m remaining`;
}

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
