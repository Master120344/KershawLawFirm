// ==========================================================================
// Kershaw Law Firm - Admin Dashboard JavaScript (V3.0 - Ultimate H-2A/H-2B Edition)
// ==========================================================================

document.addEventListener('DOMContentLoaded', async () => {
    // === Core Element Selectors ===
    const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const mainContentTitle = document.getElementById('main-content-title');
    const currentYear = document.getElementById('current-year');
    const loadingOverlay = document.getElementById('loading-overlay');
    const globalSearch = document.getElementById('global-search');
    const notificationButton = document.querySelector('.notification-button');
    const logoutButton = document.getElementById('logout-button-dropdown');
    
    // === Client Management Selectors ===
    const addClientBtn = document.getElementById('add-client-btn');
    const clientTableBody = document.getElementById('client-table-body');
    const clientSearchInput = document.getElementById('client-search-input');
    
    // === Case Management Selectors ===
    const addCaseBtn = document.getElementById('add-case-btn');
    const caseTableBody = document.getElementById('case-table-body');
    const caseSearchInput = document.getElementById('case-search-input');
    
    // === Document Management Selectors ===
    const uploadDocBtn = document.getElementById('upload-doc-btn');
    const documentTableBody = document.getElementById('document-table-body');
    
    // === Form Generator Selectors ===
    const formGeneratorForm = document.getElementById('form-generator-form');
    const formPreview = document.getElementById('form-preview');
    const formPreviewContent = document.getElementById('form-preview-content');
    const downloadFormBtn = document.getElementById('download-form-btn');
    
    // === Calendar Selectors ===
    const calendarDays = document.getElementById('calendar-days');
    const monthYear = document.getElementById('month-year');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const todayBtn = document.getElementById('today-btn');
    const addEventBtn = document.getElementById('add-event-btn');
    
    // === Task Management Selectors ===
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskTableBody = document.getElementById('task-table-body');
    
    // === Report Generator Selectors ===
    const reportGeneratorForm = document.getElementById('report-generator-form');
    const reportPreview = document.getElementById('report-preview');
    const reportPreviewContent = document.getElementById('report-preview-content');
    const downloadReportBtn = document.getElementById('download-report-btn');
    
    // === AI Assistant Selectors ===
    const aiChatForm = document.getElementById('ai-chat-form');
    const aiChatMessages = document.getElementById('ai-chat-messages');
    const aiChatInput = document.getElementById('ai-chat-input');
    const aiHistoryBtn = document.getElementById('ai-history-btn');
    
    // === Settings Selectors ===
    const settingsForm = document.getElementById('settings-form');
    const saveSettingsBtn = document.getElementById('save-settings-btn');

    // === Data Stores (Fetched via API) ===
    let clients = await window.api.getClients();
    let cases = await window.api.getCases();
    let documents = await window.api.getDocuments();
    let tasks = await window.api.getTasks() || [];
    let events = await window.api.getEvents() || [
        { id: 'E001', date: '2025-04-15', title: 'H-2A Filing Deadline', caseId: 'H2A-015', type: 'deadline', description: 'Final ETA-9142A submission' },
        { id: 'E002', date: '2025-04-20', title: 'RFE Response Due', caseId: 'H2B-001', type: 'deadline', description: 'Respond to USCIS RFE' },
        { id: 'E003', date: '2025-04-10', title: 'Client Meeting - Acme Corp', caseId: 'H2A-015', type: 'meeting', description: 'Discuss H-2A progress' }
    ];
    let aiHistory = await window.api.getAIHistory() || [];
    let settings = await window.api.getSettings() || { notificationPref: 'email', theme: 'dark', autoSave: true, aiVoice: false };

    // === Initial Setup ===
    currentYear.textContent = new Date().getFullYear();
    renderClients();
    renderCases();
    renderDocuments();
    renderTasks();
    renderCalendar(new Date(2025, 3, 9)); // April 9, 2025

    // === Utility Functions ===
    function showLoading(duration = 500) {
        loadingOverlay.classList.add('is-active');
        setTimeout(() => loadingOverlay.classList.remove('is-active'), duration);
    }

    function switchSection(targetId, title) {
        showLoading(600);
        contentSections.forEach(section => {
            section.classList.remove('is-active');
            section.classList.add('is-exiting');
            section.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
        });
        setTimeout(() => {
            contentSections.forEach(section => {
                section.classList.remove('is-exiting');
                if (section.id === targetId) {
                    section.classList.add('is-active');
                    mainContentTitle.textContent = title;
                    mainContentTitle.style.animation = 'fadeIn 0.6s ease-in-out';
                }
            });
        }, 450);
    }

    function generateId(prefix) {
        return `${prefix}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    }

    function formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    // === Navigation ===
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            const title = link.getAttribute('data-title');
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            link.style.transition = 'background 0.3s ease, transform 0.3s ease';
            link.style.transform = 'scale(1.05)';
            setTimeout(() => link.style.transform = 'scale(1)', 300);
            switchSection(targetId, title);
        });
    });

    // === Global Search ===
    globalSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        filterClients(query);
        filterCases(query);
        filterDocuments(query);
        filterTasks(query);
        globalSearch.style.transition = 'width 0.3s ease, box-shadow 0.3s ease';
    });

    globalSearch.addEventListener('focus', () => {
        globalSearch.style.boxShadow = '0 0 10px var(--color-primary-red-glow)';
    });

    globalSearch.addEventListener('blur', () => {
        globalSearch.style.boxShadow = 'inset 0 1px 4px var(--color-shadow-inset)';
    });

    // === Logout ===
    logoutButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to logout? All unsaved changes will be lost.')) {
            showLoading(800);
            setTimeout(() => alert('Logged out successfully (Simulated).'), 800);
        }
    });

    // === Client Management ===
    async function renderClients(filter = '') {
        clients = await window.api.getClients();
        clientTableBody.innerHTML = '';
        const filteredClients = clients.filter(c => 
            c.name.toLowerCase().includes(filter) || 
            c.email.toLowerCase().includes(filter) || 
            c.phone.includes(filter) || 
            c.cases.some(id => id.toLowerCase().includes(filter))
        );
        filteredClients.forEach(client => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${client.name}</td>
                <td>${client.email}</td>
                <td>${client.phone}</td>
                <td>${client.cases.join(', ')}</td>
                <td>
                    <button class="button small secondary view-client" data-id="${client.id}">View</button>
                    <button class="button small secondary edit-client" data-id="${client.id}">Edit</button>
                    <button class="button small secondary delete-client" data-id="${client.id}">Delete</button>
                </td>`;
            row.style.transition = 'background 0.3s ease, transform 0.3s ease';
            clientTableBody.appendChild(row);
        });
        attachClientEventListeners();
    }

    function filterClients(query) {
        renderClients(query);
    }

    async function addClient(client) {
        await window.api.addClient(client);
        clients = await window.api.getClients();
        renderClients();
        window.triggerNotification(`New client "${client.name}" added`);
    }

    async function editClient(id, updatedClient) {
        const index = clients.findIndex(c => c.id === id);
        if (index !== -1) {
            clients[index] = { ...clients[index], ...updatedClient };
            await window.api.updateClient(id, clients[index]); // Assuming API supports update
            renderClients();
            window.triggerNotification(`Client "${updatedClient.name}" updated`);
        }
    }

    async function deleteClient(id) {
        await window.api.deleteClient(id); // Assuming API supports delete
        clients = await window.api.getClients();
        renderClients();
        window.triggerNotification(`Client deleted (ID: ${id})`);
    }

    function attachClientEventListeners() {
        document.querySelectorAll('.view-client').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const client = clients.find(c => c.id === id);
                alert(`Client Details:\nName: ${client.name}\nEmail: ${client.email}\nPhone: ${client.phone}\nCases: ${client.cases.join(', ')}\nAddress: ${client.address}\nStatus: ${client.status}\nCreated: ${client.created}`);
            });
        });

        document.querySelectorAll('.edit-client').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const client = clients.find(c => c.id === id);
                const name = prompt('Enter new name:', client.name);
                const email = prompt('Enter new email:', client.email);
                const phone = prompt('Enter new phone:', client.phone);
                if (name && email && phone) {
                    editClient(id, { name, email, phone });
                }
            });
        });

        document.querySelectorAll('.delete-client').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                if (confirm('Are you sure you want to delete this client?')) {
                    deleteClient(id);
                }
            });
        });
    }

    addClientBtn.addEventListener('click', () => {
        const name = prompt('Enter client name:');
        const email = prompt('Enter client email:');
        const phone = prompt('Enter client phone:');
        if (name && email && phone) {
            const newClient = { 
                name, 
                email, 
                phone, 
                cases: [], 
                address: 'N/A', 
                status: 'Active', 
                created: new Date().toISOString().split('T')[0] 
            };
            addClient(newClient);
        }
    });

    clientSearchInput.addEventListener('input', (e) => filterClients(e.target.value.toLowerCase()));

    // === Case Management ===
    async function renderCases(filter = '') {
        cases = await window.api.getCases();
        caseTableBody.innerHTML = '';
        const filteredCases = cases.filter(c => 
            c.id.toLowerCase().includes(filter) || 
            c.client.toLowerCase().includes(filter) || 
            c.visaType.toLowerCase().includes(filter) || 
            c.status.toLowerCase().includes(filter)
        );
        filteredCases.forEach(caseData => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${caseData.id}</td>
                <td>${caseData.client}</td>
                <td>${caseData.visaType}</td>
                <td>${caseData.status}</td>
                <td>${caseData.deadline}</td>
                <td>
                    <button class="button small secondary view-case" data-id="${caseData.id}">View</button>
                    <button class="button small secondary edit-case" data-id="${caseData.id}">Edit</button>
                    <button class="button small secondary delete-case" data-id="${caseData.id}">Delete</button>
                </td>`;
            row.style.transition = 'background 0.3s ease, transform 0.3s ease';
            caseTableBody.appendChild(row);
        });
        attachCaseEventListeners();
    }

    function filterCases(query) {
        renderCases(query);
    }

    async function addCase(caseData) {
        await window.api.addCase(caseData);
        cases = await window.api.getCases();
        renderCases();
        window.triggerNotification(`New case "${caseData.id}" added`);
    }

    async function editCase(id, updatedCase) {
        const index = cases.findIndex(c => c.id === id);
        if (index !== -1) {
            cases[index] = { ...cases[index], ...updatedCase, updated: new Date().toISOString().split('T')[0] };
            await window.api.updateCase(id, cases[index]); // Assuming API supports update
            renderCases();
            window.triggerNotification(`Case "${id}" updated`);
        }
    }

    async function deleteCase(id) {
        await window.api.deleteCase(id); // Assuming API supports delete
        cases = await window.api.getCases();
        renderCases();
        window.triggerNotification(`Case "${id}" deleted`);
    }

    function attachCaseEventListeners() {
        document.querySelectorAll('.view-case').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const caseData = cases.find(c => c.id === id);
                const stages = caseData.stages.map(s => `${s.name}: ${s.status} (${s.date})`).join('\n');
                alert(`Case Details:\nID: ${caseData.id}\nClient: ${caseData.client}\nVisa Type: ${caseData.visaType}\nStatus: ${caseData.status}\nDeadline: ${caseData.deadline}\nPriority: ${caseData.priority}\nNotes: ${caseData.notes}\nCreated: ${caseData.created}\nUpdated: ${caseData.updated}\nStages:\n${stages}`);
            });
        });

        document.querySelectorAll('.edit-case').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const caseData = cases.find(c => c.id === id);
                const client = prompt('Enter client name:', caseData.client);
                const visaType = prompt('Enter visa type (H-2A/H-2B):', caseData.visaType);
                const status = prompt('Enter status:', caseData.status);
                const deadline = prompt('Enter deadline (YYYY-MM-DD):', caseData.deadline);
                if (client && visaType && status && deadline) {
                    editCase(id, { client, visaType, status, deadline });
                }
            });
        });

        document.querySelectorAll('.delete-case').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                if (confirm('Are you sure you want to delete this case?')) {
                    deleteCase(id);
                }
            });
        });
    }

    addCaseBtn.addEventListener('click', () => {
        const clientName = prompt('Enter client name:');
        const client = clients.find(c => c.name === clientName);
        if (!client) {
            alert('Client not found. Please add the client first.');
            return;
        }
        const visaType = prompt('Enter visa type (H-2A/H-2B):');
        const status = prompt('Enter initial status:');
        const deadline = prompt('Enter deadline (YYYY-MM-DD):');
        if (visaType && status && deadline) {
            const newCase = { 
                clientId: client.id, 
                client: client.name, 
                visaType, 
                status, 
                deadline, 
                notes: '', 
                priority: 'Medium', 
                created: new Date().toISOString().split('T')[0], 
                updated: new Date().toISOString().split('T')[0], 
                stages: [{ name: visaType === 'H-2A' ? 'ETA-9142A' : 'I-129', status: 'Pending', date: new Date().toISOString().split('T')[0] }]
            };
            addCase(newCase);
            client.cases.push(newCase.id);
            editClient(client.id, client);
        }
    });

    caseSearchInput.addEventListener('input', (e) => filterCases(e.target.value.toLowerCase()));

    // === Document Management ===
    async function renderDocuments(filter = '') {
        documents = await window.api.getDocuments();
        documentTableBody.innerHTML = '';
        const filteredDocs = documents.filter(d => 
            d.fileName.toLowerCase().includes(filter) || 
            d.client.toLowerCase().includes(filter) || 
            d.caseId.toLowerCase().includes(filter)
        );
        filteredDocs.forEach(doc => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doc.fileName}</td>
                <td>${doc.client}</td>
                <td>${doc.caseId}</td>
                <td>${doc.uploaded}</td>
                <td>${doc.status}${doc.wetSignature ? ' (Wet Signed)' : ''}${doc.docusign ? ' (DocuSign)' : ''}</td>
                <td>
                    <button class="button small secondary review-doc" data-id="${doc.id}">Review</button>
                    <button class="button small secondary download-doc" data-id="${doc.id}">Download</button>
                    <button class="button small secondary delete-doc" data-id="${doc.id}">Delete</button>
                </td>`;
            row.style.transition = 'background 0.3s ease, transform 0.3s ease';
            documentTableBody.appendChild(row);
        });
        attachDocumentEventListeners();
    }

    function filterDocuments(query) {
        renderDocuments(query);
    }

    uploadDocBtn.addEventListener('click', () => {
        // Handled by file_upload_desktop.js
    });

    function attachDocumentEventListeners() {
        // Handled by file_upload_desktop.js, docusign_desktop.js, wet_signature_desktop.js
    }

    // === Form Generator ===
    formGeneratorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(formGeneratorForm);
        const formType = formData.get('formType');
        const caseId = formData.get('caseId');
        if (!cases.find(c => c.id === caseId)) {
            alert('Case not found. Please add the case first.');
            return;
        }
        const caseData = cases.find(c => c.id === caseId);
        const formContent = generateFormContent(formType, caseData);
        formPreviewContent.textContent = formContent;
        formPreview.style.display = 'block';
        formPreview.style.animation = 'fadeIn 0.6s ease-in-out';
    });

    function generateFormContent(formType, caseData) {
        let content = `=== ${formType} Form ===\nGenerated on: ${formatDate(new Date())}\n\n`;
        switch (formType) {
            case 'I-129':
                content += `Petition for Nonimmigrant Worker (H-2${caseData.visaType === 'H-2A' ? 'A' : 'B'})\nCase ID: ${caseData.id}\nClient: ${caseData.client}\nVisa Type: ${caseData.visaType}\nStatus: ${caseData.status}\n\nSection 1: Petitioner Information\nName: Kershaw Law Firm P.C.\nAddress: 3355 Bee Caves Rd Suite 307, Austin, TX 78746\n\nSection 2: Beneficiary Information\nName: ${caseData.client}\n\n[Additional Fields Simulated]`;
                break;
            case 'ETA-9142A':
                content += `H-2A Application for Temporary Employment Certification\nCase ID: ${caseData.id}\nClient: ${caseData.client}\nStatus: ${caseData.status}\n\nSection A: Employer Information\nName: ${caseData.client}\nAddress: [Client Address]\n\nSection B: Job Details\nJob Title: Agricultural Worker\nStart Date: ${caseData.deadline}\n\n[Additional Fields Simulated]`;
                break;
            case 'ETA-9142B':
                content += `H-2B Application for Temporary Employment Certification\nCase ID: ${caseData.id}\nClient: ${caseData.client}\nStatus: ${caseData.status}\n\nSection A: Employer Information\nName: ${caseData.client}\nAddress: [Client Address]\n\nSection B: Job Details\nJob Title: Non-Agricultural Worker\nStart Date: ${caseData.deadline}\n\n[Additional Fields Simulated]`;
                break;
            default:
                content += 'Unknown form type.';
        }
        return content;
    }

    downloadFormBtn.addEventListener('click', () => {
        alert('Simulated PDF download for generated form.');
    });

    // === Calendar ===
    function renderCalendar(date) {
        calendarDays.innerHTML = '';
        const month = date.getMonth();
        const year = date.getFullYear();
        monthYear.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date(2025, 3, 9);

        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day';
            calendarDays.appendChild(emptyDay);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const dayEvents = events.filter(e => {
                const eventDate = new Date(e.date);
                return eventDate.getDate() === day && eventDate.getMonth() === month && eventDate.getFullYear() === year;
            });
            const dayDiv = document.createElement('div');
            dayDiv.className = `calendar-day ${isToday ? 'current-day' : ''}`;
            dayDiv.innerHTML = `<span class="day-number">${day}</span>`;
            if (dayEvents.length > 0) {
                const eventsDiv = document.createElement('div');
                eventsDiv.className = 'event-indicators';
                dayEvents.forEach(e => {
                    const dot = document.createElement('div');
                    dot.className = `event-dot type-${e.type}`;
                    dot.title = e.title;
                    eventsDiv.appendChild(dot);
                });
                dayDiv.appendChild(eventsDiv);
            }
            dayDiv.style.transition = 'background 0.3s ease, transform 0.3s ease';
            dayDiv.addEventListener('click', () => {
                if (dayEvents.length > 0) {
                    const eventList = dayEvents.map(e => `${e.title} (${e.type}) - ${e.description}`).join('\n');
                    alert(`Events for ${formatDate(new Date(year, month, day))}:\n\n${eventList}`);
                }
            });
            calendarDays.appendChild(dayDiv);
        }
    }

    let currentDate = new Date(2025, 3, 9);
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    todayBtn.addEventListener('click', () => {
        currentDate = new Date(2025, 3, 9);
        renderCalendar(currentDate);
    });

    addEventBtn.addEventListener('click', () => {
        const date = prompt('Enter event date (YYYY-MM-DD):');
        const title = prompt('Enter event title:');
        const caseId = prompt('Enter related case ID (optional):');
        const type = prompt('Enter event type (deadline/meeting/other):');
        if (date && title) {
            const newEvent = { 
                id: generateId('E'), 
                date, 
                title, 
                caseId: caseId || 'N/A', 
                type: type || 'other', 
                description: '' 
            };
            events.push(newEvent);
            window.api.addEvent(newEvent); // Assuming API supports events
            renderCalendar(currentDate);
            window.triggerNotification(`Event "${title}" added`);
        }
    });

    // === Task Management ===
    async function renderTasks(filter = '') {
        tasks = await window.api.getTasks() || [];
        taskTableBody.innerHTML = '';
        const filteredTasks = tasks.filter(t => 
            t.task.toLowerCase().includes(filter) || 
            t.caseId.toLowerCase().includes(filter) || 
            t.status.toLowerCase().includes(filter)
        );
        filteredTasks.forEach(task => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${task.task}</td>
                <td>${task.caseId}</td>
                <td>${task.dueDate}</td>
                <td>${task.status}</td>
                <td>
                    <button class="button small secondary complete-task" data-id="${task.id}" ${task.status === 'Completed' ? 'disabled' : ''}>Complete</button>
                    <button class="button small secondary edit-task" data-id="${task.id}">Edit</button>
                    <button class="button small secondary delete-task" data-id="${task.id}">Delete</button>
                </td>`;
            row.style.transition = 'background 0.3s ease, transform 0.3s ease';
            taskTableBody.appendChild(row);
        });
        attachTaskEventListeners();
    }

    function filterTasks(query) {
        renderTasks(query);
    }

    async function addTask(task) {
        await window.api.addTask(task); // Assuming API supports tasks
        tasks = await window.api.getTasks();
        renderTasks();
        window.triggerNotification(`Task "${task.task}" added`);
    }

    async function completeTask(id) {
        const index = tasks.findIndex(t => t.id === id);
        if (index !== -1 && tasks[index].status !== 'Completed') {
            tasks[index].status = 'Completed';
            tasks[index].completed = new Date().toISOString().split('T')[0];
            await window.api.updateTask(id, tasks[index]); // Assuming API supports update
            renderTasks();
            window.triggerNotification(`Task "${tasks[index].task}" completed`);
        }
    }

    async function editTask(id, updatedTask) {
        const index = tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updatedTask };
            await window.api.updateTask(id, tasks[index]); // Assuming API supports update
            renderTasks();
            window.triggerNotification(`Task "${updatedTask.task}" updated`);
        }
    }

    async function deleteTask(id) {
        await window.api.deleteTask(id); // Assuming API supports delete
        tasks = await window.api.getTasks();
        renderTasks();
        window.triggerNotification(`Task deleted (ID: ${id})`);
    }

    function attachTaskEventListeners() {
        document.querySelectorAll('.complete-task').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                completeTask(id);
            });
        });

        document.querySelectorAll('.edit-task').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const task = tasks.find(t => t.id === id);
                const taskName = prompt('Enter task name:', task.task);
                const caseId = prompt('Enter case ID:', task.caseId);
                const dueDate = prompt('Enter due date (YYYY-MM-DD):', task.dueDate);
                if (taskName && caseId && dueDate) {
                    editTask(id, { task: taskName, caseId, dueDate });
                }
            });
        });

        document.querySelectorAll('.delete-task').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                if (confirm('Are you sure you want to delete this task?')) {
                    deleteTask(id);
                }
            });
        });
    }

    addTaskBtn.addEventListener('click', () => {
        const taskName = prompt('Enter task name:');
        const caseId = prompt('Enter case ID:');
        if (!cases.find(c => c.id === caseId)) {
            alert('Case not found. Please add the case first.');
            return;
        }
        const dueDate = prompt('Enter due date (YYYY-MM-DD):');
        if (taskName && caseId && dueDate) {
            const newTask = { 
                id: generateId('T'), 
                task: taskName, 
                caseId, 
                dueDate, 
                status: 'Pending', 
                assignedTo: 'Eleanor Vance', 
                priority: 'Medium', 
                created: new Date().toISOString().split('T')[0], 
                completed: null 
            };
            addTask(newTask);
        }
    });

    // === Report Generator ===
    reportGeneratorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(reportGeneratorForm);
        const reportType = formData.get('reportType');
        const reportContent = generateReportContent(reportType);
        reportPreviewContent.textContent = reportContent;
        reportPreview.style.display = 'block';
        reportPreview.style.animation = 'fadeIn 0.6s ease-in-out';
    });

    function generateReportContent(reportType) {
        let content = `=== ${reportType} Report ===\nGenerated on: ${formatDate(new Date())}\n\n`;
        switch (reportType) {
            case 'case-status':
                content += 'Case Status Summary\n\n';
                const statusCount = cases.reduce((acc, c) => {
                    acc[c.status] = (acc[c.status] || 0) + 1;
                    return acc;
                }, {});
                for (const [status, count] of Object.entries(statusCount)) {
                    content += `${status}: ${count} cases\n`;
                }
                content += '\nDetailed List:\n';
                cases.forEach(c => {
                    content += `${c.id} - ${c.client} (${c.visaType}): ${c.status} (Deadline: ${c.deadline})\n`;
                });
                break;
            case 'processing-times':
                content += 'Processing Times Report\n\n';
                cases.forEach(c => {
                    const created = new Date(c.created);
                    const updated = new Date(c.updated);
                    const days = Math.round((updated - created) / (1000 * 60 * 60 * 24));
                    content += `${c.id} - ${c.client} (${c.visaType}): ${days} days (Created: ${c.created}, Updated: ${c.updated})\n`;
                });
                break;
            case 'approval-rates':
                content += 'Approval Rates Report\n\n';
                const total = cases.length;
                const approved = cases.filter(c => c.status === 'Approved').length;
                const rate = total > 0 ? (approved / total * 100).toFixed(2) : 0;
                content += `Total Cases: ${total}\nApproved Cases: ${approved}\nApproval Rate: ${rate}%\n`;
                break;
            default:
                content += 'Unknown report type.';
        }
        return content;
    }

    downloadReportBtn.addEventListener('click', () => {
        alert('Simulated PDF download for generated report.');
    });

    // === AI Assistant ===
    aiChatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = aiChatInput.value.trim();
        if (!message) return;
        const userMessage = `<p><strong>You:</strong> ${message}</p>`;
        aiChatMessages.innerHTML += userMessage;
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
        aiHistory.push({ role: 'user', content: message, timestamp: new Date().toISOString() });
        window.api.addAIHistory(aiHistory); // Assuming API supports AI history
        
        setTimeout(() => {
            const aiResponse = generateAIResponse(message);
            const aiMessage = `<p><strong>AI:</strong> ${aiResponse}</p>`;
            aiChatMessages.innerHTML += aiMessage;
            aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
            aiHistory.push({ role: 'ai', content: aiResponse, timestamp: new Date().toISOString() });
            window.api.addAIHistory(aiHistory);
        }, 800);
        
        aiChatInput.value = '';
    });

    function generateAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('h-2a') || lowerMessage.includes('h2a')) {
            return 'As of April 9, 2025, H-2A visas are for temporary agricultural workers. Key steps include filing Form ETA-9142A with the DOL and Form I-129 with USCIS. How can I assist with your H-2A case?';
        } else if (lowerMessage.includes('h-2b') || lowerMessage.includes('h2b')) {
            return 'As of April 9, 2025, H-2B visas are for temporary non-agricultural workers. The process involves Form ETA-9142B and Form I-129. Need help with an H-2B case or form?';
        } else if (lowerMessage.includes('form') || lowerMessage.includes('generate')) {
            return 'I can help generate forms like I-129, ETA-9142A, or ETA-9142B. Please specify the form type and case ID, or use the Form Generator section.';
        } else if (lowerMessage.includes('status') || lowerMessage.includes('case')) {
            return 'Provide a case ID (e.g., H2A-015), and I’ll give you a simulated status update based on current data. Alternatively, check the Case Management section.';
        } else if (lowerMessage.includes('deadline') || lowerMessage.includes('due')) {
            return 'Ask about a specific case or date, and I’ll check deadlines from the calendar. For example, "What’s due on April 15, 2025?"';
        } else {
            return 'I’m your Kershaw Law Visa Assistant AI, here to help with H-2A/H-2B visas as of April 9, 2025. Ask me about cases, forms, deadlines, or anything else!';
        }
    }

    aiHistoryBtn.addEventListener('click', () => {
        const historyText = aiHistory.map(h => `${h.timestamp} [${h.role.toUpperCase()}]: ${h.content}`).join('\n');
        alert(`AI Chat History:\n\n${historyText || 'No history yet.'}`);
    });

    // === Settings ===
    settingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(settingsForm);
        settings.notificationPref = formData.get('notificationPref');
        await window.api.updateSettings(settings); // Assuming API supports settings
        alert('Settings saved successfully (Simulated).');
        window.triggerNotification('Settings updated');
    });

    saveSettingsBtn.addEventListener('click', () => {
        settingsForm.dispatchEvent(new Event('submit'));
    });

    // === Additional Features ===
    async function autoSave() {
        if (settings.autoSave) {
            console.log('Auto-saving data via API (Simulated backend).');
            // Data is already saved via API calls in add/edit/delete functions
        }
    }

    setInterval(autoSave, 30000); // Auto-save every 30 seconds

    // === Keyboard Shortcuts ===
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            autoSave();
            alert('Data saved manually (Simulated).');
        }
        if (e.altKey && e.key === 'n') {
            e.preventDefault();
            switchSection('overview-content', 'Dashboard Overview');
        }
        if (e.altKey && e.key === 'c') {
            e.preventDefault();
            switchSection('clients-content', 'Client Management');
        }
    });

    // === Theme Toggle (Simulated) ===
    function toggleTheme() {
        settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
        alert(`Theme switched to ${settings.theme} (Simulated - CSS not implemented).`);
        window.api.updateSettings(settings);
    }

    // === Voice Command Simulation ===
    if (settings.aiVoice) {
        console.log('Voice commands enabled (Simulated). Say "Add Client" to trigger.');
        setTimeout(() => {
            const simulatedVoice = 'Add Client';
            if (simulatedVoice.toLowerCase() === 'add client') {
                addClientBtn.click();
            }
        }, 5000);
    }

    // === Dashboard Stats ===
    async function updateDashboardStats() {
        cases = await window.api.getCases();
        tasks = await window.api.getTasks() || [];
        documents = await window.api.getDocuments();
        const activeCases = cases.filter(c => c.status !== 'Completed' && c.status !== 'Denied').length;
        const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
        const upcomingDeadlines = events.filter(e => new Date(e.date) > new Date()).length;
        const docsPending = documents.filter(d => d.status === 'Pending Review').length;
        
        document.querySelector('.widget[data-link-target="cases-content"] .widget-data').textContent = activeCases;
        document.querySelector('.widget[data-link-target="tasks-content"] .widget-data').textContent = pendingTasks;
        document.querySelector('.widget[data-link-target="calendar-content"] .widget-data').textContent = upcomingDeadlines;
        document.querySelector('.widget[data-link-target="documents-content"] .widget-data').textContent = docsPending;
    }

    setInterval(updateDashboardStats, 60000); // Update every minute
    updateDashboardStats();

    // === End of Script ===
    console.log('Kershaw Law Firm Dashboard Initialized with API Integration - Ready to Wow!');
});
