// ========================================================================
// DocuSign Generator Logic (docusign_desktop.js)
// Executes when the documents-content section is potentially active.
// ========================================================================
(function() { // IIFE to encapsulate scope

    console.log("DocuSign JS Module Loaded");

    // --- Element Selectors (Scoped to potentially active section) ---
    const docSection = document.getElementById('documents-content');
    if (!docSection) {
        // console.warn("DocuSign section not found in DOM (yet?).");
        return; // Exit if the main container isn't found
    }

    const form = docSection.querySelector('#docusign-generator-form');
    const generateBtn = docSection.querySelector('#generate-preview-btn');
    const previewPanel = docSection.querySelector('#preview-panel');
    const previewArea = docSection.querySelector('#document-preview-area');
    const closePreviewBtn = docSection.querySelector('#close-preview-btn');
    const sendBtn = docSection.querySelector('#send-email-btn');
    const downloadBtn = docSection.querySelector('#download-pdf-btn');
    const pendingList = docSection.querySelector('#pending-signatures-list');
    const noPendingMsg = pendingList ? pendingList.querySelector('.no-pending') : null;

    // Input Fields
    const clientFirstNameInput = docSection.querySelector('#client-first-name');
    const clientLastNameInput = docSection.querySelector('#client-last-name');
    const clientEmailInput = docSection.querySelector('#client-email');
    const clientPhoneInput = docSection.querySelector('#client-phone');
    const caseIdInput = docSection.querySelector('#case-id');
    const visaTypeSelect = docSection.querySelector('#visa-type');
    const employerNameInput = docSection.querySelector('#employer-name');
    const legalFeeInput = docSection.querySelector('#legal-fee');
    const filingFeeInput = docSection.querySelector('#filing-fee');
    const paymentTermsInput = docSection.querySelector('#payment-terms');

    let currentPreviewData = null; // Store data used for preview

    // --- Utility Functions ---
    function formatCurrency(amount) {
        const num = parseFloat(amount);
        if (isNaN(num)) {
            return "$0.00";
        }
        return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    function updatePendingListVisibility() {
        if (!pendingList || !noPendingMsg) return;
        const items = pendingList.querySelectorAll('li:not(.no-pending)');
        noPendingMsg.style.display = items.length === 0 ? 'list-item' : 'none';
    }

    // --- Core Logic ---

    function generatePreviewContent(data) {
        // Basic validation (can be expanded)
        if (!data.clientFirstName || !data.clientLastName || !data.clientEmail || !data.visaType || !data.employerName || !data.legalFee || !data.paymentTerms) {
            alert("Please fill in all required fields.");
            return null; // Indicate failure
        }

        // --- Simple Text-Based Template ---
        // NOTE: This is NOT legally binding. It's a basic placeholder.
        // Real agreements need proper legal language.
        const previewText = `
KERSHAW LAW FIRM P.C. - PRELIMINARY AGREEMENT OUTLINE

Date: ${new Date().toLocaleDateString()}

Client Name: ${data.clientFirstName} ${data.clientLastName}
Client Email: ${data.clientEmail}
${data.clientPhone ? `Client Phone: ${data.clientPhone}` : ''}

Employer: ${data.employerName}
Case Type: ${data.visaType} Visa Services ${data.caseId ? `(Ref: ${data.caseId})` : ''}

--------------------------------------------------
SCOPE & FEES
--------------------------------------------------

Legal Fee: ${formatCurrency(data.legalFee)}
Estimated Filing Fees: ${data.filingFee ? formatCurrency(data.filingFee) : 'TBD'}
Total Estimated: ${formatCurrency(parseFloat(data.legalFee || 0) + parseFloat(data.filingFee || 0))}

Payment Terms & Scope of Representation:
${data.paymentTerms}

--------------------------------------------------
NEXT STEPS
--------------------------------------------------

This outline summarizes the key terms discussed. A formal Retainer Agreement will be sent via DocuSign to the email address provided (${data.clientEmail}) for electronic signature upon your confirmation.

Please review the details above. Clicking "Send for Signature" will initiate the eSignature process using a standardized template based on these inputs.

--- End of Preview ---
        `;
        return previewText.trim();
    }

    function showPreview(content, formData) {
        if (!previewPanel || !previewArea || !sendBtn || !downloadBtn) return;
        previewArea.textContent = content;
        previewPanel.style.display = 'flex'; // Or 'block', depending on CSS
        sendBtn.disabled = false;
        downloadBtn.disabled = false;
        currentPreviewData = formData; // Store the data used for this preview

        // Scroll preview panel into view if needed (especially on smaller screens)
        previewPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function hidePreview() {
        if (!previewPanel || !sendBtn || !downloadBtn) return;
        previewPanel.style.display = 'none';
        sendBtn.disabled = true;
        downloadBtn.disabled = true;
        previewArea.textContent = 'Preview will appear here...';
        currentPreviewData = null;
    }

    function handleFormSubmit(event) {
        event.preventDefault(); // Prevent actual form submission
        console.log("Generate Preview clicked");

        if (!form) return;

        const formData = {
            clientFirstName: clientFirstNameInput?.value.trim(),
            clientLastName: clientLastNameInput?.value.trim(),
            clientEmail: clientEmailInput?.value.trim(),
            clientPhone: clientPhoneInput?.value.trim(),
            caseId: caseIdInput?.value.trim(),
            visaType: visaTypeSelect?.value,
            employerName: employerNameInput?.value.trim(),
            legalFee: legalFeeInput?.value,
            filingFee: filingFeeInput?.value,
            paymentTerms: paymentTermsInput?.value.trim()
        };

        const previewContent = generatePreviewContent(formData);

        if (previewContent) {
            showPreview(previewContent, formData);
        } else {
            // Handle validation error feedback if needed
            console.error("Preview generation failed due to missing required fields.");
        }
    }

    function handleSendClick() {
        if (!currentPreviewData) {
            alert("No preview generated to send.");
            return;
        }
        console.log("Simulating Send for Signature:", currentPreviewData);

        // ** SIMULATION **
        // In a real app, this would trigger a backend API call to DocuSign
        alert(`Simulation:\nSending agreement for ${currentPreviewData.clientFirstName} ${currentPreviewData.clientLastName} (${currentPreviewData.visaType}) to ${currentPreviewData.clientEmail}.`);

        // Add to pending list (basic example)
        if (pendingList) {
             const newLi = document.createElement('li');
             newLi.dataset.id = `req-${Date.now()}`; // Simple unique ID
             newLi.innerHTML = `
                <span class="pending-name">${currentPreviewData.clientFirstName} ${currentPreviewData.clientLastName} (${currentPreviewData.visaType} Agreement)</span>
                <span class="pending-status pending">Sent: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <button class="icon-button subtle tiny" title="Resend">🔁</button>
             `;
             // Add listener for the new resend button if needed
             pendingList.appendChild(newLi);
             updatePendingListVisibility(); // Hide the 'no pending' message
        }

        // Optionally clear form or hide preview after sending
        hidePreview();
        // form.reset(); // Uncomment to clear the form after sending
    }

    function handleDownloadClick() {
         if (!currentPreviewData) {
            alert("No preview generated to download.");
            return;
        }
        console.log("Simulating PDF Download:", currentPreviewData);

        // ** SIMULATION **
        // Real PDF generation would use a library like jsPDF or server-side generation.
        alert("Simulation:\nPDF download is not implemented in this demo.\nA real implementation would generate a PDF from the preview data.");

        // Example using jsPDF (if you were to include the library)
        /*
        if (typeof jsPDF !== 'undefined') {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.text(previewArea.textContent, 10, 10); // Basic text dump
            doc.save(`${currentPreviewData.clientLastName}_${currentPreviewData.clientFirstName}_Agreement_Preview.pdf`);
        } else {
            alert("jsPDF library not found. Cannot generate PDF.");
        }
        */
    }


    // --- Event Listeners ---
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    } else {
        console.error("DocuSign form not found.");
    }

    if (closePreviewBtn) {
        closePreviewBtn.addEventListener('click', hidePreview);
    } else {
         console.error("Close preview button not found.");
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', handleSendClick);
    } else {
        console.error("Send button not found.");
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', handleDownloadClick);
    } else {
         console.error("Download button not found.");
    }

     // Add listeners for dynamically added buttons in pending list (using event delegation)
     if (pendingList) {
         pendingList.addEventListener('click', (event) => {
             if (event.target.closest('button[title="Resend"]')) {
                  const listItem = event.target.closest('li');
                  const reqId = listItem?.dataset.id;
                  alert(`Simulation: Resend request ${reqId}`);
                  console.log(`Simulating Resend for ${reqId}`);
             }
             if (event.target.closest('button[title="View Error"]')) {
                 const listItem = event.target.closest('li');
                 const reqId = listItem?.dataset.id;
                 alert(`Simulation: View error details for ${reqId}`);
                 console.log(`Simulating View Error for ${reqId}`);
            }
         });
     }

    // --- Initial State ---
    hidePreview(); // Ensure preview is hidden initially
    updatePendingListVisibility(); // Check if initial pending items exist

})(); // End IIFE
