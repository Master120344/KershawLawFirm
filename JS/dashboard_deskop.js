document.addEventListener('DOMContentLoaded', () => {

    // --- Constants ---
    const CONTENT_TRANSITION_DURATION = 400; // Match CSS --transition-content duration in ms

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
    const pageSpecificCSSLink = document.getElementById('page-specific-css'); // Get the link tag

    let isTransitioning = false;
    let currentActiveSectionId = document.querySelector('.content-section.is-active')?.id || 'overview-content';

    // --- Initial Setup ---
    setTimeout(() => { document.body.classList.remove('preload'); }, 100);
    if (currentYearSpan) { currentYearSpan.textContent = new Date().getFullYear(); }

    // --- Core Functions ---

    // Function to switch active content section with smooth transitions
    function switchContent(targetId, targetTitle = null) {
        if (isTransitioning || !targetId || targetId === currentActiveSectionId) {
            return;
        }
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

        // --- Load/Unload Page-Specific CSS --- START MODIFY
        if (pageSpecificCSSLink) {
            const docusignCSSPath = 'css/docusign_desktop.css';
            if (targetId === 'documents-content') { // Load for DocuSign section
                if (pageSpecificCSSLink.getAttribute('href') !== docusignCSSPath) {
                    pageSpecificCSSLink.setAttribute('href', docusignCSSPath);
                    console.log("Loaded docusign_desktop.css");
                }
            } else { // Unload for other sections
                if (pageSpecificCSSLink.getAttribute('href') === docusignCSSPath) {
                    pageSpecificCSSLink.setAttribute('href', ''); // Unload CSS
                    console.log("Unloaded docusign_desktop.css");
                }
            }
        }
        // --- Load/Unload Page-Specific CSS --- END MODIFY


        // 1. Trigger exit animation on the current section
        if (currentActiveSection) {
            currentActiveSection.classList.add('is-exiting');
            currentActiveSection.classList.remove('is-active');
        }

        // 2. Update Title immediately
        if (mainContentTitle) {
             const targetLink = document.querySelector(`.nav-link[data-target="${targetId}"]`);
             const linkTitle = targetLink ? targetLink.getAttribute('data-title') : null;
             mainContentTitle.textContent = targetTitle || linkTitle || "Dashboard";
        }

        // 3. Prepare the next section (starts hidden via CSS)

        // 4. After a short delay, make the next section active
        setTimeout(() => {
            if (nextSection.classList.contains('scrollable') || nextSection.id === 'calendar-content') {
                nextSection.scrollTop = 0; // Reset scroll
            }
            nextSection.classList.add('is-active');
            currentActiveSectionId = targetId;

             // Remove exiting class accurately using transitionend
             if (currentActiveSection) {
                  const handleExitEnd = () => {
                      if(currentActiveSection.classList.contains('is-exiting')) { // Double check
                           currentActiveSection.classList.remove('is-exiting');
                           currentActiveSection.removeEventListener('transitionend', handleExitEnd); // Clean up listener
                      }
                  }
                  currentActiveSection.addEventListener('transitionend', handleExitEnd);
             }

             // Hide loading overlay after the new section's transition
             setTimeout(() => {
                if (loadingOverlay) loadingOverlay.classList.remove('is-active');
                 isTransitioning = false;
             }, CONTENT_TRANSITION_DURATION);

        }, 50); // Small delay

        updateSidebarActiveState(targetId);
    }

    // Function to update active sidebar link
    function updateSidebarActiveState(targetId) {
        sidebarLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-target') === targetId);
        });
    }

    // --- Event Listeners ---
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetContentId = link.getAttribute('data-target');
            const targetTitle = link.getAttribute('data-title');
            switchContent(targetContentId, targetTitle);
        });
    });

    dropdownNavLinks.forEach(link => {
         link.addEventListener('click', (event) => {
             event.preventDefault();
             const targetContentId = link.getAttribute('data-target');
             const targetLink = document.querySelector(`.nav-link[data-target="${targetContentId}"]`);
             const targetTitle = targetLink ? targetLink.getAttribute('data-title') : null;
             switchContent(targetContentId, targetTitle);
             // Close dropdown (requires dropdown state management)
         });
    });

    overviewWidgets.forEach(widget => {
        widget.addEventListener('click', () => {
            const targetContentId = widget.getAttribute('data-link-target');
            const targetLink = document.querySelector(`.sidebar-nav .nav-link[data-target="${targetContentId}"]`);
            const targetTitle = targetLink ? targetLink.getAttribute('data-title') : null;
            if (targetContentId) {
                switchContent(targetContentId, targetTitle);
            }
        });
    });

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            console.log("Logout action triggered.");
            alert("Firebase logout logic needs implementation.");
            // ADD FIREBASE LOGOUT LOGIC HERE
        });
    }

    // ========================================================================
    // Calendar Component Logic (Ensure it's complete and correct)
    // ========================================================================
    const calendarDaysContainer = document.getElementById('calendar-days');
    const monthYearDisplay = document.getElementById('month-year');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const todayBtn = document.getElementById('today-btn');
    let calendarCurrentDate = new Date(); // Separate state for calendar

    function renderCalendar(dateToShow) { /* ... Full renderCalendar function ... */
        if (!calendarDaysContainer || !monthYearDisplay) { return; } const year = dateToShow.getFullYear(); const month = dateToShow.getMonth(); const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"]; monthYearDisplay.textContent = `${monthNames[month]} ${year}`; const firstDayOfMonth = new Date(year, month, 1); const lastDayOfMonth = new Date(year, month + 1, 0); const lastDayOfPrevMonth = new Date(year, month, 0); const firstDayWeekday = firstDayOfMonth.getDay(); const lastDateOfMonth = lastDayOfMonth.getDate(); const lastDateOfPrevMonth = lastDayOfPrevMonth.getDate(); calendarDaysContainer.innerHTML = ''; for (let i = firstDayWeekday; i > 0; i--) { calendarDaysContainer.appendChild(createDayElement(lastDateOfPrevMonth - i + 1, false, true)); } const today = new Date(); const todayDate = today.getDate(); const todayMonth = today.getMonth(); const todayYear = today.getFullYear(); for (let i = 1; i <= lastDateOfMonth; i++) { const isCurrentDay = (i === todayDate && month === todayMonth && year === todayYear); const dayElement = createDayElement(i, true, false, isCurrentDay); dayElement.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`; calendarDaysContainer.appendChild(dayElement); if (Math.random() < 0.3) { addEventIndicators(dayElement); } } const totalDaysRendered = firstDayWeekday + lastDateOfMonth; const daysInGrid = totalDaysRendered <= 35 ? 35 : 42; const nextMonthDaysNeeded = daysInGrid - totalDaysRendered; for (let i = 1; i <= nextMonthDaysNeeded; i++) { calendarDaysContainer.appendChild(createDayElement(i, false, true)); }
    }
    function createDayElement(day, isCurrentMonth, isOtherMonth, isCurrentDay = false) { /* ... Full createDayElement function ... */
        const dayElement = document.createElement('div'); dayElement.classList.add('calendar-day'); const dayNumberSpan = document.createElement('span'); dayNumberSpan.classList.add('day-number'); dayNumberSpan.textContent = day; dayElement.appendChild(dayNumberSpan); if (isOtherMonth) { dayElement.classList.add('other-month'); } if (isCurrentDay) { dayElement.classList.add('current-day'); } const eventIndicatorsDiv = document.createElement('div'); eventIndicatorsDiv.classList.add('event-indicators'); dayElement.appendChild(eventIndicatorsDiv); return dayElement;
    }
    function addEventIndicators(dayElement) { /* ... Full addEventIndicators placeholder function ... */
        const indicatorsContainer = dayElement.querySelector('.event-indicators'); if (!indicatorsContainer) return; const eventTypes = ['deadline', 'meeting', 'filing', 'other']; const numEvents = Math.floor(Math.random() * 4); for (let i = 0; i < numEvents; i++) { const dot = document.createElement('span'); dot.classList.add('event-dot'); const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)]; dot.classList.add(`type-${randomType}`); dot.title = `Event Type: ${randomType}`; indicatorsContainer.appendChild(dot); }
    }
    if (prevMonthBtn) { prevMonthBtn.addEventListener('click', () => { calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() - 1); renderCalendar(calendarCurrentDate); }); }
    if (nextMonthBtn) { nextMonthBtn.addEventListener('click', () => { calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + 1); renderCalendar(calendarCurrentDate); }); }
    if (todayBtn) { todayBtn.addEventListener('click', () => { if(calendarCurrentDate.getMonth() !== new Date().getMonth() || calendarCurrentDate.getFullYear() !== new Date().getFullYear()) { calendarCurrentDate = new Date(); renderCalendar(calendarCurrentDate); } }); } // Avoid re-render if already on current month
    if (calendarDaysContainer) { calendarDaysContainer.addEventListener('click', (event) => { const targetDay = event.target.closest('.calendar-day'); if (targetDay && !targetDay.classList.contains('other-month')) { const dateStr = targetDay.dataset.date; console.log("Clicked on date:", dateStr); calendarDaysContainer.querySelectorAll('.selected-day').forEach(el => el.classList.remove('selected-day')); targetDay.classList.add('selected-day'); } }); }
    // Use MutationObserver to render calendar only when its section is active
    const calendarSection = document.getElementById('calendar-content');
    if (calendarSection) {
        const calendarObserver = new MutationObserver((mutationsList) => {
            for(let mutation of mutationsList) {
                 if (mutation.type === 'attributes' && mutation.attributeName === 'class' && mutation.target.id === 'calendar-content') {
                     if(mutation.target.classList.contains('is-active')) {
                          console.log("Rendering calendar as section became active.");
                          renderCalendar(calendarCurrentDate);
                     }
                 }
            }
        });
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
        // If initial active section requires specific CSS or JS logic, trigger it here
        if (currentActiveSectionId === 'documents-content' && pageSpecificCSSLink) {
             pageSpecificCSSLink.setAttribute('href', 'css/docusign_desktop.css');
             console.log("Loaded docusign_desktop.css on initial load.");
        }
        if(currentActiveSectionId === 'calendar-content') {
            renderCalendar(calendarCurrentDate); // Initial render if calendar is default
        }
    } else {
        // Fallback if no section is marked active in HTML - activate overview
         switchContent('overview-content', 'Dashboard Overview'); // Use switchContent to handle CSS loading etc.
    }

    console.log("Enhanced Dashboard V2.2 Initialized.");

}); // End DOMContentLoaded