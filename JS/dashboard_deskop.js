document.addEventListener('DOMContentLoaded', () => {

    // --- Constants ---
    const CONTENT_TRANSITION_DURATION = 450; // Match CSS --transition-content (adjusted to 0.45s)

    // --- Element Selectors ---
    const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const contentSections = document.querySelectorAll('.main-content .content-section');
    const mainContentArea = document.getElementById('main-content-area');
    const mainContentTitle = document.getElementById('main-content-title');
    const currentYearSpan = document.getElementById('current-year');
    const logoutButton = document.getElementById('logout-button-dropdown');
    const profileMenuContainer = document.querySelector('.profile-menu-container');
    const dropdownNavLinks = document.querySelectorAll('.profile-dropdown .nav-link-trigger');
    const overviewWidgets = document.querySelectorAll('#overview-content .widget.clickable');
    const loadingOverlay = document.getElementById('loading-overlay');
    const pageSpecificCSSLink = document.getElementById('page-specific-css');

    let isTransitioning = false;
    let currentActiveSectionId = document.querySelector('.content-section.is-active')?.id || 'overview-content';

    // --- Initial Setup ---
    setTimeout(() => { document.body.classList.remove('preload'); }, 150); // Slightly longer delay
    if (currentYearSpan) { currentYearSpan.textContent = new Date().getFullYear(); }

    // --- Core Functions ---
    function switchContent(targetId, targetTitle = null) {
        if (isTransitioning || !targetId || targetId === currentActiveSectionId) { return; }
        isTransitioning = true;
        if (loadingOverlay) loadingOverlay.classList.add('is-active');

        const currentActiveSection = document.getElementById(currentActiveSectionId);
        const nextSection = document.getElementById(targetId);

        if (!nextSection) {
            console.error(`Target section #${targetId} not found.`);
            isTransitioning = false;
            if (loadingOverlay) loadingOverlay.classList.remove('is-active');
            return;
        }

        // --- Load/Unload Page-Specific CSS ---
        if (pageSpecificCSSLink) {
            const docusignCSSPath = 'css/docusign_desktop.css';
            if (targetId === 'documents-content') {
                if (pageSpecificCSSLink.getAttribute('href') !== docusignCSSPath) {
                    pageSpecificCSSLink.setAttribute('href', docusignCSSPath);
                }
            } else {
                if (pageSpecificCSSLink.getAttribute('href') === docusignCSSPath) {
                    pageSpecificCSSLink.setAttribute('href', '');
                }
            }
        }

        // 1. Trigger exit animation
        if (currentActiveSection) {
            currentActiveSection.classList.add('is-exiting');
            currentActiveSection.classList.remove('is-active');
        }

        // 2. Update Title
        if (mainContentTitle) {
             const targetLink = document.querySelector(`.nav-link[data-target="${targetId}"]`);
             const linkTitle = targetLink ? targetLink.getAttribute('data-title') : null;
             mainContentTitle.textContent = targetTitle || linkTitle || "Dashboard";
        }

        // 3. Make next section active after slight delay
        setTimeout(() => {
            if (nextSection) { // Ensure nextSection still exists
                nextSection.scrollTop = 0; // Reset scroll
                nextSection.classList.add('is-active');
                currentActiveSectionId = targetId;
            }

             // Remove exiting class accurately using transitionend
             if (currentActiveSection) {
                  const handleExitEnd = (event) => {
                      // Prevent event bubbling from inner elements
                      if (event.target === currentActiveSection && currentActiveSection.classList.contains('is-exiting')) {
                           currentActiveSection.classList.remove('is-exiting');
                           // Clean up: remove listener after it fires
                           // currentActiveSection.removeEventListener('transitionend', handleExitEnd); // Be careful with removal if multiple transitions exist
                      }
                  }
                  // Listen for the transition on the current section to end
                  currentActiveSection.addEventListener('transitionend', handleExitEnd, { once: true }); // Use once for cleaner removal
             }

             // Hide loading overlay after the new section's transition
             setTimeout(() => {
                if (loadingOverlay) loadingOverlay.classList.remove('is-active');
                 isTransitioning = false;
             }, CONTENT_TRANSITION_DURATION);

        }, 50); // Short delay for exit animation start

        updateSidebarActiveState(targetId);
    }

    function updateSidebarActiveState(targetId) {
        sidebarLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-target') === targetId);
        });
    }

    // --- Event Listeners ---
    sidebarLinks.forEach(link => { link.addEventListener('click', (event) => { event.preventDefault(); switchContent(link.getAttribute('data-target'), link.getAttribute('data-title')); }); });
    dropdownNavLinks.forEach(link => { link.addEventListener('click', (event) => { event.preventDefault(); const targetId = link.getAttribute('data-target'); const targetLink = document.querySelector(`.nav-link[data-target="${targetId}"]`); switchContent(targetId, targetLink?.getAttribute('data-title')); /* Close dropdown */ }); });
    overviewWidgets.forEach(widget => { widget.addEventListener('click', () => { const targetId = widget.getAttribute('data-link-target'); const targetLink = document.querySelector(`.sidebar-nav .nav-link[data-target="${targetId}"]`); switchContent(targetId, targetLink?.getAttribute('data-title')); }); });
    if (logoutButton) { logoutButton.addEventListener('click', () => { console.log("Logout..."); alert("Logout logic needed."); /* Add Firebase logout */ }); }

    // ========================================================================
    // Calendar Component Logic (Ensure this is complete and correct)
    // ========================================================================
    const calendarDaysContainer = document.getElementById('calendar-days');
    const monthYearDisplay = document.getElementById('month-year');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const todayBtn = document.getElementById('today-btn');
    let calendarCurrentDate = new Date();

    function renderCalendar(dateToShow) { /* ... Full renderCalendar function ... */ if (!calendarDaysContainer || !monthYearDisplay) { return; } const year = dateToShow.getFullYear(); const month = dateToShow.getMonth(); const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"]; monthYearDisplay.textContent = `${monthNames[month]} ${year}`; const firstDayOfMonth = new Date(year, month, 1); const lastDayOfMonth = new Date(year, month + 1, 0); const lastDayOfPrevMonth = new Date(year, month, 0); const firstDayWeekday = firstDayOfMonth.getDay(); const lastDateOfMonth = lastDayOfMonth.getDate(); const lastDateOfPrevMonth = lastDayOfPrevMonth.getDate(); calendarDaysContainer.innerHTML = ''; for (let i = firstDayWeekday; i > 0; i--) { calendarDaysContainer.appendChild(createDayElement(lastDateOfPrevMonth - i + 1, false, true)); } const today = new Date(); const todayDate = today.getDate(); const todayMonth = today.getMonth(); const todayYear = today.getFullYear(); for (let i = 1; i <= lastDateOfMonth; i++) { const isCurrentDay = (i === todayDate && month === todayMonth && year === todayYear); const dayElement = createDayElement(i, true, false, isCurrentDay); dayElement.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`; calendarDaysContainer.appendChild(dayElement); if (Math.random() < 0.3) { addEventIndicators(dayElement); } } const totalDaysRendered = firstDayWeekday + lastDateOfMonth; const daysInGrid = totalDaysRendered <= 35 ? 35 : 42; const nextMonthDaysNeeded = daysInGrid - totalDaysRendered; for (let i = 1; i <= nextMonthDaysNeeded; i++) { calendarDaysContainer.appendChild(createDayElement(i, false, true)); } }
    function createDayElement(day, isCurrentMonth, isOtherMonth, isCurrentDay = false) { /* ... Full createDayElement function ... */ const dayElement = document.createElement('div'); dayElement.classList.add('calendar-day'); const dayNumberSpan = document.createElement('span'); dayNumberSpan.classList.add('day-number'); dayNumberSpan.textContent = day; dayElement.appendChild(dayNumberSpan); if (isOtherMonth) { dayElement.classList.add('other-month'); } if (isCurrentDay) { dayElement.classList.add('current-day'); } const eventIndicatorsDiv = document.createElement('div'); eventIndicatorsDiv.classList.add('event-indicators'); dayElement.appendChild(eventIndicatorsDiv); return dayElement; }
    function addEventIndicators(dayElement) { /* ... Full addEventIndicators placeholder function ... */ const indicatorsContainer = dayElement.querySelector('.event-indicators'); if (!indicatorsContainer) return; const eventTypes = ['deadline', 'meeting', 'filing', 'other']; const numEvents = Math.floor(Math.random() * 4); for (let i = 0; i < numEvents; i++) { const dot = document.createElement('span'); dot.classList.add('event-dot'); const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)]; dot.classList.add(`type-${randomType}`); dot.title = `Event Type: ${randomType}`; indicatorsContainer.appendChild(dot); } }
    if (prevMonthBtn) { prevMonthBtn.addEventListener('click', () => { calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() - 1); renderCalendar(calendarCurrentDate); }); }
    if (nextMonthBtn) { nextMonthBtn.addEventListener('click', () => { calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + 1); renderCalendar(calendarCurrentDate); }); }
    if (todayBtn) { todayBtn.addEventListener('click', () => { if(calendarCurrentDate.getMonth() !== new Date().getMonth() || calendarCurrentDate.getFullYear() !== new Date().getFullYear()) { calendarCurrentDate = new Date(); renderCalendar(calendarCurrentDate); } }); }
    if (calendarDaysContainer) { calendarDaysContainer.addEventListener('click', (event) => { const targetDay = event.target.closest('.calendar-day'); if (targetDay && !targetDay.classList.contains('other-month')) { const dateStr = targetDay.dataset.date; console.log("Clicked on date:", dateStr); calendarDaysContainer.querySelectorAll('.selected-day').forEach(el => el.classList.remove('selected-day')); targetDay.classList.add('selected-day'); } }); }
    // Render calendar when its section becomes active
    const calendarSection = document.getElementById('calendar-content');
    if (calendarSection) {
        const calendarObserver = new MutationObserver((mutationsList) => { mutationsList.forEach(mutation => { if (mutation.type === 'attributes' && mutation.attributeName === 'class' && mutation.target.id === 'calendar-content' && mutation.target.classList.contains('is-active')) { console.log("Rendering calendar as section became active."); renderCalendar(calendarCurrentDate); } }); });
        calendarObserver.observe(calendarSection, { attributes: true });
    }
    // ========================================================================

    // --- Final Initialization ---
    const initialActiveSectionHTML = document.querySelector('.content-section.is-active');
    if (initialActiveSectionHTML) {
        currentActiveSectionId = initialActiveSectionHTML.id;
        const initialLink = document.querySelector(`.sidebar-nav .nav-link[data-target="${currentActiveSectionId}"]`);
        const initialTitle = initialLink ? initialLink.getAttribute('data-title') : "Dashboard";
        if (mainContentTitle) mainContentTitle.textContent = initialTitle;
        updateSidebarActiveState(currentActiveSectionId);
        if (currentActiveSectionId === 'documents-content' && pageSpecificCSSLink) { pageSpecificCSSLink.setAttribute('href', 'css/docusign_desktop.css'); }
        if(currentActiveSectionId === 'calendar-content') { renderCalendar(calendarCurrentDate); }
    } else { switchContent('overview-content', 'Dashboard Overview'); } // Fallback

    console.log("Enhanced Dashboard V2.3 (Rich BG) Initialized.");

}); // End DOMContentLoaded