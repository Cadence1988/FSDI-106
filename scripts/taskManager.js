// Function to fetch and display all tasks when the page loads
function loadTasks() {
    $.ajax({
        type: 'GET',
        url: 'http://fsdiapi.azurewebsites.net/api/tasks',
        success: function(response) {
            console.log('Server response:', response);

            // **Adjustment Start**
            const tasks = Array.isArray(response) ? response : response.tasks || response;
            // **Adjustment End**

            if (Array.isArray(tasks)) {
                tasks.forEach(task => {
                    displayTask(task);
                });
            } else {
                console.log('Tasks are not in the expected format:', tasks);
            }
        },
        error: function(error) {
            console.log('Error fetching tasks:', error);
        }
    });
}

// Function to display a task in the #list section
function displayTask(task) {
    const taskHtml = `
        <div class="card my-2" style="background-color: ${task.color}">
            <div class="card-body">
                <h5 class="card-title">${task.title}</h5>
                <p class="card-text">${task.description}</p>
                <p class="card-text"><small>${task.date}</small></p>
                <p class="card-text"><strong>${task.status}</strong></p>
                <p class="card-text"><strong>Budget: $${task.budget}</strong></p>
                <button class="btn btn-danger delete-button">Delete</button>
            </div>
        </div>
    `;
    $('#list').append(taskHtml);
}

// Function to reset the form inputs after saving a task
function resetForm() {
    $('#txtTitle').val('');
    $('#txtDescription').val('');
    $('#txtColor').val('');
    $('#txtDate').val('');
    $('#selStatus').val('New');
    $('#numBudget').val('');
}

// Function to save a task and reset the form
function saveTask() {
    console.log('Task Manager');
    const title = $('#txtTitle').val();
    const description = $('#txtDescription').val();
    const color = $('#txtColor').val();
    const date = $('#txtDate').val();
    const status = $('#selStatus').val();
    const budget = $('#numBudget').val();

    console.log(title, description, color, date, status, budget);

    let taskSave = new task(title, description, color, date, status, budget);
    console.log(taskSave);

    // Save to server
    $.ajax({
        type: 'post',
        url: "http://fsdiapi.azurewebsites.net/api/tasks/",
        data: JSON.stringify(taskSave),
        contentType: 'application/json',
        success: function(response) {
            console.log(response);
            displayTask(taskSave); // Display the new task
            resetForm(); // Reset the form
            showPopup(); // Show success popup
        },
        error: function(error) {
            console.log(error);
        }
    });
}

// Function to delete all tasks
function deleteAllTasks() {
    $.ajax({
        type: 'DELETE',
        url: 'http://fsdiapi.azurewebsites.net/api/tasks/clear/your-email@example.com', // Replace with actual user identifier if needed
        success: function(response) {
            console.log('All tasks deleted:', response);
            $('#list').empty(); // Clear the displayed tasks
        },
        error: function(error) {
            console.log('Error deleting tasks:', error);
        }
    });
}

// Function to show the success popup
function showPopup() {
    $('#popupContainer').show(); // Show the popup
}

// Function to hide the success popup
function hidePopup() {
    $('#popupContainer').hide(); // Hide the popup
}

// Updated init function to include delete all tasks functionality
function init() {
    loadTasks(); // Load and display all tasks
    $('#btnSave').click(saveTask); // Attach save button click event
    $('#btnDeleteAll').click(deleteAllTasks); // Attach delete all button click event
    $('#closePopupButton').click(hidePopup); // Attach close popup button click event
}

// Handling the delete button click for dynamically created tasks
$('#list').on('click', '.delete-button', function() {
    // Handle delete action
    // You can use AJAX to remove the task from the server and then remove the task from the DOM
});

window.onload = init;
