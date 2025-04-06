document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mainContentArea = document.getElementById('main-content-area');
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const mainContentTitle = document.getElementById('main-content-title');
    const breadcrumbBack = document.getElementById('breadcrumb-back');
    const logoutButtonDropdown = document.getElementById('logout-button-dropdown');
    const loadingOverlay = document.getElementById('loading-overlay');
    const currentYearSpan = document.getElementById('current-year');
    const notificationCount = document.getElementById('notification-count');

    // New elements from updated HTML
    const globalSearch = document.getElementById('global-search');
    const quickAddClientBtn = document.getElementById('quick-add-client-btn');
    const quickAddTaskBtn = document.getElementById('quick-add-task-btn');
    const clientDetailsModal = document.getElementById('client-details-modal');
    const quickAddClientModal = document.getElementById('quick-add-client-modal');
    const quickAddTaskModal = document.getElementById('quick-add-task-modal');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    const quickSaveClientBtn = document.getElementById('quick-save-client-btn');
    const quickSaveTaskBtn = document.getElementById('quick-save-task-btn');

    currentYearSpan.textContent = new Date().getFullYear();

    let navigationHistory = ['dashboard-content'];

    function showLoadingOverlay() {
        loadingOverlay.classList.add('is-active');
        setTimeout(() => loadingOverlay.classList.remove('is-active'), 500);
    }

    function switchContent(targetId) {
        const currentSection = document.querySelector('.content-section.is-active');
        const targetSection = document.getElementById(targetId);

        if (currentSection && currentSection.id !== targetId) {
            currentSection.classList.remove('is-active');
            currentSection.classList.add('is-exiting');
            setTimeout(() => currentSection.classList.remove('is-exiting'), 450);
        }

        if (targetSection) {
            targetSection.classList.add('is-active');
            showLoadingOverlay();

            const newTitle = targetSection.dataset.title || document.querySelector(`.nav-link[data-target="${targetId}"]`)?.dataset.title || 'Dashboard';
            mainContentTitle.textContent = newTitle;

            if (navigationHistory[navigationHistory.length - 1] !== targetId) {
                navigationHistory.push(targetId);
            }

            breadcrumbBack.style.display = navigationHistory.length > 1 ? 'inline-flex' : 'none';
            sidebar.classList.remove('open');
        }
    }

    function showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            setTimeout(() => modal.classList.add('is-active'), 50);
        }
    }

    function hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('is-active');
            setTimeout(() => modal.style.display = 'none', 300);
        }
    }

    function updateNotification(message) {
        const currentCount = parseInt(notificationCount.textContent) || 0;
        notificationCount.textContent = currentCount + 1;
        window.dispatchEvent(new CustomEvent('notificationAdded', { detail: { message } }));
    }

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    mainContentArea.addEventListener('click', (e) => {
        if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            switchContent(targetId);
        });
    });

    document.querySelectorAll('.nav-link-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = trigger.getAttribute('data-target');
            const correspondingNavLink = document.querySelector(`.nav-link[data-target="${targetId}"]`);
            navLinks.forEach(l => l.classList.remove('active'));
            if (correspondingNavLink) {
                correspondingNavLink.classList.add('active');
            }
            switchContent(targetId);
        });
    });

    document.querySelectorAll('.widget.clickable').forEach(widget => {
        widget.addEventListener('click', () => {
            const targetId = widget.getAttribute('data-link-target');
            const correspondingNavLink = document.querySelector(`.nav-link[data-target="${targetId}"]`);
            navLinks.forEach(l => l.classList.remove('active'));
            if (correspondingNavLink) {
                correspondingNavLink.classList.add('active');
            }
            switchContent(targetId);
        });
    });

    breadcrumbBack.addEventListener('click', () => {
        if (navigationHistory.length > 1) {
            navigationHistory.pop();
            const previousTargetId = navigationHistory[navigationHistory.length - 1];
            navLinks.forEach(l => l.classList.remove('active'));
            const previousNavLink = document.querySelector(`.nav-link[data-target="${previousTargetId}"]`);
            if (previousNavLink) {
                previousNavLink.classList.add('active');
            }
            switchContent(previousTargetId);
        }
    });

    logoutButtonDropdown.addEventListener('click', () => {
        console.log('Logout clicked');
        updateNotification('User logged out');
    });

    // Global Search Functionality
    globalSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const sections = ['clients-content', 'tasks-content', 'documents-content', 'deadlines-content'];
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            const items = section.querySelectorAll('.client-item, .task-item, .document-item, .deadline-item');
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(searchTerm) ? 'block' : 'none';
            });
        });
    });

    // Quick Add Client Modal
    quickAddClientBtn.addEventListener('click', () => {
        showModal('quick-add-client-modal');
        const clientSelect = document.getElementById('quick-task-client');
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        clientSelect.innerHTML = '<option value="">No Client</option>';
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.name;
            option.textContent = `${client.name} (${client.visaType})`;
            clientSelect.appendChild(option);
        });
    });

    quickSaveClientBtn.addEventListener('click', () => {
        const name = document.getElementById('quick-client-name').value.trim();
        const visaType = document.getElementById('quick-client-visa').value;
        const email = document.getElementById('quick-client-email').value.trim();

        if (name && email) {
            const clientData = { name, visaType, email, phone: '' };
            window.dispatchEvent(new CustomEvent('aiCommandProcessed', { detail: { command: `add client ${name} ${visaType} ${email}` } }));
            hideModal('quick-add-client-modal');
            document.getElementById('quick-client-name').value = '';
            document.getElementById('quick-client-email').value = '';
        } else {
            alert('Please fill in Name and Email.');
        }
    });

    // Quick Add Task Modal
    quickAddTaskBtn.addEventListener('click', () => {
        showModal('quick-add-task-modal');
        const clientSelect = document.getElementById('quick-task-client');
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        clientSelect.innerHTML = '<option value="">No Client</option>';
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.name;
            option.textContent = `${client.name} (${client.visaType})`;
            clientSelect.appendChild(option);
        });
    });

    quickSaveTaskBtn.addEventListener('click', () => {
        const title = document.getElementById('quick-task-title').value.trim();
        const clientName = document.getElementById('quick-task-client').value;
        const dueDate = document.getElementById('quick-task-due').value;

        if (title && dueDate) {
            const command = `task ${title}${clientName ? ` for ${clientName}` : ''} by ${dueDate}`;
            window.dispatchEvent(new CustomEvent('aiCommandProcessed', { detail: { command } }));
            hideModal('quick-add-task-modal');
            document.getElementById('quick-task-title').value = '';
            document.getElementById('quick-task-client').value = '';
            document.getElementById('quick-task-due').value = '';
        } else {
            alert('Please fill in Task Title and Due Date.');
        }
    });

    // Modal Close Buttons
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal');
            hideModal(modalId);
        });
    });

    // Handle Touch Events for Mobile
    document.querySelectorAll('.nav-link, .widget.clickable, .nav-link-trigger, .icon-button, .button').forEach(el => {
        el.addEventListener('touchstart', () => {}, { passive: true });
    });

    switchContent('dashboard-content');
});