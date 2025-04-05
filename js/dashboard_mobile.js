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

    currentYearSpan.textContent = new Date().getFullYear();

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    mainContentArea.addEventListener('click', (e) => {
        if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });

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
        window.dispatchEvent(new CustomEvent('notificationAdded', { detail: { message: 'User logged out' } }));
    });

    document.querySelectorAll('.nav-link, .widget.clickable, .nav-link-trigger, .icon-button, .button').forEach(el => {
        el.addEventListener('touchstart', () => {}, { passive: true });
    });

    switchContent('dashboard-content');
});