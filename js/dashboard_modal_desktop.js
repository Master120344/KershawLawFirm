// --- Case Details Modal Logic (Desktop) ---

// Note: This script assumes 'AppState' and 'DOM' are globally accessible objects
// defined in client_dashboard_desktop.js and that helper functions (like getStatusTextAndClass)
// are available from dashboard_helpers_desktop.js.
// This script should be loaded AFTER dashboard_helpers_desktop.js and client_dashboard_desktop.js
// defines the DOM object, but BEFORE setupModalLogicDesktop is called within client_dashboard_desktop.js.

const H2VisaStepsDesktop = {
    'initial_review': [
        { name: 'Account Setup & Initial Consultation', status: 'complete', details: 'Portal access granted. Discussed case requirements and strategy.' },
        { name: 'Fee Agreement Review', status: 'action', details: 'Please review and sign the Fee Agreement found in your Documents section or Action Items.' },
        { name: 'Document Collection (Initial)', status: 'pending', details: 'Awaiting initial business and job offer documents upload after agreement.' },
        { name: 'Firm Review & Analysis', status: 'pending', details: 'Will begin once initial documents are received.' },
        { name: 'Initial Payment Due', status: 'pending', details: 'Required upon Fee Agreement signature.' },
        { name: 'LCA Preparation', status: 'pending', details: 'Will commence upon receipt of signed agreement and payment.' }
    ],
    'submitted_lca': [
        { name: 'Initial Steps Completed', status: 'complete', details: 'Fee Agreement signed and initial payment received.' },
        { name: 'LCA Preparation (Form ETA-9035)', status: 'complete', details: 'Labor Condition Application prepared based on your job offer details.' },
        { name: 'LCA Submitted to DOL', status: 'in-progress', details: 'Submitted via FLAG system. Awaiting Department of Labor processing.' },
        { name: 'Begin Recruitment (If Applicable)', status: 'pending', details: 'Required advertising and U.S. worker recruitment efforts will commence shortly.' },
        { name: 'Petition Preparation (Form I-129)', status: 'pending', details: 'Will prepare concurrently or upon LCA certification.' }
    ],
    'pending_dol': [
        { name: 'LCA Submitted to DOL', status: 'complete', details: 'Submitted on [Date Placeholder] via FLAG system.' },
        { name: 'DOL Review Period', status: 'in-progress', details: 'Currently under standard review by the Department of Labor (ETA Processing Center).' },
        { name: 'Recruitment Efforts (If Applicable)', status: 'in-progress', details: 'Ongoing required advertising and recruitment activities.' },
        { name: 'Petition Preparation (Form I-129)', status: 'pending', details: 'Preparing supporting documents.' },
        { name: 'Await DOL Certification/Decision', status: 'pending', details: 'Monitoring FLAG system for updates. Decision expected within standard processing times.' }
    ],
    'dol_certified': [
        { name: 'DOL Certification Received', status: 'complete', details: 'Certified Labor Condition Application received on [Date Placeholder].' },
        { name: 'Recruitment Report Finalized (If Applicable)', status: 'complete', details: 'Documented results of U.S. worker recruitment efforts.' },
        { name: 'Petition Preparation (Form I-129)', status: 'in-progress', details: 'Finalizing Form I-129 and assembling the supporting evidence package.' },
        { name: 'Submit Petition to USCIS', status: 'pending', details: 'Package ready for filing with the appropriate USCIS service center.' }
    ],
    'submitted_uscis': [
        { name: 'DOL Certification Received', status: 'complete', details: '' },
        { name: 'Petition Preparation (Form I-129)', status: 'complete', details: 'Form I-129 package assembled, reviewed, and signed.' },
        { name: 'Petition Submitted to USCIS', status: 'in-progress', details: 'Filed on [Date Placeholder]. Awaiting official Receipt Notice (Form I-797C).' },
        { name: 'USCIS Processing Queue', status: 'pending', details: 'Case enters the USCIS processing queue for review.' }
    ],
    'pending_uscis_review': [
        { name: 'Petition Submitted to USCIS', status: 'complete', details: 'Receipt Notice #: [Placeholder]' },
        { name: 'USCIS Adjudication', status: 'in-progress', details: 'Petition is assigned to and under review by a USCIS officer.' },
        { name: 'Await USCIS Decision', status: 'pending', details: 'Monitoring case status via USCIS systems for updates or requests.' }
    ],
    'rfe_issued': [
        { name: 'Petition Submitted to USCIS', status: 'complete', details: 'Receipt Notice #: [Placeholder]' },
        { name: 'Request for Evidence (RFE) Issued', status: 'action', details: 'USCIS requires additional information/documents. See Documents section for RFE notice.' },
        { name: 'Prepare RFE Response', status: 'in-progress', details: 'Gathering and preparing requested items. Firm working on response. Deadline: [Date Placeholder]' },
        { name: 'Submit RFE Response', status: 'pending', details: 'Response will be filed with USCIS upon completion.' }
    ],
    'approved': [
        { name: 'DOL Certification', status: 'complete', details: '' },
        { name: 'USCIS Petition Filing & Review', status: 'complete', details: '(Including RFE response, if applicable)' },
        { name: 'USCIS Approval Received', status: 'complete', details: 'Approval Notice (Form I-797) issued. Valid Dates: [Start Date] - [End Date]' },
        { name: 'Consular Processing / Next Steps', status: 'in-progress', details: 'Notifying consulate (if applicable); preparing workers for visa interview/entry or status change.' }
    ],
    'denied': [
        { name: 'DOL/USCIS Review Complete', status: 'complete', details: '' },
        { name: 'Case Denied', status: 'action', details: 'Received denial notice. See Documents section. Reviewing options (Appeal/Motion/Refile).' },
        { name: 'Consultation on Options', status: 'pending', details: 'Firm will contact you to schedule a call to discuss next steps.' }
    ],
    'consular_processing': [
        { name: 'USCIS Approval Received', status: 'complete', details: '' },
        { name: 'Case Sent to NVC/Consulate', status: 'complete', details: 'National Visa Center or specific consulate notified of approval.' },
        { name: 'Worker(s) Prepare for Interview', status: 'in-progress', details: 'Workers schedule appointments, gather documents (DS-160, passport photos, etc.).' },
        { name: 'Visa Interview / Issuance', status: 'pending', details: 'Awaiting interview outcome and visa stamping/issuance.' }
    ],
    'complete': [
        { name: 'DOL Certification', status: 'complete', details: '' },
        { name: 'USCIS Approval', status: 'complete', details: '' },
        { name: 'Consular Processing / Entry / Change of Status', status: 'complete', details: 'Worker(s) granted visa and entered U.S. or successfully changed status.' },
        { name: 'Case Concluded for this Period', status: 'complete', details: 'All primary H-2 processing stages completed successfully.' }
    ],
    'default': [
        { name: 'Status Unavailable', status: 'pending', details: 'Detailed steps cannot be displayed currently. Please contact us if you have questions.' }
    ]
};

