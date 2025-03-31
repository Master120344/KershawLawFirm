document.addEventListener('DOMContentLoaded', () => {

    // --- Constants ---
    const CONTENT_TRANSITION_DURATION = 400; // Must match CSS transition duration

    // --- Element Selectors ---
    const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const contentSections = document.querySelectorAll('.main-content .content-section');
    const mainContentArea = document.getElementById('main-content-area');
    const mainContentTitle = document.getElementById('main-content-title');
    const currentYearSpan = document.getElementById('current-year');
    const logoutButton = document.getElementById('logout-button-dropdown'); // Corrected ID
    const profileMenuContainer = document.querySelector('.profile-menu-container');
    const dropdownNavLinks = document.querySelectorAll('.profile-dropdown .nav-link-trigger');
    const overviewWidgets = document.querySelectorAll('#overview-content .widget.clickable');
    const loadingOverlay = document.getElementById('loading-overlay');

    let isTransitioning = false; // Flag to prevent rapid transitions
    let currentActiveSectionId = 'overview-content'; // Track the current section

    // --- Initial Setup ---
    setTimeout(() => { document.body.classList.remove('preload'); }, 100);
    if (currentYearSpan) { currentYearSpan.textContent = new Date().getFullYear(); }

    // --- Core Functions ---

    // Function to switch active content section with smooth transitions
    function switchContent(targetId, targetTitle = null) {
        if (isTransitioning || !targetId || targetId === currentActiveSectionId) {
            console.log(`Transition skipped for ${targetId}`);
            return; // Prevent switching if already transitioning or same section
        }
        isTransitioning = true;
        console.log(`Switching to: ${targetId}`);
        if (loadingOverlay) loadingOverlay.classList.add('is-active'); // Show loading overlay

        const currentActiveSection = document.getElementById(currentActiveSectionId);
        const nextSection = document.getElementById(targetId);

        if (!nextSection) {
            console.error(`Target section #${targetId} not found.`);
            isTransitioning = false;
            if (loadingOverlay) loadingOverlay.classList.remove('is-active');
            return;
        }

        // 1. Trigger exit animation on the current section
        if (currentActiveSection) {
            currentActiveSection.classList.add('is-exiting');
            currentActiveSection.classList.remove('is-active');
        }

        // 2. Update Title immediately
        if (mainContentTitle) {
            const sectionH2 = nextSection.querySelector('h2');
            mainContentTitle.textContent = targetTitle || (sectionH2 ? sectionH2.textContent : "Dashboard");
        }

        // 3. Prepare the next section (it starts hidden via CSS: opacity 0, transform)

        // 4. After a short delay (allow exit animation to start), make the next section active
        setTimeout(() => {
            // Reset scroll position of the incoming section
             if (nextSection.classList.contains('scrollable') || nextSection.id === 'calendar-content') { // Or just apply to all?
                nextSection.scrollTop = 0;
            }

            nextSection.classList.add('is-active');

             // Update tracking variable
             currentActiveSectionId = targetId;

             // Remove exiting class from the previous section after transition ends
             if (currentActiveSection) {
                  // Use transitionend event for cleaner handling (optional but better)
                  // currentActiveSection.addEventListener('transitionend', () => {
                  //    currentActiveSection.classList.remove('is-exiting');
                  // }, { once: true });
                  // Or simply remove after a delay slightly longer than transition
                  setTimeout(() => {
                      currentActiveSection.classList.remove('is-exiting');
                  }, CONTENT_TRANSITION_DURATION);
             }

             // Hide loading overlay after transition
             setTimeout(() => {
                if (loadingOverlay) loadingOverlay.classList.remove('is-active');
                 isTransitioning = false; // Allow next transition
                 console.log(`Transition complete for ${targetId}`);
             }, CONTENT_TRANSITION_DURATION);

        }, 50); // Small delay to let CSS apply exiting styles

        // Update sidebar state
        updateSidebarActiveState(targetId);
    }

    // Function to update active sidebar link
    function updateSidebarActiveState(targetId) {
        sidebarLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-target') === targetId);
        });
    }

    // --- Event Listeners ---

    // Sidebar link clicks
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetContentId = link.getAttribute('data-target');
            const targetTitle = link.getAttribute('data-title');
            switchContent(targetContentId, targetTitle);
        });
    });

    // Dropdown navigation link clicks
    dropdownNavLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetContentId = link.getAttribute('data-target');
            const targetTitle = link.getAttribute('data-title');
            switchContent(targetContentId, targetTitle);
            // Optional: Close dropdown here
        });
    });

    // Overview Widget clicks
    overviewWidgets.forEach(widget => {
        widget.addEventListener('click', () => {
            const targetContentId = widget.getAttribute('data-link-target');
             // Find the corresponding sidebar link to get the title
             const targetLink = document.querySelector(`.sidebar-nav .nav-link[data-target="${targetContentId}"]`);
             const targetTitle = targetLink ? targetLink.getAttribute('data-title') : null;
            if (targetContentId) {
                switchContent(targetContentId, targetTitle);
            }
        });
    });


    // Logout Button Functionality
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            console.log("Logout action triggered.");
            // ADD FIREBASE LOGOUT LOGIC HERE (as before)
             alert("Firebase logout logic needs implementation.");
             // window.location.href = 'login.html';
        });
    }

    // ========================================================================
    // Calendar Component Logic (Ensure this is still present from previous step)
    // ========================================================================
    const calendarDaysContainer = document.getElementById('calendar-days');
    const monthYearDisplay = document.getElementById('month-year');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const todayBtn = document.getElementById('today-btn');
    let calendarCurrentDate = new Date(); // Use a separate variable for calendar state

    function renderCalendar(dateToShow) { /* ... (Keep full renderCalendar function here) ... */
        if (!calendarDaysContainer || !monthYearDisplay) { return; }
        const year = dateToShow.getFullYear();
        const month = dateToShow.getMonth();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        monthYearDisplay.textContent = `${monthNames[month]} ${year}`;
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const lastDayOfPrevMonth = new Date(year, month, 0);
        const firstDayWeekday = firstDayOfMonth.getDay();
        const lastDateOfMonth = lastDayOfMonth.getDate();
        const lastDateOfPrevMonth = lastDayOfPrevMonth.getDate();
        calendarDaysContainer.innerHTML = '';
        // Prev Month Days
        for (let i = firstDayWeekday; i > 0; i--) { calendarDaysContainer.appendChild(createDayElement(lastDateOfPrevMonth - i + 1, false, true)); }
        // Current Month Days
        const today = new Date(); const todayDate = today.getDate(); const todayMonth = today.getMonth(); const todayYear = today.getFullYear();
        for (let i = 1; i <= lastDateOfMonth; i++) {
            const isCurrentDay = (i === todayDate && month === todayMonth && year === todayYear);
            const dayElement = createDayElement(i, true, false, isCurrentDay);
            dayElement.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            calendarDaysContainer.appendChild(dayElement);
             if (Math.random() < 0.3) { addEventIndicators(dayElement); } // Placeholder events
        }
        // Next Month Days
        const totalDaysRendered = firstDayWeekday + lastDateOfMonth; const daysInGrid = totalDaysRendered <= 35 ? 35 : 42; const nextMonthDaysNeeded = daysInGrid - totalDaysRendered;
        for (let i = 1; i <= nextMonthDaysNeeded; i++) { calendarDaysContainer.appendChild(createDayElement(i, false, true)); }
    }
    function createDayElement(day, isCurrentMonth, isOtherMonth, isCurrentDay = false) { /* ... (Keep full createDayElement function here) ... */
        const dayElement = document.createElement('div'); dayElement.classList.add('calendar-day');
        const dayNumberSpan = document.createElement('span'); dayNumberSpan.classList.add('day-number'); dayNumberSpan.textContent = day; dayElement.appendChild(dayNumberSpan);
        if (isOtherMonth) { dayElement.classList.add('other-month'); } if (isCurrentDay) { dayElement.classList.add('current-day'); }
        const eventIndicatorsDiv = document.createElement('div'); eventIndicatorsDiv.classList.add('event-indicators'); dayElement.appendChild(eventIndicatorsDiv);
        return dayElement;
    }
    function addEventIndicators(dayElement) { /* ... (Keep full addEventIndicators placeholder function here) ... */
         const indicatorsContainer = dayElement.querySelector('.event-indicators'); if (!indicatorsContainer) return;
         const eventTypes = ['deadline', 'meeting', 'filing', 'other']; const numEvents = Math.floor(Math.random() * 4);
         for (let i = 0; i < numEvents; i++) { const dot = document.createElement('span'); dot.classList.add('event-dot'); const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)]; dot.classList.add(`type-${randomType}`); dot.title = `Event Type: ${randomType}`; indicatorsContainer.appendChild(dot); }
    }
    if (prevMonthBtn) { prevMonthBtn.addEventListener('click', () => { calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() - 1); renderCalendar(calendarCurrentDate); }); }
    if (nextMonthBtn) { nextMonthBtn.addEventListener('click', () => { calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + 1); renderCalendar(calendarCurrentDate); }); }
    if (todayBtn) { todayBtn.addEventListener('click', () => { calendarCurrentDate = new Date(); renderCalendar(calendarCurrentDate); }); }
    if (calendarDaysContainer) { calendarDaysContainer.addEventListener('click', (event) => { const targetDay = event.target.closest('.calendar-day'); if (targetDay && !targetDay.classList.contains('other-month')) { const dateStr = targetDay.dataset.date; console.log("Clicked on date:", dateStr); calendarDaysContainer.querySelectorAll('.selected-day').forEach(el => el.classList.remove('selected-day')); targetDay.classList.add('selected-day'); } }); }
    // Initial Calendar Render (if calendar section might be initially active)
    if(document.getElementById('calendar-content').classList.contains('is-active')){
        renderCalendar(calendarCurrentDate);
    }
    // Or render it when the calendar section becomes active (more efficient)
    const calendarObserver = new MutationObserver((mutationsList) => {
        for(let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const targetElement = mutation.target;
                 if (targetElement.id === 'calendar-content' && targetElement.classList.contains('is-active')) {
                     // Render calendar only when it becomes active
                     renderCalendar(calendarCurrentDate);
                     // observer.disconnect(); // Optional: stop observing if only needed once
                 }
            }
        }
    });
     if (document.getElementById('calendar-content')) {
         calendarObserver.observe(document.getElementById('calendar-content'), { attributes: true });
     }

    // End Calendar Logic
    // ========================================================================


    // --- Final Initialization ---
    // Set initial state based on the HTML (which section has .is-active)
    const initialActiveSection = document.querySelector('.content-section.is-active');
    if (initialActiveSection) {
        currentActiveSectionId = initialActiveSection.id;
        const initialLink = document.querySelector(`.sidebar-nav .nav-link[data-target="${currentActiveSectionId}"]`);
        const initialTitle = initialLink ? initialLink.getAttribute('data-title') : "Dashboard";
         if (mainContentTitle) mainContentTitle.textContent = initialTitle;
         updateSidebarActiveState(currentActiveSectionId);

         // If initial active is calendar, render it
         if(currentActiveSectionId === 'calendar-content') {
             renderCalendar(calendarCurrentDate);
         }
    }

    console.log("Enhanced Dashboard V2 Initialized.");

}); // End DOMContentLoaded