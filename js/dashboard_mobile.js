document.addEventListener('DOMContentLoaded', () => {
    // Element Selectors
    const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const mainContentTitle = document.getElementById('main-content-title');
    const currentYear = document.getElementById('current-year');
    const loadingOverlay = document.getElementById('loading-overlay');

    // Initial Setup
    currentYear.textContent = new Date().getFullYear();

    // Navigation Handler
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            const title = link.getAttribute('data-title');
            switchSection(targetId, title);
        });
    });

    function switchSection(targetId, title) {
        loadingOverlay.classList.add('is-active');
        contentSections.forEach(section => {
            section.classList.remove('is-active');
            section.classList.add('is-exiting');
        });
        setTimeout(() => {
            contentSections.forEach(section => {
                section.classList.remove('is-exiting');
                if (section.id === targetId) {
                    section.classList.add('is-active');
                    mainContentTitle.textContent = title;
                }
            });
            loadingOverlay.classList.remove('is-active');
        }, 300);
    }

    // Client Management
    const addClientBtn = document.getElementById('add-client-btn');
    const clientTableBody = document.getElementById('client-table-body');
    addClientBtn.addEventListener('click', () => {
        const newClient = { name: 'New Client', email: 'new@example.com', phone: '555-000-0000', cases: 'N/A' };
        addClientRow(newClient);
    });

    function addClientRow(client) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${client.name}</td><td>${client.email}</td><td>${client.phone}</td><td>${client.cases}</td><td><button class="button small secondary">View</button></td>`;
        clientTableBody.appendChild(row);
    }

    // Case Management
    const addCaseBtn = document.getElementById('add-case-btn');
    const caseTableBody = document.getElementById('case-table-body');
    addCaseBtn.addEventListener('click', () => {
        const newCase = { id: `H2A-${Math.floor(Math.random() * 1000)}`, client: 'New Client', visaType: 'H-2A', status: 'Pending', deadline: '2025-05-01' };
        addCaseRow(newCase);
    });

    function addCaseRow(caseData) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${caseData.id}</td><td>${caseData.client}</td><td>${caseData.visaType}</td><td>${caseData.status}</td><td>${caseData.deadline}</td><td><button class="button small secondary">Edit</button></td>`;
        caseTableBody.appendChild(row);
    }

    // Document Management
    const uploadDocBtn = document.getElementById('upload-doc-btn');
    const documentTableBody = document.getElementById('document-table-body');
    uploadDocBtn.addEventListener('click', () => {
        const newDoc = { fileName: 'New_Doc.pdf', client: 'New Client', caseId: 'H2B-999', uploaded: new Date().toISOString().split('T')[0], status: 'Pending Review' };
        addDocumentRow(newDoc);
    });

    function addDocumentRow(doc) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${doc.fileName}</td><td>${doc.client}</td><td>${doc.caseId}</td><td>${doc.uploaded}</td><td>${doc.status}</td><td><button class="button small secondary">Review</button></td>`;
        documentTableBody.appendChild(row);
    }

    // Form Generator
    const formGeneratorForm = document.getElementById('form-generator-form');
    const formPreview = document.getElementById('form-preview');
    const formPreviewContent = document.getElementById('form-preview-content');
    const downloadFormBtn = document.getElementById('download-form-btn');
    formGeneratorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(formGeneratorForm);
        const formType = formData.get('formType');
        const caseId = formData.get('caseId');
        formPreviewContent.textContent = `Generated ${formType} for Case ID: ${caseId}\n\n[Simulated Form Content]`;
        formPreview.style.display = 'block';
    });
    downloadFormBtn.addEventListener('click', () => alert('Simulated PDF download for form.'));

    // Calendar
    const calendarDays = document.getElementById('calendar-days');
    const monthYear = document.getElementById('month-year');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const todayBtn = document.getElementById('today-btn');
    let currentDate = new Date(2025, 3, 9); // April 9, 2025

    function renderCalendar() {
        calendarDays.innerHTML = '';
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        monthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let i = 0; i < firstDay; i++) {
            calendarDays.innerHTML += '<div class="calendar-day"></div>';
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === 9 && month === 3 && year === 2025;
            calendarDays.innerHTML += `<div class="calendar-day ${isToday ? 'current-day' : ''}"><span class="day-number">${day}</span></div>`;
        }
    }
    prevMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
    nextMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });
    todayBtn.addEventListener('click', () => { currentDate = new Date(2025, 3, 9); renderCalendar(); });
    renderCalendar();

    // Task Management
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskTableBody = document.getElementById('task-table-body');
    addTaskBtn.addEventListener('click', () => {
        const newTask = { task: 'New Task', caseId: 'H2A-999', dueDate: '2025-04-15', status: 'Pending' };
        addTaskRow(newTask);
    });

    function addTaskRow(task) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${task.task}</td><td>${task.caseId}</td><td>${task.dueDate}</td><td>${task.status}</td><td><button class="button small secondary">Complete</button></td>`;
        taskTableBody.appendChild(row);
    }

    // Report Generator
    const reportGeneratorForm = document.getElementById('report-generator-form');
    const reportPreview = document.getElementById('report-preview');
    const reportPreviewContent = document.getElementById('report-preview-content');
    const downloadReportBtn = document.getElementById('download-report-btn');
    reportGeneratorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(reportGeneratorForm);
        const reportType = formData.get('reportType');
        reportPreviewContent.textContent = `Generated ${reportType} Report\n\n[Simulated Report Data]`;
        reportPreview.style.display = 'block';
    });
    downloadReportBtn.addEventListener('click', () => alert('Simulated PDF download for report.'));

    // AI Assistant
    const aiChatForm = document.getElementById('ai-chat-form');
    const aiChatMessages = document.getElementById('ai-chat-messages');
    aiChatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = document.getElementById('ai-chat-input').value;
        aiChatMessages.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
        setTimeout(() => {
            aiChatMessages.innerHTML += `<p><strong>AI:</strong> Here's a simulated response for "${message}". For H-2A/H-2B visas, I can assist with form guidance, case status updates, or deadlines as of April 9, 2025.</p>`;
            aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
        }, 500);
        aiChatForm.reset();
    });
});
