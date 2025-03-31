// Use the JS code provided in the previous step ("Updated for Smooth Transitions & Widget Clicks")
// It already contains the logic for handling 'is-active' and 'is-exiting' classes
// and the calendar functionality.
// Make sure the CONTENT_TRANSITION_DURATION constant matches the CSS transition duration.

document.addEventListener('DOMContentLoaded', () => {

    // --- Constants ---
    // Ensure this duration matches the --transition-content value in your CSS (e.g., 0.4s = 400ms)
    const CONTENT_TRANSITION_DURATION = 400;

    // --- Element Selectors ---
    const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const contentSections = document.querySelectorAll('.main-content .content-section');
    const mainContentArea = document.getElementById('main-content-area');
    const mainContentTitle = document.getElementById('main-content-title');
    const currentYearSpan = document.getElementById('current-year');
    const logoutButton = document.getElementById('logout-button-dropdown'); // Corrected ID from HTML
    const profileMenuContainer = document.querySelector('.profile-menu-container');
    const dropdownNavLinks = document.querySelectorAll('.profile-dropdown .nav-link-trigger');
    const overviewWidgets = document.querySelectorAll('#overview-content .widget.clickable');
    const loadingOverlay = document.getElementById('loading-overlay');

    let isTransitioning = false; // Flag to prevent rapid transitions
    // Get initial active section from HTML class '.is-active'
    let currentActiveSectionId = document.querySelector('.content-section.is-active')?.id || 'overview-content';

    // --- Initial Setup ---
    setTimeout(() => { document.body.classList.remove('preload'); }, 100);
    if (currentYearSpan) { currentYearSpan.textContent = new Date().getFullYear(); }

    // --- Core Functions ---

    // Function to switch active content section with smooth transitions
    function switchContent(targetId, targetTitle = null) {
        if (isTransitioning || !targetId || targetId === currentActiveSectionId) {
            // console.log(`Transition skipped for ${targetId}`); // Optional debugging
            return;
        }
        isTransitioning = true;
        // console.log(`Switching to: ${targetId}`); // Optional debugging
        if (loadingOverlay) loadingOverlay.classList.add('is-active');

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
            // Use provided title (from data-title) or fallback to section's H2
             const targetLink = document.querySelector(`.nav-link[data-target="${targetId}"]`); // Get title from link data
             const linkTitle = targetLink ? targetLink.getAttribute('data-title') : null;
             mainContentTitle.textContent = targetTitle || linkTitle || "Dashboard"; // Use function arg > link data > default
        }

        // 3. Prepare the next section (starts hidden via CSS)

        // 4. After a short delay, make the next section active
        setTimeout(() => {
            if (nextSection.classList.contains('scrollable') || nextSection.id === 'calendar-content') {
                nextSection.scrollTop = 0; // Reset scroll for the incoming section
            }
            nextSection.classList.add('is-active'); // Add is-active to trigger entrance animation
            currentActiveSectionId = targetId; // Update tracking *after* starting transition

             // Remove exiting class from the previous section after its transition ends
             if (currentActiveSection) {
                  currentActiveSection.addEventListener('transitionend', () => {
                     // Only remove if it's actually the one exiting (handles rapid clicks better)
                     if(currentActiveSection.classList.contains('is-exiting')) {
                          currentActiveSection.classList.remove('is-exiting');
                     }
                  }, { once: true }); // Use event listener for accuracy
             }

             // Hide loading overlay after the *new* section's transition should be done
             setTimeout(() => {
                if (loadingOverlay) loadingOverlay.classList.remove('is-active');
                 isTransitioning = false;
                 // console.log(`Transition complete for ${targetId}`); // Optional debugging
             }, CONTENT_TRANSITION_DURATION);

        }, 50); // Small delay to allow browser to paint the exit state

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
              const targetLink = document.querySelector(`.nav-link[data-target="${targetContentId}"]`); // Get title from sidebar link
             const targetTitle = targetLink ? targetLink.getAttribute('data-title') : null;
             switchContent(targetContentId, targetTitle);
             // Close dropdown (requires additional JS for dropdown state management)
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
    // Calendar Component Logic (Included from previous step)
    // ========================================================================
    const calendarDaysContainer = document.getElementById('calendar-days');
    const monthYearDisplay = document.getElementById('month-year');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const todayBtn = document.getElementById('today-btn');
    let calendarCurrentDate = new Date();

    function renderCalendar(dateToShow) { /* ... (Keep full renderCalendar function here) ... */
        if (!calendarDaysContainer || !monthYearDisplay) { return; }
        const year = dateToShow.getFullYear(); const month = dateToShow.getMonth(); const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; monthYearDisplay.textContent = `${monthNames[month]} ${year}`; const firstDayOfMonth = new Date(year, month, 1); const lastDayOfMonth = new Date(year, month + 1, 0); const lastDayOfPrevMonth = new Date(year, month, 0); const firstDayWeekday = firstDayOfMonth.getDay(); const lastDateOfMonth = lastDayOfMonth.getDate(); const lastDateOfPrevMonth = lastDayOfPrevMonth.getDate(); calendarDaysContainer.innerHTML = '';
        for (let i = firstDayWeekday; i > 0; i--) { calendarDaysContainer.appendChild(createDayElement(lastDateOfPrevMonth - i + 1, false, true)); }
        const today = new Date(); const todayDate = today.getDate(); const todayMonth = today.getMonth(); const todayYear = today.getFullYear();
        for (let i = 1; i <= lastDateOfMonth; i++) { const isCurrentDay = (i === todayDate && month === todayMonth && year === todayYear); const dayElement = createDayElement(i, true, false, isCurrentDay); dayElement.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`; calendarDaysContainer.appendChild(dayElement); if (Math.random() < 0.3) { addEventIndicators(dayElement); } }
        const totalDaysRendered = firstDayWeekday + lastDateOfMonth; const daysInGrid = totalDaysRendered <= 35 ? 35 : 42; const nextMonthDaysNeeded = daysInGrid - totalDaysRendered; for (let i = 1; i <= nextMonthDaysNeeded; i++) { calendarDaysContainer.appendChild(createDayElement(i, false, true)); }
    }
    function createDayElement(day, isCurrentMonth, isOtherMonth, isCurrentDay = false) { /* ... (Keep full createDayElement function here) ... */
        const dayElement = document.createElement('div'); dayElement.classList.add('calendar-day'); const dayNumberSpan = document.createElement('span'); dayNumberSpan.classList.add('day-number'); dayNumberSpan.textContent = day; dayElement.appendChild(dayNumberSpan); if (isOtherMonth) { dayElement.classList.add('other-month'); } if (isCurrentDay) { dayElement.classList.add('current-day'); } const eventIndicatorsDiv = document.createElement('div'); eventIndicatorsDiv.classList.add('event-indicators'); dayElement.appendChild(eventIndicatorsDiv); return dayElement;
    }
     function addEventIndicators(dayElement) { /* ... (Keep full addEventIndicators placeholder function here) ... */
         const indicatorsContainer = dayElement.querySelector('.event-indicators'); if (!indicatorsContainer) return; const eventTypes = ['deadline', 'meeting', 'filing', 'other']; const numEvents = Math.floor(Math.random() * 4); for (let i = 0; i < numEvents; i++) { const dot = document.createElement('span'); dot.classList.add('event-dot'); const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)]; dot.classList.add(`type-${randomType}`); dot.title = `Event Type: ${randomType}`; indicatorsContainer.appendChild(dot); }
    }
    if (prevMonthBtn) { prevMonthBtn.addEventListener('click', () => { calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() - 1); renderCalendar(calendarCurrentDate); }); }
    if (nextMonthBtn) { nextMonthBtn.addEventListener('click', () => { calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + 1); renderCalendar(calendarCurrentDate); }); }
    if (todayBtn) { todayBtn.addEventListener('click', () => { calendarCurrentDate = new Date(); renderCalendar(calendarCurrentDate); }); }
    if (calendarDaysContainer) { calendarDaysContainer.addEventListener('click', (event) => { const targetDay = event.target.closest('.calendar-day'); if (targetDay && !targetDay.classList.contains('other-month')) { const dateStr = targetDay.dataset.date; console.log("Clicked on date:", dateStr); calendarDaysContainer.querySelectorAll('.selected-day').forEach(el => el.classList.remove('selected-day')); targetDay.classList.add('selected-day'); } }); }
    // Enhanced: Use MutationObserver to render calendar only when its section is active
    const calendarSection = document.getElementById('calendar-content');
    if (calendarSection) {
        let calendarRendered = false; // Flag to render only once per activation if needed
         const calendarObserver = new MutationObserver((mutationsList) => {
            for(let mutation of mutationsList) {
                 if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                     const targetElement = mutation.target;
                      if (targetElement.id === 'calendar-content') {
                          if(targetElement.classList.contains('is-active')) {
                              // Render only if not already rendered, or always re-render if needed
                              // if (!calendarRendered) {
                                  console.log("Rendering calendar as section became active.");
                                  renderCalendar(calendarCurrentDate);
                                  // calendarRendered = true;
                              // }
                          } else {
                              // Reset flag if needed when section becomes inactive
                              // calendarRendered = false;
                          }
                      }
                 }
            }
         });
         calendarObserver.observe(calendarSection, { attributes: true });
    }
    // ========================================================================


    // --- Final Initialization ---
    // Ensure initial state (title, sidebar active link) matches the HTML on load
    const initialActiveSectionHTML = document.querySelector('.content-section.is-active');
    if (initialActiveSectionHTML) {
        currentActiveSectionId = initialActiveSectionHTML.id; // Set the correct starting ID
        const initialLink = document.querySelector(`.sidebar-nav .nav-link[data-target="${currentActiveSectionId}"]`);
        const initialTitle = initialLink ? initialLink.getAttribute('data-title') : "Dashboard";
         if (mainContentTitle) mainContentTitle.textContent = initialTitle;
         updateSidebarActiveState(currentActiveSectionId); // Ensure sidebar matches HTML state

         // If initial active section is calendar, render it immediately
         if(currentActiveSectionId === 'calendar-content') {
             renderCalendar(calendarCurrentDate);
         }
    } else {
        // Fallback if no section is marked active in HTML
        switchContent('overview-content', 'Dashboard Overview');
    }

    console.log("Enhanced Dashboard V2.1 Initialized.");

}); // End DOMContentLoaded
