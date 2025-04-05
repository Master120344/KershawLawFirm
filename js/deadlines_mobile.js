document.addEventListener('DOMContentLoaded', () => {
    const deadlineList = document.getElementById('deadline-list');
    const notificationCount = document.getElementById('notification-count');
    let deadlines = JSON.parse(localStorage.getItem('deadlines')) || [];
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    function generateCalendar(month, year) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDay = firstDay.getDay();
        const monthLength = lastDay.getDate();

        let html = `
            <div class="calendar-container">
                <div class="calendar-header">
                    <button class="calendar-nav-btn" id="prev-month-btn">❮</button>
                    <h3 class="calendar-month-title">${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}</h3>
                    <button class="calendar-nav-btn" id="next-month-btn">❯</button>
                </div>
                <div class="calendar-weekdays">
                    <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                </div>
                <div class="calendar-grid">
        `;

        let day = 1;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < startingDay) {
                    html += `<div class="calendar-day other-month"></div>`;
                } else if (day > monthLength) {
                    html += `<div class="calendar-day other-month"></div>`;
                } else {
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isToday = dateStr === new Date().toISOString().split('T')[0];
                    const hasDeadline = deadlines.some(d => d.date === dateStr);
                    html += `
                        <div class="calendar-day${isToday ? ' current-day' : ''}" data-date="${dateStr}">
                            <span class="day-number">${day}</span>
                            ${hasDeadline ? '<div class="event-indicators"><span class="event-dot type-deadline"></span></div>' : ''}
                        </div>`;
                    day++;
                }
            }
            if (day > monthLength) break;
        }

        html += `</div></div>`;
        return html;
    }

    function updateDeadlineList() {
        deadlineList.innerHTML = generateCalendar(currentMonth, currentYear);
        deadlines.sort((a, b) => new Date(a.date) - new Date(b.date));
        const upcomingList = document.createElement('div');
        upcomingList.classList.add('upcoming-events-list');
        deadlines.forEach(deadline => {
            const deadlineItem = document.createElement('div');
            const isOverdue = new Date(deadline.date) < new Date();
            deadlineItem.classList.add('deadline-item');
            deadlineItem.innerHTML = `
                <strong>${deadline.description}</strong> <br> 
                Date: ${deadline.date} ${deadline.clientName ? `| Client: ${deadline.clientName}` : ''} 
                ${isOverdue ? '<span class="overdue">Overdue</span>' : ''}
            `;
            upcomingList.appendChild(deadlineItem);
        });
        deadlineList.appendChild(upcomingList);

        localStorage.setItem('deadlines', JSON.stringify(deadlines));
        updateDashboardStats();
        checkUpcomingDeadlines();

        document.getElementById('prev-month-btn').addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            updateDeadlineList();
        });

        document.getElementById('next-month-btn').addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            updateDeadlineList();
        });

        document.querySelectorAll('.calendar-day').forEach(day => {
            day.addEventListener('click', () => {
                const date = day.getAttribute('data-date');
                if (date) showDeadlineForm(date);
            });
        });
    }

    function showDeadlineForm(date) {
        const formHTML = `
            <div class="deadline-form" id="deadline-form">
                <h3>Add Deadline for ${date}</h3>
                <div class="form-group">
                    <label for="deadline-desc" class="form-label">Description</label>
                    <input type="text" id="deadline-desc" class="form-control" placeholder="e.g., File H-2A Petition" required>
                </div>
                <div class="form-group">
                    <label for="deadline-client" class="form-label">Client (Optional)</label>
                    <select id="deadline-client" class="form-control">
                        <option value="">No Client</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button class="button primary" id="save-deadline-btn">Save Deadline</button>
                    <button class="button secondary" id="cancel-deadline-btn">Cancel</button>
                </div>
            </div>
        `;
        deadlineList.insertAdjacentHTML('beforeend', formHTML);

        const clientSelect = document.getElementById('deadline-client');
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.name;
            option.textContent = `${client.name} (${client.visaType})`;
            clientSelect.appendChild(option);
        });

        document.getElementById('save-deadline-btn').addEventListener('click', () => {
            const desc = document.getElementById('deadline-desc').value.trim();
            const clientName = document.getElementById('deadline-client').value;
            if (desc) {
                addDeadline({ description: desc, date, clientName });
                document.getElementById('deadline-form').remove();
            } else {
                alert('Please enter a description.');
            }
        });

        document.getElementById('cancel-deadline-btn').addEventListener('click', () => {
            document.getElementById('deadline-form').remove();
        });
    }

    function updateNotification(message) {
        const currentCount = parseInt(notificationCount.textContent) || 0;
        notificationCount.textContent = currentCount + 1;
        window.dispatchEvent(new CustomEvent('notificationAdded', { detail: { message } }));
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
        window.dispatchEvent(new CustomEvent('deadlineAdded', { detail: { description: newDeadline.description, date: newDeadline.date } }));
        return newDeadline;
    }

    function checkUpcomingDeadlines() {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        const upcoming = deadlines.filter(d => d.date === todayStr || d.date === tomorrowStr);
        upcoming.forEach(d => {
            const isToday = d.date === todayStr;
            updateNotification(`Reminder: "${d.description}" is due ${isToday ? 'today' : 'tomorrow'}!`);
            showClippy(`Reminder: "${d.description}" is due ${isToday ? 'today' : 'tomorrow'}!`);
        });
    }

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
        dueDate.setDate(dueDate.getDate() + 7);
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

    updateDeadlineList();

    setInterval(checkUpcomingDeadlines, 60000);
});