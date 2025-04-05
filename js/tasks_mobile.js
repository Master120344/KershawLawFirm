document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const notificationCount = document.getElementById('notification-count');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const taskFormHTML = `
        <div class="task-form" id="task-form">
            <h3>Add New Task</h3>
            <div class="form-group">
                <label for="task-client" class="form-label">Client (Optional)</label>
                <select id="task-client" class="form-control">
                    <option value="">No Client</option>
                </select>
            </div>
            <div class="form-group">
                <label for="task-title" class="form-label">Task Title</label>
                <input type="text" id="task-title" class="form-control" placeholder="e.g., Prepare LCA" required>
            </div>
            <div class="form-group">
                <label for="task-due" class="form-label">Due Date</label>
                <input type="date" id="task-due" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="task-assigned" class="form-label">Assigned To</label>
                <input type="text" id="task-assigned" class="form-control" placeholder="e.g., Jane Doe" required>
            </div>
            <div class="form-actions">
                <button class="button primary" id="save-task-btn">Save Task</button>
                <button class="button secondary" id="cancel-task-btn">Cancel</button>
            </div>
        </div>
    `;

    function updateTaskList() {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('task-item');
            taskItem.innerHTML = `
                <strong>${task.title}</strong> <br> 
                Due: ${task.dueDate} | Assigned: ${task.assignedTo} 
                ${task.clientName ? `<br> Client: ${task.clientName}` : ''} 
                <button class="icon-button subtle complete-task-btn" data-task-id="${task.id}" title="Complete">✅</button>
            `;
            taskList.appendChild(taskItem);
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateDashboardStats();
    }

    function updateNotification(message) {
        const currentCount = parseInt(notificationCount.textContent) || 0;
        notificationCount.textContent = currentCount + 1;
        console.log(`Notification: ${message}`);
    }

    function updateDashboardStats() {
        const pendingTasks = document.getElementById('pending-tasks');
        if (pendingTasks) pendingTasks.textContent = tasks.filter(t => t.status === 'pending').length;
    }

    function showClippy(message) {
        const clippyMessage = document.getElementById('clippy-message');
        if (clippyMessage) clippyMessage.textContent = message;
        const clippy = document.getElementById('clippy-lawyer');
        if (clippy) {
            clippy.style.display = 'block';
            clippy.style.opacity = '1';
            clippy.classList.add('bounce');
            setTimeout(() => clippy.classList.remove('bounce'), 1500);
        }
    }

    function addTask(taskData) {
        const newTask = {
            id: Date.now(),
            title: taskData.title,
            dueDate: taskData.dueDate,
            assignedTo: taskData.assignedTo,
            clientName: taskData.clientName || '',
            status: 'pending'
        };
        tasks.push(newTask);
        updateTaskList();
        updateNotification(`Task Added: ${newTask.title}`);
        showClippy(`Task "${newTask.title}" added! Need help with it?`);
        return newTask;
    }

    function completeTask(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.status = 'completed';
            updateTaskList();
            updateNotification(`Task Completed: ${task.title}`);
            showClippy(`Great job completing "${task.title}"!`);
        }
    }

    function showTaskForm() {
        if (!document.getElementById('task-form')) {
            taskList.insertAdjacentHTML('beforeend', taskFormHTML);
            const form = document.getElementById('task-form');
            const clientSelect = document.getElementById('task-client');
            const saveBtn = document.getElementById('save-task-btn');
            const cancelBtn = document.getElementById('cancel-task-btn');

            // Populate client dropdown
            const clients = JSON.parse(localStorage.getItem('clients')) || [];
            clients.forEach(client => {
                const option = document.createElement('option');
                option.value = client.name;
                option.textContent = `${client.name} (${client.visaType})`;
                clientSelect.appendChild(option);
            });

            saveBtn.addEventListener('click', () => {
                const title = document.getElementById('task-title').value.trim();
                const dueDate = document.getElementById('task-due').value;
                const assignedTo = document.getElementById('task-assigned').value.trim();
                const clientName = clientSelect.value;

                if (title && dueDate && assignedTo) {
                    const taskData = { title, dueDate, assignedTo, clientName };
                    addTask(taskData);
                    form.remove();
                } else {
                    alert('Please fill in Title, Due Date, and Assigned To.');
                }
            });

            cancelBtn.addEventListener('click', () => form.remove());
        }
    }

    addTaskBtn.addEventListener('click', showTaskForm);

    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('complete-task-btn')) {
            const taskId = parseInt(e.target.getAttribute('data-task-id'));
            completeTask(taskId);
        }
    });

    // Sync with AI Assistant and Client Management
    window.addEventListener('aiCommandProcessed', (e) => {
        const command = e.detail.command.toLowerCase();
        if (command.includes('task') && command.includes('by')) {
            const taskData = parseTaskDataFromAI(command);
            addTask(taskData);
        }
    });

    window.addEventListener('clientTaskAdded', (e) => {
        const { clientId, taskTitle, dueDate } = e.detail;
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        const client = clients.find(c => c.id === clientId);
        if (client) {
            const taskData = { title: taskTitle, dueDate, assignedTo: 'You', clientName: client.name };
            addTask(taskData);
        }
    });

    function parseTaskDataFromAI(command) {
        const parts = command.split(' ');
        const byIndex = parts.indexOf('by');
        const clientNameMatch = command.match(/for\s+(.+?)\s+by/i);
        return {
            title: parts.slice(parts.indexOf('task') + 1, byIndex).join(' '),
            dueDate: parts.slice(byIndex + 1, byIndex + 4).join(' '),
            assignedTo: parts.slice(byIndex + 4).join(' ') || 'You',
            clientName: clientNameMatch ? clientNameMatch[1] : ''
        };
    }

    // Initial load
    updateTaskList();
});