document.addEventListener('DOMContentLoaded', () => {
    const clientList = document.getElementById('client-list');
    const addClientBtn = document.getElementById('add-client-btn');
    const notificationCount = document.getElementById('notification-count');
    const clientSearch = document.getElementById('client-search');
    const clientDetailsModal = document.getElementById('client-details-modal');
    const modalClientName = document.getElementById('modal-client-name');
    const modalClientVisa = document.getElementById('modal-client-visa');
    const modalClientEmail = document.getElementById('modal-client-email');
    const modalClientPhone = document.getElementById('modal-client-phone');
    const modalClientTasks = document.getElementById('modal-client-tasks');
    const modalClientDocuments = document.getElementById('modal-client-documents');
    const modalClientContacts = document.getElementById('modal-client-contacts');
    const activeClientsWidget = document.getElementById('active-clients');
    const contactsList = document.getElementById('contacts-list');
    let clients = JSON.parse(localStorage.getItem('clients')) || [];

    const clientFormHTML = `
        <div class="client-form" id="client-form">
            <h3>Add New Client</h3>
            <div class="form-group">
                <label for="client-name" class="form-label">Name</label>
                <input type="text" id="client-name" class="form-control" placeholder="e.g., John Doe" required>
            </div>
            <div class="form-group">
                <label for="client-visa" class="form-label">Visa Type</label>
                <select id="client-visa" class="form-control" required>
                    <option value="H-2A">H-2A (Agricultural)</option>
                    <option value="H-2B">H-2B (Non-Agricultural)</option>
                </select>
            </div>
            <div class="form-group">
                <label for="client-email" class="form-label">Email</label>
                <input type="email" id="client-email" class="form-control" placeholder="e.g., john@example.com" required>
            </div>
            <div class="form-group">
                <label for="client-phone" class="form-label">Phone (Optional)</label>
                <input type="tel" id="client-phone" class="form-control" placeholder="e.g., 555-123-4567">
            </div>
            <div class="form-group">
                <label for="client-contact-name" class="form-label">Contact Name (Optional)</label>
                <input type="text" id="client-contact-name" class="form-control" placeholder="e.g., Employer Name">
            </div>
            <div class="form-group">
                <label for="client-contact-email" class="form-label">Contact Email (Optional)</label>
                <input type="email" id="client-contact-email" class="form-control" placeholder="e.g., employer@example.com">
            </div>
            <div class="form-group">
                <label for="client-contact-address" class="form-label">Contact Address (Optional)</label>
                <input type="text" id="client-contact-address" class="form-control" placeholder="e.g., 123 Main St, City, State">
            </div>
            <div class="form-group">
                <label for="client-contact-phone" class="form-label">Contact Phone (Optional)</label>
                <input type="tel" id="client-contact-phone" class="form-control" placeholder="e.g., 555-987-6543">
            </div>
            <div class="form-group">
                <label for="client-contact-role" class="form-label">Contact Role (Optional)</label>
                <select id="client-contact-role" class="form-control">
                    <option value="Employer">Employer</option>
                    <option value="Agent">Agent</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="form-actions">
                <button class="button primary" id="save-client-btn">Save Client</button>
                <button class="button secondary" id="cancel-client-btn">Cancel</button>
            </div>
        </div>
    `;

    function updateClientList() {
        clientList.innerHTML = '';
        clients.sort((a, b) => a.name.localeCompare(b.name));
        clients.forEach(client => {
            const clientItem = document.createElement('div');
            clientItem.classList.add('client-item');
            clientItem.setAttribute('data-client-id', client.id);
            clientItem.innerHTML = `
                <strong>${client.name}</strong> - ${client.visaType} <br> 
                ${client.email} ${client.phone ? `<br> ${client.phone}` : ''} 
                <button class="icon-button subtle client-task-btn" data-client-id="${client.id}" title="Add Task">✅</button>
                <button class="icon-button subtle client-details-btn" data-client-id="${client.id}" title="View Details">👁️</button>
            `;
            clientList.appendChild(clientItem);
        });
        localStorage.setItem('clients', JSON.stringify(clients));
        updateDashboardStats();
        updateClientDropdowns();
        updateContactsList();
    }

    function updateClientDropdowns() {
        const taskClientSelect = document.getElementById('task-client');
        const docClientSelect = document.getElementById('doc-client');
        const quickTaskClientSelect = document.getElementById('quick-task-client');
        const deadlineClientSelect = document.getElementById('deadline-client');

        const updateDropdown = (select) => {
            if (select) {
                select.innerHTML = '<option value="">No Client</option>';
                clients.forEach(client => {
                    const option = document.createElement('option');
                    option.value = client.name;
                    option.textContent = `${client.name} (${client.visaType})`;
                    select.appendChild(option);
                });
            }
        };

        updateDropdown(taskClientSelect);
        updateDropdown(docClientSelect);
        updateDropdown(quickTaskClientSelect);
        updateDropdown(deadlineClientSelect);
    }

    function updateContactsList() {
        if (contactsList) {
            contactsList.innerHTML = '';
            clients.forEach(client => {
                if (client.contacts && client.contacts.length > 0) {
                    client.contacts.forEach(contact => {
                        const contactItem = document.createElement('div');
                        contactItem.classList.add('contact-item');
                        contactItem.innerHTML = `
                            <div class="contact-card">
                                <h4>${contact.name}</h4>
                                <p><strong>Role:</strong> ${contact.role}</p>
                                <p><strong>Email:</strong> ${contact.email}</p>
                                <p><strong>Phone:</strong> ${contact.phone || 'N/A'}</p>
                                <p><strong>Address:</strong> ${contact.address || 'N/A'}</p>
                                <p><strong>Client:</strong> ${client.name}</p>
                            </div>
                        `;
                        contactsList.appendChild(contactItem);
                    });
                }
            });
        }
    }

    function updateDashboardStats() {
        if (activeClientsWidget) {
            activeClientsWidget.textContent = clients.length;
            activeClientsWidget.parentElement.addEventListener('click', () => {
                const clientSummary = clients.map(client => `${client.name} (${client.visaType}) - Contacts: ${client.contacts ? client.contacts.length : 0}`).join('\n') || 'No clients yet.';
                alert(`Active Clients:\n${clientSummary}`);
            });
        }

        const totalContacts = document.getElementById('total-contacts');
        if (totalContacts) {
            const contactCount = clients.reduce((sum, client) => sum + (client.contacts ? client.contacts.length : 0), 0);
            totalContacts.textContent = contactCount;
        }
    }

    function updateNotification(message) {
        const currentCount = parseInt(notificationCount.textContent) || 0;
        notificationCount.textContent = currentCount + 1;
        window.dispatchEvent(new CustomEvent('notificationAdded', { detail: { message } }));
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

    function addClient(clientData) {
        const newClient = {
            id: Date.now(),
            name: clientData.name,
            visaType: clientData.visaType,
            email: clientData.email,
            phone: clientData.phone || 'N/A',
            tasks: [],
            documents: [],
            contacts: clientData.contactName && clientData.contactEmail ? [{
                id: Date.now(),
                name: clientData.contactName,
                email: clientData.contactEmail,
                address: clientData.contactAddress || '',
                phone: clientData.contactPhone || '',
                role: clientData.contactRole || 'Employer'
            }] : []
        };
        clients.push(newClient);
        updateClientList();
        updateNotification(`New Client Added: ${newClient.name}`);
        showClippy(`Added ${newClient.name}! Want to create a task or document for them?`);
        return newClient;
    }

    function showClientForm() {
        if (document.getElementById('client-form')) return;
        clientList.insertAdjacentHTML('beforeend', clientFormHTML);
        const form = document.getElementById('client-form');
        const saveBtn = document.getElementById('save-client-btn');
        const cancelBtn = document.getElementById('cancel-client-btn');

        saveBtn.addEventListener('click', () => {
            const name = document.getElementById('client-name').value.trim();
            const visaType = document.getElementById('client-visa').value;
            const email = document.getElementById('client-email').value.trim();
            const phone = document.getElementById('client-phone').value.trim();
            const contactName = document.getElementById('client-contact-name').value.trim();
            const contactEmail = document.getElementById('client-contact-email').value.trim();
            const contactAddress = document.getElementById('client-contact-address').value.trim();
            const contactPhone = document.getElementById('client-contact-phone').value.trim();
            const contactRole = document.getElementById('client-contact-role').value;

            if (name && email) {
                const clientData = { name, visaType, email, phone, contactName, contactEmail, contactAddress, contactPhone, contactRole };
                addClient(clientData);
                form.remove();
            } else {
                alert('Please fill in Name and Email.');
            }
        });

        cancelBtn.addEventListener('click', () => form.remove());
    }

    function showClientDetails(clientId) {
        const client = clients.find(c => c.id === parseInt(clientId));
        if (client) {
            modalClientName.textContent = client.name;
            modalClientVisa.textContent = client.visaType;
            modalClientEmail.textContent = client.email;
            modalClientPhone.textContent = client.phone;

            modalClientTasks.innerHTML = client.tasks.length > 0
                ? client.tasks.map(task => `<li>${task.title} (Due: ${task.dueDate})</li>`).join('')
                : '<li>No tasks assigned.</li>';

            modalClientDocuments.innerHTML = client.documents.length > 0
                ? client.documents.map(doc => `<li>${doc.type} (Status: ${doc.status})</li>`).join('')
                : '<li>No documents assigned.</li>';

            modalClientContacts.innerHTML = client.contacts && client.contacts.length > 0
                ? client.contacts.map(contact => `
                    <li class="contact-card">
                        <strong>${contact.name}</strong> (${contact.role}) <br>
                        Email: ${contact.email} <br>
                        Phone: ${contact.phone || 'N/A'} <br>
                        Address: ${contact.address || 'N/A'}
                    </li>
                `).join('')
                : '<li>No contacts assigned.</li>';

            const modal = document.getElementById('client-details-modal');
            modal.style.display = 'block';
            setTimeout(() => modal.classList.add('is-active'), 50);
        }
    }

    function addTaskForClient(clientId, taskTitle, dueDate) {
        const client = clients.find(c => c.id === clientId);
        if (client) {
            const task = { id: Date.now(), title: taskTitle, dueDate, status: 'pending' };
            client.tasks.push(task);
            localStorage.setItem('clients', JSON.stringify(clients));
            updateNotification(`Task Added for ${client.name}: ${taskTitle}`);
            showClippy(`Task "${taskTitle}" added for ${client.name}!`);
            updateTaskList(task);
            window.dispatchEvent(new CustomEvent('clientTaskAdded', { detail: { taskTitle, dueDate, clientId } }));
        }
    }

    function addDocumentForClient(clientId, docData) {
        const client = clients.find(c => c.id === clientId);
        if (client) {
            client.documents.push(docData);
            localStorage.setItem('clients', JSON.stringify(clients));
            updateNotification(`Document Added for ${client.name}: ${docData.type}`);
            showClippy(`Document "${docData.type}" added for ${client.name}!`);
        }
    }

    function updateTaskList(task) {
        const taskList = document.getElementById('task-list');
        if (taskList) {
            const taskItem = document.createElement('div');
            taskItem.classList.add('task-item');
            taskItem.innerHTML = `<strong>${task.title}</strong> <br> Due: ${task.dueDate}`;
            taskList.appendChild(taskItem);
        }
    }

    addClientBtn.addEventListener('click', showClientForm);

    clientList.addEventListener('click', (e) => {
        if (e.target.classList.contains('client-task-btn')) {
            const clientId = parseInt(e.target.getAttribute('data-client-id'));
            const taskTitle = prompt('Enter task title (e.g., "Prepare LCA"):');
            const dueDate = prompt('Enter due date (e.g., "April 10, 2025"):');
            if (taskTitle && dueDate) {
                addTaskForClient(clientId, taskTitle, dueDate);
            }
        } else if (e.target.classList.contains('client-details-btn')) {
            const clientId = e.target.getAttribute('data-client-id');
            showClientDetails(clientId);
        }
    });

    clientSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const clientItems = clientList.querySelectorAll('.client-item');
        clientItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    });

    window.addEventListener('aiCommandProcessed', (e) => {
        const command = e.detail.command.toLowerCase();
        if (command.includes('add client') && command.includes('@')) {
            const clientData = parseClientDataFromAI(command);
            addClient(clientData);
        }
    });

    window.addEventListener('documentSent', (e) => {
        const { clientName, type } = e.detail;
        const client = clients.find(c => c.name === clientName);
        if (client) {
            addDocumentForClient(client.id, { type, status: 'sent' });
        }
    });

    function parseClientDataFromAI(command) {
        const parts = command.split(' ');
        return {
            name: parts.slice(parts.indexOf('client') + 1, parts.indexOf('h-2')).join(' '),
            visaType: parts.find(p => p.match(/h-2[ab]/i)) || 'H-2A',
            email: parts.find(p => p.includes('@')) || 'unknown@example.com',
            phone: parts.find(p => p.match(/\d{3}-\d{3}-\d{4}/)) || '',
            contactName: '',
            contactEmail: '',
            contactAddress: '',
            contactPhone: '',
            contactRole: ''
        };
    }

    updateClientList();
});