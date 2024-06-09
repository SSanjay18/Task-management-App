document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('task-form');
    const tasksList = document.getElementById('tasks-list');

    // Fetches all tasks on initial load
    fetchTasks();

    // Event listener for form submission
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const dueDate = document.getElementById('dueDate').value;

        const taskData = {
            title,
            description,
            dueDate
        };

        createTask(taskData);
    });

    // Function to fetch all tasks
    function fetchTasks() {
        fetch('/api/tasks')
            .then(response => response.json())
            .then(data => {
                tasksList.innerHTML = '';
                if (Array.isArray(data)) {
                    data.forEach(task => {
                        const taskElement = document.createElement('li');
                        taskElement.innerHTML = `
                            <div class="task-title">${task.title}</div>
                            <div class="task-description">${task.description}</div>
                            <div class="task-due-date">Due: ${new Date(task.dueDate).toLocaleDateString()}</div>
                            <div class="task-buttons">
                                <button onclick="editTask('${task._id}')">Edit</button>
                                <button onclick="deleteTask('${task._id}')">Delete</button>
                            </div>
                        `;
                        taskElement.id = `task-${task._id}`;
                        tasksList.appendChild(taskElement);
                    });
                } else {
                    console.error('Error: Response is not an array');
                }
            })
            .catch(error => console.error('Error fetching tasks:', error));
    }

    // Function to create a new task
    function createTask(taskData) {
        fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Task created:', data);
            fetchTasks(); // Refreshes the tasks list
        })
        .catch(error => console.error('Error creating task:', error));
    }

    // Function to edit a task
    window.editTask = function(taskId) {
        // Fetch the task data
        fetch(`/api/tasks/${taskId}`)
            .then(response => response.json())
            .then(task => {
                document.getElementById('title').value = task.title;
                document.getElementById('description').value = task.description;
                document.getElementById('dueDate').value = task.dueDate.split('T')[0];
                // Add a hidden field to hold the task ID for editing
                let taskIdField = document.getElementById('task-id');
                if (!taskIdField) {
                    taskIdField = document.createElement('input');
                    taskIdField.type = 'hidden';
                    taskIdField.id = 'task-id';
                    taskForm.appendChild(taskIdField);
                }
                taskIdField.value = task._id;
            })
            .catch(error => console.error('Error fetching task:', error));
    };

    // Function to delete a task
    window.deleteTask = function(taskId) {
        fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        })
        .then(() => {
            console.log('Task deleted');
            fetchTasks(); // Refreshes the tasks list
        })
        .catch(error => console.error('Error deleting task:', error));
    };

    // Clear form function
    window.clearForm = function() {
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
        document.getElementById('dueDate').value = '';
        const taskIdField = document.getElementById('task-id');
        if (taskIdField) {
            taskIdField.remove();
        }
    };

    // Adding clear button event listener
    const clearButton = document.getElementById('clear-form');
    if (clearButton) {
        clearButton.addEventListener('click', function(e) {
            e.preventDefault();
            clearForm();
        });
    }
});
