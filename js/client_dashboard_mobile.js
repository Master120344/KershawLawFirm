document.addEventListener('DOMContentLoaded', () => {

    const AppState = {
        clientName: "Example Employer LLC",
        visaType: "H-2B", // H-2A or H-2B
        caseId: "KLR-H2B-2025-001",
        caseStatus: "pending_dol",
        caseProgressPercent: 35,
        estimatedCompletion: "Q2 2025",
        paymentStatus: "due", // 'paid', 'due', 'error', 'signing_required'
        feeAgreementSigned: false,
        lastPayment: { date: "2025-01-15", amount: "2000.00" },
        nextPayment: { amount: "1500.00", dueDate: "2025-04-01", invoiceId: "invKLR789" },
        receiptHistoryUrl: "#/billing/history",
        feeAgreementUrl: "#/documents/fee-agreement",
        unreadMessages: 2,
        unreadNotifications: 1,
        actionsRequired: [
            { type: 'payment', description: 'Initial retainer fee due.', invoiceId: 'invKLR789', requiresAgreement: true },
            { type: 'information', description: 'Submit completed ETA Form 9142B.', uploadId: 'eta-9142b' }
        ],
        caseDetailsUrl: "#/case/details",
        documentsUrl: "#/documents",
        messagesUrl: "#/messaging",
        resourcesUrl: "#/resources",
        profileUrl: "#/profile",
        logoutUrl: "/logout" // Placeholder URL
    };

    const DOM = {
        clientNameWelcome: document.getElementById('client-name-welcome'),
        inboxButton: document.getElementById('inbox-button'),
        notificationsButton: document.getElementById('notifications-button'),
        logoutButton: document.getElementById('logout-button'),
        inboxBadge: document.getElementById('inbox-badge'),
        notificationsBadge: document.getElementById('notifications-badge'),
        messagesQuickBadge: document.getElementById('messages-quick-badge'),

        actionRequiredSection: document.getElementById('action-required-section'),
        actionItemsList: document.getElementById('action-items-list'),

        caseStatusIcon: document.getElementById('case-status-icon'),
        caseStatusTextDetailed: document.getElementById('case-status-text-detailed'),
        progressBarInner: document.getElementById('progress-bar-inner'),
        progressPercentageLabel: document.getElementById('progress-percentage'),
        estimatedCompletionSpan: document.getElementById('estimated-completion'),
        visaTypeSpan: document.getElementById('visa-type'),
        viewCaseDetailsBtn: document.getElementById('view-case-details-btn'),

        paymentSummary: document.getElementById('payment-summary'),
        paymentLoadingDiv: document.getElementById('payment-content-loading'),
        paymentPaidDiv: document.getElementById('payment-content-paid'),
        paymentDueDiv: document.getElementById('payment-content-due'),
        paymentErrorDiv: document.getElementById('payment-content-error'),
        lastPaymentDateSpan: document.getElementById('last-payment-date'),
        lastPaymentAmountSpan: document.getElementById('last-payment-amount'),
        nextPaymentAmountSpan: document.getElementById('next-payment-amount'),
        paymentDueDateSpan: document.getElementById('payment-due-date'),
        makePaymentButtonMain: document.getElementById('make-payment-button-main'),
        viewReceiptsPaidBtn: document.getElementById('view-receipts-paid'),
        viewReceiptsDueBtn: document.getElementById('view-receipts-due'),
        retryPaymentLoadButton: document.getElementById('retry-payment-load'),
        paymentAgreementNotice: document.getElementById('payment-agreement-notice'),
        feeAgreementLink: document.getElementById('fee-agreement-link'),
        signAgreementBtn: document.getElementById('sign-agreement-btn'),

        documentsLink: document.getElementById('documents-link'),
        messagesLink: document.getElementById('messages-link'),
        resourcesLink: document.getElementById('resources-link'),
        profileLink: document.getElementById('profile-link'),

        elementsToAnimate: document.querySelectorAll('.card-style, .quick-link-card')
    };

    function formatCurrency(amount) {
        if (amount === null || amount === undefined) return '$0.00';
        return `$${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    function formatDate(dateString) {
        if (!dateString) return '--/--/----';
        try {
            const date = new Date(dateString);
            const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000); // Adjust for UTC input
            return adjustedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch (e) {
            return dateString;
        }
    }

    function updateBadge(badgeElement, count) {
        if (!badgeElement) return;
        const numCount = parseInt(count, 10) || 0;
        if (numCount > 0) {
            badgeElement.textContent = numCount > 9 ? '9+' : numCount;
            badgeElement.style.display = 'flex';
        } else {
            badgeElement.style.display = 'none';
        }
    }

    function getStatusTextAndClass(statusKey) {
        const statuses = {
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
        iconElement.className = 'status-icon-large';
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

    function populateActionItems(actions) {
        if (!DOM.actionItemsList || !DOM.actionRequiredSection) return;
        DOM.actionItemsList.innerHTML = '';

        const relevantActions = actions || [];

        if (relevantActions.length > 0) {
            relevantActions.forEach(action => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'action-item';

                const descP = document.createElement('p');
                descP.innerHTML = `<strong>${getActionTitle(action.type)}:</strong> ${action.description || 'Details unavailable.'}`;
                itemDiv.appendChild(descP);

                const actionButton = document.createElement('button');
                actionButton.className = 'cta-button small-cta';
                actionButton.textContent = getActionButtonText(action.type);
                actionButton.dataset.action = action.type;
                if (action.docId) actionButton.dataset.docId = action.docId;
                if (action.invoiceId) actionButton.dataset.invoiceId = action.invoiceId;
                if (action.uploadId) actionButton.dataset.uploadId = action.uploadId;
                if (action.requiresAgreement) actionButton.dataset.requiresAgreement = 'true';
                itemDiv.appendChild(actionButton);

                DOM.actionItemsList.appendChild(itemDiv);
            });
            DOM.actionRequiredSection.style.display = 'block';
        } else {
            DOM.actionRequiredSection.style.display = 'none';
        }
    }

    function getActionTitle(type) {
        switch (type) {
            case 'signature': return 'Signature Needed';
            case 'payment': return 'Payment Due';
            case 'information': return 'Information Required';
            case 'upload': return 'Document Upload Needed';
            default: return 'Action Needed';
        }
    }

    function getActionButtonText(type) {
        switch (type) {
            case 'signature': return 'Review & Sign';
            case 'payment': return 'Make Payment';
            case 'information': return 'Provide Information';
            case 'upload': return 'Upload Document';
            default: return 'View Details';
        }
    }

    function updatePaymentSection(state) {
        DOM.paymentLoadingDiv.style.display = 'none';
        DOM.paymentPaidDiv.style.display = 'none';
        DOM.paymentDueDiv.style.display = 'none';
        DOM.paymentErrorDiv.style.display = 'none';
        DOM.paymentAgreementNotice.style.display = 'none'; // Hide agreement notice initially
        DOM.signAgreementBtn.style.display = 'none'; // Hide sign button initially

        switch (state.paymentStatus) {
            case 'paid':
                if (DOM.lastPaymentDateSpan) DOM.lastPaymentDateSpan.textContent = formatDate(state.lastPayment?.date);
                if (DOM.lastPaymentAmountSpan) DOM.lastPaymentAmountSpan.textContent = formatCurrency(state.lastPayment?.amount);
                if (DOM.viewReceiptsPaidBtn) DOM.viewReceiptsPaidBtn.dataset.url = state.receiptHistoryUrl || '#';
                DOM.paymentPaidDiv.style.display = 'block';
                break;
            case 'due':
                if (DOM.nextPaymentAmountSpan) DOM.nextPaymentAmountSpan.textContent = formatCurrency(state.nextPayment?.amount);
                if (DOM.paymentDueDateSpan) DOM.paymentDueDateSpan.textContent = formatDate(state.nextPayment?.dueDate);
                if (DOM.viewReceiptsDueBtn) DOM.viewReceiptsDueBtn.dataset.url = state.receiptHistoryUrl || '#';
                if (DOM.makePaymentButtonMain) DOM.makePaymentButtonMain.dataset.invoiceId = state.nextPayment?.invoiceId || '';

                // Check if agreement needs signing for THIS payment
                const paymentAction = state.actionsRequired.find(a => a.type === 'payment' && a.invoiceId === state.nextPayment?.invoiceId);
                const needsSigning = paymentAction?.requiresAgreement && !state.feeAgreementSigned;

                if (needsSigning) {
                    DOM.paymentAgreementNotice.style.display = 'block';
                    DOM.signAgreementBtn.style.display = 'block';
                    DOM.makePaymentButtonMain.disabled = true; // Disable Pay Now until signed
                    DOM.makePaymentButtonMain.style.opacity = '0.6';
                    DOM.makePaymentButtonMain.style.cursor = 'not-allowed';
                    if (DOM.feeAgreementLink) DOM.feeAgreementLink.href = state.feeAgreementUrl || '#';
                } else {
                    DOM.makePaymentButtonMain.disabled = false;
                    DOM.makePaymentButtonMain.style.opacity = '1';
                    DOM.makePaymentButtonMain.style.cursor = 'pointer';
                    // Keep notice visible but hide sign button if already signed
                    if (paymentAction?.requiresAgreement && state.feeAgreementSigned) {
                        DOM.paymentAgreementNotice.style.display = 'block';
                        if (DOM.feeAgreementLink) DOM.feeAgreementLink.href = state.feeAgreementUrl || '#';
                    }
                 }

                DOM.paymentDueDiv.style.display = 'block';
                break;
             case 'error':
                 DOM.paymentErrorDiv.style.display = 'block';
                 break;
            default:
                DOM.paymentLoadingDiv.style.display = 'flex';
        }
    }

    function setupActionListeners(state) {
        const addClickListenerOnce = (element, handler) => {
            if (element && !element.hasAttribute('data-listener-set')) {
                element.addEventListener('click', handler);
                element.setAttribute('data-listener-set', 'true');
            }
        };

        addClickListenerOnce(DOM.inboxButton, () => navigateTo(state.messagesUrl, 'Inbox'));
        addClickListenerOnce(DOM.notificationsButton, () => alert('Notifications Panel (Placeholder)')); // Placeholder for dropdown/modal
        addClickListenerOnce(DOM.logoutButton, () => {
            if (confirm('Are you sure you want to logout?')) {
                window.location.href = state.logoutUrl || '/';
            }
        });

        addClickListenerOnce(DOM.viewCaseDetailsBtn, () => navigateTo(state.caseDetailsUrl, 'Case Details'));
        addClickListenerOnce(DOM.makePaymentButtonMain, (e) => {
             if (e.target.disabled) return;
             initiatePayment(e.target.dataset.invoiceId);
        });
        addClickListenerOnce(DOM.viewReceiptsPaidBtn, (e) => navigateTo(e.target.dataset.url, 'Payment History'));
        addClickListenerOnce(DOM.viewReceiptsDueBtn, (e) => navigateTo(e.target.dataset.url, 'Payment History'));
        addClickListenerOnce(DOM.signAgreementBtn, () => navigateTo(state.feeAgreementUrl, 'Fee Agreement'));

        addClickListenerOnce(DOM.retryPaymentLoadButton, () => {
             DOM.paymentErrorDiv.style.display = 'none';
             DOM.paymentLoadingDiv.style.display = 'flex';
             fetchDashboardData(); // Simulate refetch
         });

        addClickListenerOnce(DOM.documentsLink, (e) => { e.preventDefault(); navigateTo(state.documentsUrl, 'Documents'); });
        addClickListenerOnce(DOM.messagesLink, (e) => { e.preventDefault(); navigateTo(state.messagesUrl, 'Messages'); });
        addClickListenerOnce(DOM.resourcesLink, (e) => { e.preventDefault(); navigateTo(state.resourcesUrl, 'Resources'); });
        addClickListenerOnce(DOM.profileLink, (e) => { e.preventDefault(); navigateTo(state.profileUrl, 'Profile'); });

        if (DOM.actionItemsList && !DOM.actionItemsList.hasAttribute('data-listener-set')) {
            DOM.actionItemsList.addEventListener('click', (event) => {
                const button = event.target.closest('.cta-button');
                if (button) {
                    handleActionItemClick(button.dataset);
                }
            });
            DOM.actionItemsList.setAttribute('data-listener-set', 'true');
        }
    }

    function handleActionItemClick(dataset) {
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
                alert(`Unknown action: ${action}`);
        }
    }

    function navigateTo(url, targetDescription) {
        // Placeholder: In a real SPA, this would use a router. For now, alert or change hash.
        console.log(`Navigating to ${targetDescription} at ${url}`);
        if (url && url.startsWith('#')) {
             // Simulate SPA navigation or scroll
             alert(`Navigating to ${targetDescription} section/page (Placeholder: ${url})`);
             // Or window.location.hash = url;
        } else if (url) {
             // Simulate navigating to a different page
             alert(`Opening ${targetDescription} (Placeholder URL: ${url})`);
             // Or window.location.href = url;
        } else {
             alert(`${targetDescription} URL not configured.`);
        }
    }

    function initiatePayment(invoiceId, requiresAgreement = false) {
        if (!invoiceId) {
            alert('Error: Invoice ID missing for payment.');
            return;
        }
        if (requiresAgreement && !AppState.feeAgreementSigned) {
             alert('Please review and sign the Fee Agreement before proceeding with payment.');
             // Highlight the sign button or agreement notice
             if(DOM.signAgreementBtn) {
                 DOM.signAgreementBtn.style.outline = '2px solid var(--color-primary-accent)';
                 setTimeout(() => { DOM.signAgreementBtn.style.outline = 'none'; }, 2000);
             }
             return;
        }
        alert(`Initiating payment process for Invoice: ${invoiceId} (Placeholder)`);
        // Integrate with actual payment gateway here
    }

    function setupScrollAnimations() {
        if (!('IntersectionObserver' in window)) {
            console.warn("IntersectionObserver not supported, animations disabled.");
            DOM.elementsToAnimate.forEach(el => el.style.opacity = 1);
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        const observerCallback = (entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const delay = element.dataset.animationOrder || index;
                    element.style.transitionDelay = `${delay * 0.08}s`;
                    element.classList.add('is-visible');
                    observer.unobserve(element);
                }
            });
        };

        const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
        DOM.elementsToAnimate.forEach((el, index) => {
             el.dataset.animationOrder = index; // Assign order for consistent delay
             scrollObserver.observe(el);
        });
    }

    function populateDashboard(data) {
        if (!data) { console.error("Data missing for dashboard population!"); return; }

        // Welcome & Badges
        if (DOM.clientNameWelcome) DOM.clientNameWelcome.textContent = `Welcome, ${data.clientName || 'Valued Client'}`;
        updateBadge(DOM.inboxBadge, data.unreadMessages);
        updateBadge(DOM.notificationsBadge, data.unreadNotifications);
        updateBadge(DOM.messagesQuickBadge, data.unreadMessages);

        // Case Status Section
        const statusInfo = getStatusTextAndClass(data.caseStatus);
        if (DOM.caseStatusTextDetailed) DOM.caseStatusTextDetailed.textContent = statusInfo.text;
        if (DOM.caseStatusIcon) updateStatusIcon(DOM.caseStatusIcon, statusInfo.class);
        const progress = Math.max(0, Math.min(100, data.caseProgressPercent || 0));
        if (DOM.progressBarInner) DOM.progressBarInner.style.width = `${progress}%`;
        if (DOM.progressPercentageLabel) DOM.progressPercentageLabel.textContent = `${progress}%`;
        if (DOM.estimatedCompletionSpan) DOM.estimatedCompletionSpan.textContent = data.estimatedCompletion || 'TBD';
        if (DOM.visaTypeSpan) DOM.visaTypeSpan.textContent = data.visaType || 'H-2A/B';
        if (DOM.viewCaseDetailsBtn) DOM.viewCaseDetailsBtn.dataset.url = data.caseDetailsUrl || '#';

        // Action Required Section
        populateActionItems(data.actionsRequired);

        // Payment Section
        updatePaymentSection(data);

        // Setup Links
        if (DOM.documentsLink) DOM.documentsLink.href = data.documentsUrl || '#';
        if (DOM.messagesLink) DOM.messagesLink.href = data.messagesUrl || '#';
        if (DOM.resourcesLink) DOM.resourcesLink.href = data.resourcesUrl || '#';
        if (DOM.profileLink) DOM.profileLink.href = data.profileUrl || '#';

        // Setup Listeners (ensure this runs after elements are populated)
        setupActionListeners(data);
    }

    function fetchDashboardData() {
        // Placeholder: Replace with actual API call
        console.log("Fetching dashboard data...");
        // Simulate network delay
        DOM.paymentLoadingDiv.style.display = 'flex'; // Show loading specifically for payment too
        setTimeout(() => {
             console.log("Received data (using mock data).");
             populateDashboard(AppState);
             // Re-run animations setup if needed, though usually done once
        }, 800); // Simulate 0.8 second fetch time
    }

    // --- Initialization ---
    fetchDashboardData(); // Initial load
    setupScrollAnimations(); // Setup animations once on load

});