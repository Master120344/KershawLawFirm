document.addEventListener('DOMContentLoaded', () => {
    console.log('Desktop Client Dashboard JS Initialized.');

    // --- Global State (Example Data - Replace with actual API data) ---
    const AppState = {
        clientName: "Global Ag Services",
        visaType: "H-2A", // H-2A or H-2B
        caseId: "KLR-H2A-2025-002",
        caseStatus: "dol_certified", // Matches keys in H2VisaSteps
        caseProgressPercent: 55,
        estimatedCompletion: "Q3 2025",
        paymentStatus: "paid", // 'paid', 'due', 'error', 'signing_required'
        feeAgreementSigned: true, // Example: Agreement already signed
        lastPayment: { date: "2025-02-10", amount: "3000.00" },
        nextPayment: { amount: "1200.00", dueDate: "2025-05-15", invoiceId: "invKLR812" },
        receiptHistoryUrl: "#/billing/history",
        feeAgreementUrl: "#/documents/fee-agreement",
        unreadMessages: 1,
        unreadNotifications: 0,
        actionsRequired: [
            // Example: No actions currently required
             // { type: 'information', description: 'Provide updated employee list.', uploadId: 'emp-list-update' }
        ],
        // URLs for navigation targets (placeholders)
        dashboardUrl: "#dashboard",
        caseDetailsUrl: "#/case/details", // Could link to a specific section or modal
        documentsUrl: "#/documents",
        paymentsUrl: "#/payments",
        messagesUrl: "#/messaging",
        profileUrl: "#/profile",
        resourcesUrl: "#/resources", // Added resources link target
        logoutUrl: "/logout" // Placeholder
    };

    // --- DOM Element References ---
    const DOM = {
        // Sidebar
        sidebarNavLinks: document.querySelectorAll('.sidebar-nav .nav-link'),
        clientNameSidebar: document.getElementById('client-name-sidebar'),
        logoutButtonSidebar: document.getElementById('logout-button-sidebar'),
        inboxBadgeSidebar: document.getElementById('inbox-badge-sidebar'),

        // Header
        pageTitleDesktop: document.getElementById('page-title-desktop'),
        notificationsButtonDesktop: document.getElementById('notifications-button-desktop'),
        notificationsBadgeDesktop: document.getElementById('notifications-badge-desktop'),

        // Main Content Area
        contentArea: document.querySelector('.content-area-desktop'),
        allContentSections: document.querySelectorAll('.content-area-desktop .content-section'),

        // Action Required Section
        actionRequiredSectionDesktop: document.getElementById('action-required-section-desktop'),
        actionItemsListDesktop: document.getElementById('action-items-list-desktop'),

        // Case Status Card
        caseStatusIconDesktop: document.getElementById('case-status-icon-desktop'),
        caseStatusTextDetailedDesktop: document.getElementById('case-status-text-detailed-desktop'),
        progressBarInnerDesktop: document.getElementById('progress-bar-inner-desktop'),
        progressPercentageDesktop: document.getElementById('progress-percentage-desktop'),
        estimatedCompletionDesktop: document.getElementById('estimated-completion-desktop'),
        visaTypeDesktop: document.getElementById('visa-type-desktop'),
        viewCaseDetailsBtnDesktop: document.getElementById('view-case-details-btn-desktop'),

        // Payment Card
        paymentSummaryDesktop: document.getElementById('payment-summary-desktop'),
        paymentLoadingDivDesktop: document.getElementById('payment-content-loading-desktop'),
        paymentPaidDivDesktop: document.getElementById('payment-content-paid-desktop'),
        paymentDueDivDesktop: document.getElementById('payment-content-due-desktop'),
        paymentErrorDivDesktop: document.getElementById('payment-content-error-desktop'),
        lastPaymentDateDesktop: document.getElementById('last-payment-date-desktop'),
        lastPaymentAmountDesktop: document.getElementById('last-payment-amount-desktop'),
        nextPaymentAmountDesktop: document.getElementById('next-payment-amount-desktop'),
        paymentDueDateDesktop: document.getElementById('payment-due-date-desktop'),
        makePaymentButtonMainDesktop: document.getElementById('make-payment-button-main-desktop'),
        viewReceiptsPaidDesktop: document.getElementById('view-receipts-paid-desktop'),
        viewReceiptsDueDesktop: document.getElementById('view-receipts-due-desktop'),
        retryPaymentLoadDesktop: document.getElementById('retry-payment-load-desktop'),
        paymentAgreementNoticeDesktop: document.getElementById('payment-agreement-notice-desktop'),
        feeAgreementLinkDesktop: document.getElementById('fee-agreement-link-desktop'),
        signAgreementBtnDesktop: document.getElementById('sign-agreement-btn-desktop'),

        // Quick Access Links
        documentsLinkDesktop: document.getElementById('documents-link-desktop'),
        messagesLinkDesktop: document.getElementById('messages-link-desktop'),
        resourcesLinkDesktop: document.getElementById('resources-link-desktop'),
        profileLinkDesktop: document.getElementById('profile-link-desktop'),
        messagesQuickBadgeDesktop: document.getElementById('messages-quick-badge-desktop'),

        // Case Details Modal
        modalDesktop: document.getElementById('case-details-modal-desktop'),
        modalContentDesktop: document.querySelector('.modal-content-desktop'), // Use querySelector if ID not present
        modalCloseButtonDesktop: document.getElementById('case-details-close-btn-desktop'),
        modalTitleDesktop: document.getElementById('case-details-modal-title-desktop'),
        modalStepsListDesktop: document.getElementById('case-details-steps-list-desktop'),

        // Elements for Animation
        elementsToAnimate: document.querySelectorAll('.card-style-desktop, .quick-link-card-desktop') // Target desktop classes
    };

    // --- Helper Functions ---
    function formatCurrency(amount) {
        if (amount === null || amount === undefined) return '$0.00';
        return `$${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    function formatDate(dateString) {
        if (!dateString) return '--/--/----';
        try {
            const date = new Date(dateString);
            const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
            return adjustedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch (e) { return dateString; }
    }

    function updateBadge(badgeElement, count) {
        if (!badgeElement) return;
        const numCount = parseInt(count, 10) || 0;
        badgeElement.textContent = numCount; // Show full count on desktop? Or cap? Let's cap for now.
        badgeElement.style.display = numCount > 0 ? 'inline-block' : 'none'; // Adjust display
        if (numCount > 9) badgeElement.textContent = '9+'; // Cap at 9+
    }

    function getStatusTextAndClass(statusKey) {
        const statuses = { // Same statuses as mobile
            'initial_review': { text: 'Initial Document Review', class: 'info' },
            'submitted_lca': { text: 'LCA Submitted to DOL', class: 'pending' },
            'pending_dol': { text: 'Pending DOL Certification', class: 'pending' },
            'dol_certified': { text: 'DOL Certified / Awaiting Filing', class: 'good' },
            'submitted_uscis': { text: 'Petition Submitted to USCIS', class: 'pending' },
            'rfe_issued': { text: 'Request for Evidence (RFE)', class: 'action' },
            'pending_uscis_review': { text: 'Pending USCIS Decision', class: 'pending' },
            'approved': { text: 'Case Approved', class: 'good' },
            'denied': { text: 'Case Denied', class: 'action' },
            'consular_processing': { text: 'Consular Processing', class: 'info' },
            'action_required': { text: 'Action Required', class: 'action' },
            'complete': { text: 'Process Complete', class: 'good' }
        };
        return statuses[statusKey] || { text: 'Status Unavailable', class: 'default' };
    }

    function updateStatusIcon(iconElement, statusClass) {
        if (!iconElement) return;
        iconElement.className = 'status-icon-large-desktop'; // Use desktop class
        let iconClassFA = 'fa-question-circle';
        switch (statusClass) {
            case 'info': iconClassFA = 'fa-info-circle'; break;
            case 'pending': iconClassFA = 'fa-hourglass-half'; break;
            case 'good': iconClassFA = 'fa-check-circle'; break;
            case 'action': iconClassFA = 'fa-triangle-exclamation'; break;
            case 'default': iconClassFA = 'fa-circle-question'; break;
        }
        iconElement.classList.add(`status-${statusClass}`);
        iconElement.innerHTML = `<i class="fa-solid ${iconClassFA}"></i>`;
    }

    // --- Populating Sections ---
    function populateActionItems(actions) {
        if (!DOM.actionItemsListDesktop || !DOM.actionRequiredSectionDesktop) return;
        DOM.actionItemsListDesktop.innerHTML = '';
        const relevantActions = actions || [];

        if (relevantActions.length > 0) {
            relevantActions.forEach(action => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'action-item-desktop'; // Use desktop class

                const descP = document.createElement('p');
                // Bolding the action type itself for emphasis
                descP.innerHTML = `<strong>${getActionTitle(action.type)}:</strong> ${action.description || 'Details unavailable.'}`;

                const actionButton = document.createElement('button');
                actionButton.className = 'cta-button-desktop secondary small-cta'; // Use desktop classes
                actionButton.textContent = getActionButtonText(action.type);
                // Add data attributes for handling clicks
                actionButton.dataset.action = action.type;
                if (action.docId) actionButton.dataset.docId = action.docId;
                if (action.invoiceId) actionButton.dataset.invoiceId = action.invoiceId;
                if (action.uploadId) actionButton.dataset.uploadId = action.uploadId;
                if (action.requiresAgreement) actionButton.dataset.requiresAgreement = 'true';

                itemDiv.appendChild(descP);
                itemDiv.appendChild(actionButton);
                DOM.actionItemsListDesktop.appendChild(itemDiv);
            });
            DOM.actionRequiredSectionDesktop.style.display = 'block';
        } else {
            DOM.actionRequiredSectionDesktop.style.display = 'none';
        }
    }

     function getActionTitle(type) { // Same as mobile
        switch (type) {
            case 'signature': return 'Signature Needed';
            case 'payment': return 'Payment Due';
            case 'information': return 'Information Required';
            case 'upload': return 'Document Upload Needed';
            default: return 'Action Needed';
        }
    }
     function getActionButtonText(type) { // Same as mobile
        switch (type) {
            case 'signature': return 'Review & Sign';
            case 'payment': return 'Make Payment';
            case 'information': return 'Provide Info';
            case 'upload': return 'Upload';
            default: return 'View';
        }
    }

    function updatePaymentSection(state) {
        if (!DOM.paymentSummaryDesktop) return;
        // Hide all content divs initially
        DOM.paymentLoadingDivDesktop.style.display = 'none';
        DOM.paymentPaidDivDesktop.style.display = 'none';
        DOM.paymentDueDivDesktop.style.display = 'none';
        DOM.paymentErrorDivDesktop.style.display = 'none';
        DOM.paymentAgreementNoticeDesktop.style.display = 'none';
        DOM.signAgreementBtnDesktop.style.display = 'none';

        switch (state.paymentStatus) {
            case 'paid':
                if (DOM.lastPaymentDateDesktop) DOM.lastPaymentDateDesktop.textContent = formatDate(state.lastPayment?.date);
                if (DOM.lastPaymentAmountDesktop) DOM.lastPaymentAmountDesktop.textContent = formatCurrency(state.lastPayment?.amount);
                if (DOM.viewReceiptsPaidDesktop) DOM.viewReceiptsPaidDesktop.dataset.url = state.receiptHistoryUrl || '#';
                DOM.paymentPaidDivDesktop.style.display = 'block';
                break;
            case 'due':
                if (DOM.nextPaymentAmountDesktop) DOM.nextPaymentAmountDesktop.textContent = formatCurrency(state.nextPayment?.amount);
                if (DOM.paymentDueDateDesktop) DOM.paymentDueDateDesktop.textContent = formatDate(state.nextPayment?.dueDate);
                if (DOM.viewReceiptsDueDesktop) DOM.viewReceiptsDueDesktop.dataset.url = state.receiptHistoryUrl || '#';
                if (DOM.makePaymentButtonMainDesktop) DOM.makePaymentButtonMainDesktop.dataset.invoiceId = state.nextPayment?.invoiceId || '';

                const paymentAction = state.actionsRequired.find(a => a.type === 'payment' && a.invoiceId === state.nextPayment?.invoiceId);
                const needsSigning = paymentAction?.requiresAgreement && !state.feeAgreementSigned;

                if (needsSigning) {
                    DOM.paymentAgreementNoticeDesktop.style.display = 'inline-flex'; // Show notice
                    DOM.signAgreementBtnDesktop.style.display = 'inline-block'; // Show sign button
                    DOM.makePaymentButtonMainDesktop.disabled = true;
                    DOM.makePaymentButtonMainDesktop.style.opacity = '0.6';
                    DOM.makePaymentButtonMainDesktop.style.cursor = 'not-allowed';
                    if (DOM.feeAgreementLinkDesktop) DOM.feeAgreementLinkDesktop.href = state.feeAgreementUrl || '#';
                } else {
                    DOM.makePaymentButtonMainDesktop.disabled = false;
                    DOM.makePaymentButtonMainDesktop.style.opacity = '1';
                    DOM.makePaymentButtonMainDesktop.style.cursor = 'pointer';
                    // Optionally show agreement link even if signed
                    if (paymentAction?.requiresAgreement && state.feeAgreementSigned) {
                        DOM.paymentAgreementNoticeDesktop.style.display = 'inline-flex';
                        if (DOM.feeAgreementLinkDesktop) DOM.feeAgreementLinkDesktop.href = state.feeAgreementUrl || '#';
                    }
                }
                DOM.paymentDueDivDesktop.style.display = 'block';
                break;
             case 'error':
                 DOM.paymentErrorDivDesktop.style.display = 'block';
                 break;
            default:
                DOM.paymentLoadingDivDesktop.style.display = 'flex';
        }
    }

    // --- Main Dashboard Population ---
    function populateDashboard(data) {
        if (!data) { console.error("Data missing for dashboard population!"); return; }

        // Sidebar & Header Badges/Info
        if (DOM.clientNameSidebar) DOM.clientNameSidebar.textContent = data.clientName || 'Valued Client';
        updateBadge(DOM.inboxBadgeSidebar, data.unreadMessages);
        updateBadge(DOM.notificationsBadgeDesktop, data.unreadNotifications);
        updateBadge(DOM.messagesQuickBadgeDesktop, data.unreadMessages); // For quick link

        // Action Required Banner
        populateActionItems(data.actionsRequired);

        // Case Status Card
        const statusInfo = getStatusTextAndClass(data.caseStatus);
        if (DOM.caseStatusTextDetailedDesktop) DOM.caseStatusTextDetailedDesktop.textContent = statusInfo.text;
        if (DOM.caseStatusIconDesktop) updateStatusIcon(DOM.caseStatusIconDesktop, statusInfo.class);
        const progress = Math.max(0, Math.min(100, data.caseProgressPercent || 0));
        if (DOM.progressBarInnerDesktop) DOM.progressBarInnerDesktop.style.width = `${progress}%`;
        if (DOM.progressPercentageDesktop) DOM.progressPercentageDesktop.textContent = `${progress}%`;
        if (DOM.estimatedCompletionDesktop) DOM.estimatedCompletionDesktop.textContent = data.estimatedCompletion || 'TBD';
        if (DOM.visaTypeDesktop) DOM.visaTypeDesktop.textContent = data.visaType || 'H-2A/B';
        if (DOM.viewCaseDetailsBtnDesktop) DOM.viewCaseDetailsBtnDesktop.dataset.url = data.caseDetailsUrl || '#'; // URL used by modal opener

        // Payment Card
        updatePaymentSection(data);

        // Setup Quick Access Links (hrefs)
        if (DOM.documentsLinkDesktop) DOM.documentsLinkDesktop.href = data.documentsUrl || '#';
        if (DOM.messagesLinkDesktop) DOM.messagesLinkDesktop.href = data.messagesUrl || '#';
        if (DOM.resourcesLinkDesktop) DOM.resourcesLinkDesktop.href = data.resourcesUrl || '#';
        if (DOM.profileLinkDesktop) DOM.profileLinkDesktop.href = data.profileUrl || '#';

        // Set initial page title
        if (DOM.pageTitleDesktop) DOM.pageTitleDesktop.textContent = 'Dashboard Overview'; // Default title

        // Initial setup of listeners (important after elements are populated)
        setupActionListeners(data);
        setupSidebarNavigation();
        setupModalLogic(data); // Setup modal logic here
    }

    // --- Event Listeners & Navigation ---
    function setupActionListeners(state) {
        const addClickListenerOnce = (element, handler) => { // Prevent multiple listeners
            if (element && !element.hasAttribute('data-listener-set')) {
                element.addEventListener('click', handler);
                element.setAttribute('data-listener-set', 'true');
            }
        };

        // Buttons inside cards/sections
        addClickListenerOnce(DOM.notificationsButtonDesktop, () => alert('Notifications Panel (Desktop Placeholder)'));
        addClickListenerOnce(DOM.logoutButtonSidebar, () => {
             if (confirm('Are you sure you want to logout?')) { window.location.href = state.logoutUrl || '/'; }
        });
        addClickListenerOnce(DOM.makePaymentButtonMainDesktop, (e) => {
             if (e.target.disabled) return;
             initiatePayment(e.target.dataset.invoiceId);
        });
        addClickListenerOnce(DOM.viewReceiptsPaidDesktop, (e) => navigateTo(e.target.dataset.url, 'Payment History'));
        addClickListenerOnce(DOM.viewReceiptsDueDesktop, (e) => navigateTo(e.target.dataset.url, 'Payment History'));
        addClickListenerOnce(DOM.signAgreementBtnDesktop, () => navigateTo(state.feeAgreementUrl, 'Fee Agreement'));
        addClickListenerOnce(DOM.retryPaymentLoadDesktop, () => {
             if(DOM.paymentErrorDivDesktop) DOM.paymentErrorDivDesktop.style.display = 'none';
             if(DOM.paymentLoadingDivDesktop) DOM.paymentLoadingDivDesktop.style.display = 'flex';
             fetchDashboardData(); // Simulate refetch
         });

         // Quick Access Links (using navigation function)
         addClickListenerOnce(DOM.documentsLinkDesktop, (e) => { e.preventDefault(); navigateTo(state.documentsUrl, 'Documents'); });
         addClickListenerOnce(DOM.messagesLinkDesktop, (e) => { e.preventDefault(); navigateTo(state.messagesUrl, 'Messages'); });
         addClickListenerOnce(DOM.resourcesLinkDesktop, (e) => { e.preventDefault(); navigateTo(state.resourcesUrl, 'Resources'); });
         addClickListenerOnce(DOM.profileLinkDesktop, (e) => { e.preventDefault(); navigateTo(state.profileUrl, 'Profile'); });


        // Event delegation for dynamically added action items
        if (DOM.actionItemsListDesktop && !DOM.actionItemsListDesktop.hasAttribute('data-listener-set')) {
            DOM.actionItemsListDesktop.addEventListener('click', (event) => {
                const button = event.target.closest('.cta-button-desktop'); // Target desktop button class
                if (button && button.dataset.action) {
                    handleActionItemClick(button.dataset);
                }
            });
            DOM.actionItemsListDesktop.setAttribute('data-listener-set', 'true');
        }
    }

    function setupSidebarNavigation() {
        DOM.sidebarNavLinks.forEach(link => {
            if (!link.hasAttribute('data-listener-set')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();

                    const targetId = link.dataset.target;
                    const targetSection = document.getElementById(targetId);
                    const pageTitle = link.querySelector('span')?.textContent || 'Section';

                    // Update active link
                    DOM.sidebarNavLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');

                    // Show target section, hide others
                    DOM.allContentSections.forEach(section => {
                        section.classList.remove('active');
                    });
                    if (targetSection) {
                        targetSection.classList.add('active');
                        // Trigger animation maybe?
                    } else {
                        // Handle case where target section doesn't exist yet (e.g., load dynamically)
                        // For now, show the main dashboard overview if target is missing
                        document.getElementById('dashboard-overview').classList.add('active');
                        console.warn(`Target section #${targetId} not found. Showing Dashboard.`);
                         // Potentially load content dynamically here via fetch
                         alert(`Placeholder: Load content for "${pageTitle}" into section #${targetId}`);
                    }

                    // Update header title
                    if (DOM.pageTitleDesktop) DOM.pageTitleDesktop.textContent = pageTitle;

                    // Scroll to top of content area
                    if(DOM.contentArea) DOM.contentArea.scrollTo(0, 0);
                });
                link.setAttribute('data-listener-set', 'true');
            }
        });
    }


    function handleActionItemClick(dataset) { // Same logic as mobile
        const { action, docId, invoiceId, uploadId, requiresAgreement } = dataset;
        switch (action) {
            case 'payment':
                initiatePayment(invoiceId, requiresAgreement === 'true');
                break;
            case 'signature':
                navigateTo(`#/documents/sign/${docId}`, `Sign Document ${docId}`);
                break;
            case 'information':
                 navigateTo(`#/forms/provide/${uploadId || 'info'}`, `Provide Information ${uploadId || ''}`);
                break;
            case 'upload':
                navigateTo(`#/documents/upload/${uploadId}`, `Upload Document ${uploadId}`);
                break;
            default:
                console.warn(`Unhandled action: ${action}`);
                alert(`Action: ${action} (Placeholder)`);
        }
    }

    function navigateTo(url, targetDescription) { // Basic navigation handler
        console.log(`Navigating to ${targetDescription} at ${url}`);
        if (url && url.startsWith('#/')) { // Simulate SPA routing or section loading
            const sectionId = url.substring(2).split('/')[0] + '-section'; // e.g., #/documents -> documents-section
            const targetLink = document.querySelector(`.nav-link[data-target='${sectionId}']`) || document.querySelector(`.nav-link[href='${url.split('/')[0]}']`); // Find corresponding sidebar link
            if (targetLink) {
                targetLink.click(); // Simulate clicking the sidebar link
            } else {
                 alert(`Placeholder Navigation to: ${targetDescription} (${url})`);
            }
        } else if (url && url.startsWith('#')) {
            // Could be used for scrolling or simple hash changes
            alert(`Placeholder Hash Navigation: ${targetDescription} (${url})`);
        } else if (url) { // External or full page load
            alert(`Opening external link or page: ${targetDescription} (URL: ${url})`);
            // window.location.href = url; // Uncomment for actual redirection
        } else {
            alert(`${targetDescription} navigation URL not configured.`);
        }
    }

    function initiatePayment(invoiceId, requiresAgreement = false) { // Same logic as mobile, potentially different UI feedback
        if (!invoiceId) {
            alert('Error: Invoice ID missing for payment.');
            return;
        }
        if (requiresAgreement && !AppState.feeAgreementSigned) {
             alert('Please review and sign the Fee Agreement before proceeding with payment.');
             // Maybe add visual cue on desktop too
             if(DOM.signAgreementBtnDesktop) {
                 DOM.signAgreementBtnDesktop.focus(); // Bring focus to the button
                 DOM.signAgreementBtnDesktop.style.outline = '2px solid var(--color-primary-accent)';
                 setTimeout(() => { if(DOM.signAgreementBtnDesktop) DOM.signAgreementBtnDesktop.style.outline = 'none'; }, 3000);
             }
             return;
        }
        // Simulate redirecting to a payment page
        const paymentUrl = `#/payments/pay/${invoiceId}`; // Example SPA route
        alert(`Redirecting to payment page for Invoice: ${invoiceId} (Placeholder URL: ${paymentUrl})`);
        navigateTo(paymentUrl, `Payment for ${invoiceId}`);
    }


    // --- Case Details Modal Logic (Integrated) ---
    const H2VisaStepsDesktop = { // Same steps definition as mobile, possibly more detail
        'initial_review': [ { name: 'Initial Consultation', status: 'complete', details: 'Discussed case requirements and strategy.' }, { name: 'Document Collection', status: 'complete', details: 'Received initial business and job offer documents.' }, { name: 'Firm Review & Analysis', status: 'in-progress', details: 'Our team is reviewing your submitted information for eligibility.' }, { name: 'Fee Agreement Sent', status: 'pending', details: 'Awaiting signed agreement and initial payment.' }, { name: 'LCA Preparation', status: 'pending', details: 'Will commence upon receipt of signed agreement/payment.' } ],
        'submitted_lca': [ { name: 'Initial Review & Fee Agreement', status: 'complete', details: 'Agreement signed and initial payment received.' }, { name: 'LCA Preparation (ETA 9035)', status: 'complete', details: 'Labor Condition Application prepared based on job offer.' }, { name: 'LCA Submitted to DOL', status: 'in-progress', details: 'Waiting for Department of Labor processing via FLAG system.' }, { name: 'Begin Recruitment (H-2A/B specific)', status: 'pending', details: 'Advertising and U.S. worker recruitment efforts start.' }, { name: 'Petition Preparation (I-129)', status: 'pending', details: 'Will prepare concurrently or upon LCA certification.' } ],
        'pending_dol': [ { name: 'LCA Submitted to DOL', status: 'complete', details: 'Submitted on [Date Placeholder] via FLAG.' }, { name: 'DOL Review Period', status: 'in-progress', details: 'Currently under standard review by the Department of Labor.' }, { name: 'Recruitment Efforts', status: 'in-progress', details: 'Ongoing required advertising and recruitment activities.' }, { name: 'Petition Preparation (I-129)', status: 'pending', details: 'Preparing supporting documents.' }, { name: 'Await DOL Certification', status: 'pending', details: 'Decision expected within standard processing times.' } ],
        'dol_certified': [ { name: 'DOL Certification Received', status: 'complete', details: 'Certified LCA received on [Date Placeholder].' }, { name: 'Recruitment Report Finalized', status: 'complete', details: 'Documented results of U.S. worker recruitment.' }, { name: 'Petition Preparation (I-129)', status: 'in-progress', details: 'Finalizing Form I-129 and supporting evidence package.' }, { name: 'Submit Petition to USCIS', status: 'pending', details: 'Ready for filing with appropriate USCIS service center.' } ],
        'submitted_uscis': [ { name: 'DOL Certification Received', status: 'complete', details: '' }, { name: 'Petition Preparation (I-129)', status: 'complete', details: 'Form I-129 package assembled and reviewed.' }, { name: 'Petition Submitted to USCIS', status: 'in-progress', details: 'Filed on [Date Placeholder]. Awaiting Receipt Notice.' }, { name: 'USCIS Processing Begins', status: 'pending', details: 'Case enters USCIS queue.' } ],
        'pending_uscis_review': [ { name: 'Petition Submitted to USCIS', status: 'complete', details: 'Receipt Notice #: [Placeholder]' }, { name: 'USCIS Adjudication', status: 'in-progress', details: 'Petition is under review by a USCIS officer.' }, { name: 'Await USCIS Decision', status: 'pending', details: 'Monitoring case status for updates.' } ],
        'rfe_issued': [ { name: 'Petition Submitted to USCIS', status: 'complete', details: 'Receipt Notice #: [Placeholder]' }, { name: 'Request for Evidence (RFE) Issued', status: 'action', details: 'USCIS requires additional information/documents by deadline.' }, { name: 'Prepare RFE Response', status: 'in-progress', details: 'Gathering and preparing requested items. Deadline: [Date Placeholder]' }, { name: 'Submit RFE Response', status: 'pending', details: 'Response will be filed upon completion.' } ],
        'approved': [ { name: 'DOL Certification', status: 'complete', details: '' }, { name: 'USCIS Petition Filing & Review', status: 'complete', details: '(Including RFE response, if applicable)' }, { name: 'USCIS Approval Received', status: 'complete', details: 'Approval Notice (I-797) issued. Valid Dates: [Start Date] - [End Date]' }, { name: 'Consular Processing / Next Steps', status: 'in-progress', details: 'Notifying consulate; preparing workers for visa interview/entry.' } ],
        'denied': [ { name: 'DOL/USCIS Review Complete', status: 'complete', details: '' }, { name: 'Case Denied', status: 'action', details: 'Received denial notice. Reviewing options (Appeal/Motion/Refile).' }, { name: 'Consultation on Options', status: 'pending', details: 'Will schedule call to discuss next steps.' } ],
        'consular_processing': [ { name: 'USCIS Approval Received', status: 'complete', details: '' }, { name: 'Case Sent to NVC/Consulate', status: 'complete', details: 'National Visa Center or specific consulate notified.' }, { name: 'Worker(s) Prepare for Interview', status: 'in-progress', details: 'Workers schedule appointments, gather documents (DS-160 etc.).' }, { name: 'Visa Interview / Issuance', status: 'pending', details: 'Awaiting interview outcome and visa stamping.' } ],
        'complete': [ { name: 'DOL Certification', status: 'complete', details: '' }, { name: 'USCIS Approval', status: 'complete', details: '' }, { name: 'Consular Processing / Entry', status: 'complete', details: 'Worker(s) granted visa and entered U.S. or changed status.' }, { name: 'Case Concluded', status: 'complete', details: 'All primary stages completed successfully.' } ],
        'default': [ { name: 'Status Unavailable', status: 'pending', details: 'Detailed steps cannot be displayed currently. Please contact us.' } ]
    };

    function getStatusStepsDesktop(statusKey) {
        const currentStatus = AppState.caseStatus || statusKey || 'default';
        return H2VisaStepsDesktop[currentStatus] || H2VisaStepsDesktop['default'];
    }

    function renderStepsDesktop(steps) {
        if (!DOM.modalStepsListDesktop) return;
        DOM.modalStepsListDesktop.innerHTML = '';
        if (!steps || steps.length === 0) {
            DOM.modalStepsListDesktop.innerHTML = '<li class="step-item-desktop status-pending"><i class="fa-solid fa-circle-info step-icon-desktop"></i><span class="step-text-desktop">No detailed steps available.</span></li>';
            return;
        }
        steps.forEach(step => {
            const li = document.createElement('li');
            li.className = `step-item-desktop status-${step.status}`; // Use desktop class

            const iconSpan = document.createElement('span');
            iconSpan.className = 'step-icon-desktop'; // Use desktop class
            let iconClass = 'fa-circle-question';
            if (step.status === 'complete') iconClass = 'fa-circle-check';
            if (step.status === 'in-progress') iconClass = 'fa-spinner fa-spin';
            if (step.status === 'pending') iconClass = 'fa-circle';
            if (step.status === 'action') iconClass = 'fa-triangle-exclamation';
            iconSpan.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;

            const textSpan = document.createElement('span');
            textSpan.className = 'step-text-desktop'; // Use desktop class
            textSpan.textContent = step.name;

            let detailSpan = null;
            if (step.details) {
                detailSpan = document.createElement('span');
                detailSpan.className = 'step-details-desktop'; // Use desktop class
                detailSpan.textContent = step.details;
            }

            li.appendChild(iconSpan);
            li.appendChild(textSpan);
            if (detailSpan) li.appendChild(detailSpan);
            DOM.modalStepsListDesktop.appendChild(li);
        });
    }

    function openModalDesktop() {
        if (!DOM.modalDesktop) return;
        const currentStatusKey = AppState.caseStatus || 'default';
        const steps = getStatusStepsDesktop(currentStatusKey);
        renderStepsDesktop(steps);
        const statusText = currentStatusKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        if (DOM.modalTitleDesktop) DOM.modalTitleDesktop.textContent = `Detailed Case Steps (${statusText})`;
        DOM.modalDesktop.classList.add('visible');
        document.body.classList.add('modal-open-desktop');
    }

    function closeModalDesktop() {
        if (!DOM.modalDesktop) return;
        DOM.modalDesktop.classList.remove('visible');
        document.body.classList.remove('modal-open-desktop');
    }

    function setupModalLogic(state) {
        if (DOM.viewCaseDetailsBtnDesktop) {
            DOM.viewCaseDetailsBtnDesktop.addEventListener('click', openModalDesktop);
        } else { console.error("View Case Details Button not found for modal."); }

        if (DOM.modalCloseButtonDesktop) {
            DOM.modalCloseButtonDesktop.addEventListener('click', closeModalDesktop);
        } else { console.error("Modal Close Button not found."); }

        if (DOM.modalDesktop) {
            DOM.modalDesktop.addEventListener('click', (event) => {
                if (event.target === DOM.modalDesktop) { // Click on overlay background
                    closeModalDesktop();
                }
            });
        } else { console.error("Modal Overlay not found."); }

        // Close with Escape key listener (add only once)
        if (!document.body.hasAttribute('data-escape-listener-set')) {
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && DOM.modalDesktop?.classList.contains('visible')) {
                     closeModalDesktop();
                }
            });
            document.body.setAttribute('data-escape-listener-set', 'true');
        }
    }

    // --- Animations (Optional for Desktop) ---
    function setupScrollAnimations() {
        // Same Intersection Observer logic can be used if desired
         if (!('IntersectionObserver' in window) || DOM.elementsToAnimate.length === 0) {
             console.warn("IntersectionObserver not supported or no elements to animate.");
              // Make elements visible immediately if no animation
             DOM.elementsToAnimate.forEach(el => el.style.opacity = 1);
             return;
         }

         const observerOptions = { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 };
         const observerCallback = (entries, observer) => {
             entries.forEach((entry, index) => {
                 if (entry.isIntersecting) {
                     const element = entry.target;
                     // Use a different animation or simply make visible
                     // element.style.transitionDelay = `${index * 0.05}s`; // Faster stagger?
                     element.style.opacity = 1;
                     element.style.transform = 'translateY(0)';
                     observer.unobserve(element);
                 }
             });
         };
         const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
         DOM.elementsToAnimate.forEach(el => {
             // Set initial state for animation (if using CSS transitions)
             el.style.opacity = 0;
             el.style.transform = 'translateY(15px)';
             el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
             scrollObserver.observe(el);
         });
    }

    // --- Initial Fetch and Render ---
    function fetchDashboardData() {
        console.log("Fetching desktop dashboard data...");
        // Placeholder: Replace with actual API call
        // Show loading states if needed
        if(DOM.paymentLoadingDivDesktop) DOM.paymentLoadingDivDesktop.style.display = 'flex';

        setTimeout(() => { // Simulate network delay
            console.log("Received data (using mock data for desktop).");
            populateDashboard(AppState);
            setupScrollAnimations(); // Set up animations after initial data load
        }, 500); // Slightly faster simulation for desktop?
    }

    // --- Run Initialization ---
    fetchDashboardData();

}); // End DOMContentLoaded