/**
 * Gets the detailed steps array for the current case status.
 * Relies on global AppState.
 * @param {string} [statusKey=AppState.caseStatus] - The status key override.
 * @returns {Array} Array of step objects.
 */
function getStatusStepsDesktop(statusKey) {
    // Ensure AppState is available
    const currentStatus = (typeof AppState !== 'undefined' && AppState.caseStatus) ? (statusKey || AppState.caseStatus) : (statusKey || 'default');
    return H2VisaStepsDesktop[currentStatus] || H2VisaStepsDesktop['default'];
}

/**
 * Renders the steps into the modal list.
 * Relies on global DOM object (DOM.modalStepsListDesktop).
 * @param {Array} steps - Array of step objects from getStatusStepsDesktop.
 */
function renderStepsDesktop(steps) {
    // Ensure DOM and the specific element are available
    if (typeof DOM === 'undefined' || !DOM.modalStepsListDesktop) {
        console.error("DOM object or modal steps list not available for rendering.");
        return;
    }
    DOM.modalStepsListDesktop.innerHTML = ''; // Clear previous steps
    if (!steps || steps.length === 0) {
        DOM.modalStepsListDesktop.innerHTML = '<li class="step-item-desktop status-pending"><i class="fa-solid fa-circle-info step-icon-desktop"></i><span class="step-text-desktop">No detailed steps available for this status.</span></li>';
        return;
    }
    steps.forEach(step => {
        const li = document.createElement('li');
        li.className = `step-item-desktop status-${step.status || 'pending'}`; // Default to pending if status missing

        const iconSpan = document.createElement('span');
        iconSpan.className = 'step-icon-desktop';
        let iconClass = 'fa-circle-question'; // Default icon
        switch (step.status) {
            case 'complete': iconClass = 'fa-circle-check'; break;
            case 'in-progress': iconClass = 'fa-spinner fa-spin'; break;
            case 'pending': iconClass = 'fa-circle'; break; // Using a plain circle for pending
            case 'action': iconClass = 'fa-triangle-exclamation'; break;
        }
        iconSpan.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;

        const textSpan = document.createElement('span');
        textSpan.className = 'step-text-desktop';
        textSpan.textContent = step.name;

        li.appendChild(iconSpan); // Add icon first

        // Create a container for text and details to sit next to the icon
        const textBlock = document.createElement('div');
        textBlock.style.display = 'flex';
        textBlock.style.flexDirection = 'column';
        textBlock.appendChild(textSpan); // Add main text

        if (step.details) {
            const detailSpan = document.createElement('span');
            detailSpan.className = 'step-details-desktop'; // Apply specific detail styling
            detailSpan.textContent = step.details;
            textBlock.appendChild(detailSpan); // Add details below main text
        }

        li.appendChild(textBlock); // Add the text block container
        DOM.modalStepsListDesktop.appendChild(li);
    });
}


