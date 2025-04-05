document.addEventListener('DOMContentLoaded', () => {
    const deadlineList = document.getElementById('deadline-list');
    const notificationCount = document.getElementById('notification-count');
    let deadlines = JSON.parse(localStorage.getItem('deadlines')) || [];

    function updateDeadlineList() {
        deadlineList.innerHTML = '';
        deadlines.sort((a, b) => new Date(a.date) - new Date(b.date));
        deadlines.forEach(deadline => {
            const deadlineItem = document.createElement('div');
            deadlineItem.classList.add('deadline-item');
            const isOverdue = new Date(deadline.date) < new Date();
            deadlineItem.innerHTML = `
                <strong>${deadline.description}</strong> <br> 
                Date: ${deadline.date} ${deadline.clientName ? `| Client: ${deadline.clientName}` : ''} 
                ${isOverdue ? '<span class="overdue">Overdue</span>' : ''}
            `;
            deadlineList.appendChild(deadlineItem);
        });
        localStorage.setItem('deadlines', JSON.stringify(deadlines));
        updateDashboardStats();
        checkUpcomingDeadlines();
    }

    function updateNotification(message) {
        const currentCount = parseInt(notificationCount.textContent) || 0;
        notificationCount.textContent = currentCount + 1;
        console.log(`Notification: ${message}`);
    }

    function updateDashboardStats() {
        const upcomingDeadlines = document.getElementById('upcoming-deadlines');
        if (upcomingDeadlines) {
            const futureDeadlines = deadlines.filter(d => new Date(d.date) >= new Date());
            upcomingDeadlines.textContent = futureDeadlines.length;
        }
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

    function addDeadline(deadlineData) {
        const newDeadline = {
            id: Date.now(),
            description: deadlineData.description,
            date: deadlineData.date,
            clientName: deadlineData.clientName || ''
        };
        deadlines.push(newDeadline);
        updateDeadlineList();
        updateNotification(`Deadline Added: ${newDeadline.description}`);
        showClippy(`Deadline "${newDeadline.description}" set for ${newDeadline.date}!`);
        return newDeadline;
    }

    function checkUpcomingDeadlines() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const upcoming = deadlines.filter(d => {
            const deadlineDate = new Date(d.date);
            return deadlineDate >= today && deadlineDate <= tomorrow;
        });
        upcoming.forEach(d => {
            showClippy(`Reminder: "${d.description}" is due ${d.date === today.toISOString().split('T')[0] ? 'today' : 'tomorrow'}!`);
        });
    }

    // Sync with AI Assistant, Clients, and Tasks
    window.addEventListener('aiCommandProcessed', (e) => {
        const command = e.detail.command.toLowerCase();
        if (command.includes('deadline') && command.includes('by')) {
            const deadlineData = parseDeadlineDataFromAI(command);
            addDeadline(deadlineData);
        }
    });

    window.addEventListener('clientTaskAdded', (e) => {
        const { taskTitle, dueDate, clientId } = e.detail;
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        const client = clients.find(c => c.id === clientId);
        if (client) {
            const deadlineData = { description: `${taskTitle} Deadline`, date: dueDate, clientName: client.name };
            addDeadline(deadlineData);
        }
    });

    window.addEventListener('documentSent', (e) => {
        const { clientName, type } = e.detail;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7); // Default 7-day signing deadline
        const deadlineData = {
            description: `${type} Signing Deadline`,
            date: dueDate.toISOString().split('T')[0],
            clientName
        };
        addDeadline(deadlineData);
    });

    function parseDeadlineDataFromAI(command) {
        const parts = command.split(' ');
        const byIndex = parts.indexOf('by');
        const clientNameMatch = command.match(/for\s+(.+?)\s+by/i);
        return {
            description: parts.slice(parts.indexOf('deadline') + 1, byIndex).join(' '),
            date: parts.slice(byIndex + 1, byIndex + 4).join(' '),
            clientName: clientNameMatch ? clientNameMatch[1] : ''
        };
    }

    // Initial load
    updateDeadlineList();

    // Periodic check for reminders (every minute)
    setInterval(checkUpcomingDeadlines, 60000);
});