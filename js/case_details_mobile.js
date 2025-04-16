document.addEventListener('DOMContentLoaded', () => {

    const viewDetailsButton = document.getElementById('view-case-details-btn');
    const modal = document.getElementById('case-details-modal');
    const modalContent = document.getElementById('case-details-content');
    const modalCloseButton = document.getElementById('case-details-close-btn');
    const modalTitle = document.getElementById('case-details-modal-title');
    const modalStepsList = document.getElementById('case-details-steps-list');

    // Basic check for essential elements
    if (!viewDetailsButton || !modal || !modalContent || !modalCloseButton || !modalTitle || !modalStepsList) {
        console.error('Case Details Modal elements not found. Ensure HTML structure is correct.');
        return;
    }

    // Define H-2 Visa process steps (Generalized - tailor these with Kershaw Law's specifics)
    const H2VisaSteps = {
        'initial_review': [
            { name: 'Initial Consultation', status: 'complete', details: 'Discussed case requirements and strategy.' },
            { name: 'Document Collection', status: 'complete', details: 'Received initial business and job offer documents.' },
            { name: 'Firm Review & Analysis', status: 'in-progress', details: 'Our team is reviewing your submitted information for eligibility.' },
            { name: 'Fee Agreement Sent', status: 'pending', details: 'Awaiting signed agreement and initial payment.' },
            { name: 'LCA Preparation', status: 'pending', details: 'Will commence upon receipt of signed agreement/payment.' },
        ],
        'submitted_lca': [
            { name: 'Initial Review & Fee Agreement', status: 'complete', details: 'Agreement signed and initial payment received.' },
            { name: 'LCA Preparation (ETA 9035)', status: 'complete', details: 'Labor Condition Application prepared based on job offer.' },
            { name: 'LCA Submitted to DOL', status: 'in-progress', details: 'Waiting for Department of Labor processing via FLAG system.' },
            { name: 'Begin Recruitment (H-2A/B specific)', status: 'pending', details: 'Advertising and U.S. worker recruitment efforts start.' },
            { name: 'Petition Preparation (I-129)', status: 'pending', details: 'Will prepare concurrently or upon LCA certification.' },
        ],
        'pending_dol': [
            { name: 'LCA Submitted to DOL', status: 'complete', details: 'Submitted on [Date Placeholder] via FLAG.' },
            { name: 'DOL Review Period', status: 'in-progress', details: 'Currently under standard review by the Department of Labor.' },
            { name: 'Recruitment Efforts', status: 'in-progress', details: 'Ongoing required advertising and recruitment activities.' },
            { name: 'Petition Preparation (I-129)', status: 'pending', details: 'Preparing supporting documents.' },
            { name: 'Await DOL Certification', status: 'pending', details: 'Decision expected within standard processing times.' },
        ],
         'dol_certified': [
             { name: 'DOL Certification Received', status: 'complete', details: 'Certified LCA received on [Date Placeholder].' },
             { name: 'Recruitment Report Finalized', status: 'complete', details: 'Documented results of U.S. worker recruitment.' },
             { name: 'Petition Preparation (I-129)', status: 'in-progress', details: 'Finalizing Form I-129 and supporting evidence package.' },
             { name: 'Submit Petition to USCIS', status: 'pending', details: 'Ready for filing with appropriate USCIS service center.' },
         ],
        'submitted_uscis': [
            { name: 'DOL Certification Received', status: 'complete', details: '' },
            { name: 'Petition Preparation (I-129)', status: 'complete', details: 'Form I-129 package assembled and reviewed.' },
            { name: 'Petition Submitted to USCIS', status: 'in-progress', details: 'Filed on [Date Placeholder]. Awaiting Receipt Notice.' },
            { name: 'USCIS Processing Begins', status: 'pending', details: 'Case enters USCIS queue.' },
        ],
         'pending_uscis_review': [
             { name: 'Petition Submitted to USCIS', status: 'complete', details: 'Receipt Notice #: [Placeholder]' },
             { name: 'USCIS Adjudication', status: 'in-progress', details: 'Petition is under review by a USCIS officer.' },
             { name: 'Await USCIS Decision', status: 'pending', details: 'Monitoring case status for updates.' },
         ],
         'rfe_issued': [
             { name: 'Petition Submitted to USCIS', status: 'complete', details: 'Receipt Notice #: [Placeholder]' },
             { name: 'Request for Evidence (RFE) Issued', status: 'action', details: 'USCIS requires additional information/documents by deadline.' },
             { name: 'Prepare RFE Response', status: 'in-progress', details: 'Gathering and preparing requested items. Deadline: [Date Placeholder]' },
             { name: 'Submit RFE Response', status: 'pending', details: 'Response will be filed upon completion.' },
         ],
        'approved': [
            { name: 'DOL Certification', status: 'complete', details: '' },
            { name: 'USCIS Petition Filing & Review', status: 'complete', details: '(Including RFE response, if applicable)' },
            { name: 'USCIS Approval Received', status: 'complete', details: 'Approval Notice (I-797) issued. Valid Dates: [Start Date] - [End Date]' },
            { name: 'Consular Processing / Next Steps', status: 'in-progress', details: 'Notifying consulate; preparing workers for visa interview/entry.' },
        ],
        'denied': [
            { name: 'DOL/USCIS Review Complete', status: 'complete', details: '' },
            { name: 'Case Denied', status: 'action', details: 'Received denial notice. Reviewing options (Appeal/Motion/Refile).' },
            { name: 'Consultation on Options', status: 'pending', details: 'Will schedule call to discuss next steps.' },
        ],
        'consular_processing': [
             { name: 'USCIS Approval Received', status: 'complete', details: '' },
             { name: 'Case Sent to NVC/Consulate', status: 'complete', details: 'National Visa Center or specific consulate notified.' },
             { name: 'Worker(s) Prepare for Interview', status: 'in-progress', details: 'Workers schedule appointments, gather documents (DS-160 etc.).' },
             { name: 'Visa Interview / Issuance', status: 'pending', details: 'Awaiting interview outcome and visa stamping.' },
         ],
        'complete': [
             { name: 'DOL Certification', status: 'complete', details: '' },
             { name: 'USCIS Approval', status: 'complete', details: '' },
             { name: 'Consular Processing / Entry', status: 'complete', details: 'Worker(s) granted visa and entered U.S. or changed status.' },
             { name: 'Case Concluded', status: 'complete', details: 'All primary stages completed successfully.' },
         ],
        'default': [
             { name: 'Status Unavailable', status: 'pending', details: 'Detailed steps cannot be displayed currently. Please contact us.' },
        ]
    };

    // Function to get steps for the current status
    function getStatusSteps(statusKey) {
         // Attempt to access AppState defined in client_dashboard_mobile.js
         // Provide a fallback if AppState isn't available or statusKey is missing
         const currentStatus = (typeof AppState !== 'undefined' && AppState.caseStatus) ? AppState.caseStatus : (statusKey || 'default');
         return H2VisaSteps[currentStatus] || H2VisaSteps['default'];
    }

    // Function to render the steps in the modal list
    function renderSteps(steps) {
        modalStepsList.innerHTML = ''; // Clear previous steps
        if (!steps || steps.length === 0) {
            modalStepsList.innerHTML = '<li class="step-item status-pending"><i class="fa-solid fa-circle-info step-icon"></i><span class="step-text">No detailed steps available for this status.</span></li>';
            return;
        }

        steps.forEach(step => {
            const li = document.createElement('li');
            // Apply status class for styling (e.g., color-coding icons/text)
            li.className = `step-item status-${step.status}`;

            const iconSpan = document.createElement('span');
            iconSpan.className = 'step-icon';
            let iconClass = 'fa-circle-question'; // Default icon
            if (step.status === 'complete') iconClass = 'fa-circle-check';
            if (step.status === 'in-progress') iconClass = 'fa-spinner fa-spin'; // Use spinner for active steps
            if (step.status === 'pending') iconClass = 'fa-circle'; // Simple circle for pending
            if (step.status === 'action') iconClass = 'fa-triangle-exclamation'; // Warning for action needed
            iconSpan.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;

            const textSpan = document.createElement('span');
            textSpan.className = 'step-text';
            textSpan.textContent = step.name;

            // Create detail span only if details exist
            let detailSpan = null;
            if (step.details) {
                detailSpan = document.createElement('span');
                detailSpan.className = 'step-details';
                detailSpan.textContent = step.details;
            }

            li.appendChild(iconSpan);
            li.appendChild(textSpan);
            if (detailSpan) { // Append detail span if created
                 li.appendChild(detailSpan);
            }

            modalStepsList.appendChild(li);
        });
    }

    // Function to open the modal
    function openModal() {
         // Ensure AppState is available to get the most current status
         const currentStatusKey = typeof AppState !== 'undefined' ? AppState.caseStatus : 'default';
         const steps = getStatusSteps(currentStatusKey);
         renderSteps(steps); // Populate the list with current steps

         // Set modal title dynamically
         const statusText = currentStatusKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Format status key for title
         modalTitle.textContent = `Detailed Case Steps (${statusText})`;

         modal.classList.add('visible'); // Make modal visible
         document.body.classList.add('modal-open'); // Add class to body to disable scroll
    }

    // Function to close the modal
    function closeModal() {
        modal.classList.remove('visible'); // Hide modal
        document.body.classList.remove('modal-open'); // Remove class from body to enable scroll
    }

    // --- Event Listeners ---
    // Open modal when the details button is clicked
    viewDetailsButton.addEventListener('click', openModal);

    // Close modal when the close button is clicked
    modalCloseButton.addEventListener('click', closeModal);

    // Close modal if user clicks on the background overlay (outside the content box)
    modal.addEventListener('click', (event) => {
        // Check if the click target is the overlay itself, not its children
        if (event.target === modal) {
            closeModal();
        }
    });

     // Close modal if the Escape key is pressed
     document.addEventListener('keydown', (event) => {
         if (event.key === 'Escape' && modal.classList.contains('visible')) {
             closeModal();
         }
     });

    console.log('Case Details Modal JS loaded and listeners attached.');

});