/**
 * Opens the case details modal and populates it.
 * Relies on global AppState and DOM objects.
 */
function openModalDesktop() {
    // Ensure dependencies are available
    if (typeof DOM === 'undefined' || !DOM.modalDesktop || typeof AppState === 'undefined' || typeof getStatusTextAndClass === 'undefined') {
        console.error("DOM object, modal element, AppState, or helper functions not available for opening modal.");
        return;
    }
    const currentStatusKey = AppState.caseStatus || 'default';
    const steps = getStatusStepsDesktop(currentStatusKey);
    renderStepsDesktop(steps); // Render steps first

    // Update modal title using helper function for status text
    const statusInfo = getStatusTextAndClass(currentStatusKey);
    const statusText = statusInfo.text || 'Details';
    if (DOM.modalTitleDesktop) {
        DOM.modalTitleDesktop.textContent = `Detailed Case Steps (${statusText})`;
    }

    // Make modal visible and lock body scroll
    DOM.modalDesktop.classList.add('visible');
    document.body.classList.add('modal-open-desktop');
}

/**
 * Closes the case details modal.
 * Relies on global DOM object.
 */
function closeModalDesktop() {
     if (typeof DOM === 'undefined' || !DOM.modalDesktop) {
        console.error("DOM object or modal element not available for closing modal.");
        return;
    }
    DOM.modalDesktop.classList.remove('visible');
    document.body.classList.remove('modal-open-desktop');
}

/**
 * Sets up the event listeners for the modal (open, close, escape key).
 * Relies on global DOM object. Ensures listeners are added only once.
 * Needs to be called once after the DOM is ready and DOM object is populated.
 */
function setupModalLogicDesktop() {
     if (typeof DOM === 'undefined') {
        console.error("DOM object not available for setting up modal logic.");
        return;
    }
    // Add listener to the "View Detailed Case Steps" button
    if (DOM.viewCaseDetailsBtnDesktop) {
        if (!DOM.viewCaseDetailsBtnDesktop.hasAttribute('data-modal-listener')) {
             DOM.viewCaseDetailsBtnDesktop.addEventListener('click', openModalDesktop);
             DOM.viewCaseDetailsBtnDesktop.setAttribute('data-modal-listener', 'true');
        }
    } else { console.error("View Case Details Button (#view-case-details-btn-desktop) not found for modal."); }

    // Add listener to the modal's close button
    if (DOM.modalCloseButtonDesktop) {
        if (!DOM.modalCloseButtonDesktop.hasAttribute('data-modal-listener')) {
            DOM.modalCloseButtonDesktop.addEventListener('click', closeModalDesktop);
            DOM.modalCloseButtonDesktop.setAttribute('data-modal-listener', 'true');
         }
    } else { console.error("Modal Close Button (#case-details-close-btn-desktop) not found."); }

    // Add listener for clicking on the modal overlay (background)
    if (DOM.modalDesktop) {
         if (!DOM.modalDesktop.hasAttribute('data-modal-listener')) {
            DOM.modalDesktop.addEventListener('click', (event) => {
                // Check if the click is directly on the overlay (modalDesktop) itself
                if (event.target === DOM.modalDesktop) {
                    closeModalDesktop();
                }
            });
            DOM.modalDesktop.setAttribute('data-modal-listener', 'true');
        }
    } else { console.error("Modal Overlay (#case-details-modal-desktop) not found."); }

    // Add Escape key listener to the document (only once)
    if (!document.body.hasAttribute('data-escape-listener-set')) {
        document.addEventListener('keydown', (event) => {
            // Check if modal exists and is visible before attempting to close
            if (event.key === 'Escape' && DOM.modalDesktop?.classList.contains('visible')) {
                 closeModalDesktop();
            }
        });
        document.body.setAttribute('data-escape-listener-set', 'true');
    }
}

// --- End Case Details Modal Logic ---
