document.addEventListener('DOMContentLoaded', () => {
    const documentList = document.getElementById('document-list');
    const createDocuSignBtn = document.getElementById('create-docusign-btn');
    const notificationCount = document.getElementById('notification-count');
    let documents = JSON.parse(localStorage.getItem('documents')) || [
        { id: 1, type: 'H-2A Agreement', clientName: 'Sample Client', email: 'sample@example.com', status: 'sent', envelopeId: 'SIM-123' },
        { id: 2, type: 'H-2B Agreement', clientName: 'Demo Client', email: 'demo@example.com', status: 'approved', envelopeId: 'SIM-456' }
    ]; // Pre-populated samples

    const docusignConfig = {
        apiKey: 'YOUR_DOCUSIGN_API_KEY_HERE', // Replace with real DocuSign API key later
        endpoint: 'https://demo.docusign.net/restapi/v2.1/accounts/{accountId}/envelopes',
        accountId: 'YOUR_DOCUSIGN_ACCOUNT_ID_HERE' // Replace with real account ID
    };

    const docuSignFormHTML = `
        <div class="docusign-form" id="docusign-form">
            <h3>Create New DocuSign</h3>
            <div class="form-group">
                <label for="doc-client" class="form-label">Client</label>
                <select id="doc-client" class="form-control" required>
                    <option value="" disabled selected>Select a client...</option>
                </select>
            </div>
            <div class="form-group">
                <label for="doc-type" class="form-label">Document Type</label>
                <select id="doc-type" class="form-control" required>
                    <option value="H-2A Agreement">H-2A Agreement</option>
                    <option value="H-2B Agreement">H-2B Agreement</option>
                    <option value="Retainer">Retainer</option>
                </select>
            </div>
            <div class="form-group">
                <label for="doc-email" class="form-label">Recipient Email</label>
                <input type="email" id="doc-email" class="form-control" placeholder="e.g., client@example.com" required>
            </div>
            <div class="form-group">
                <label for="doc-message" class="form-label">Message (Optional)</label>
                <textarea id="doc-message" class="form-control" rows="3" placeholder="e.g., Please sign this H-2A agreement."></textarea>
            </div>
            <div class="form-actions">
                <button class="button primary" id="send-docusign-btn">Send for Signature</button>
                <button class="button secondary" id="preview-docusign-btn">Preview</button>
                <button class="button secondary" id="cancel-docusign-btn">Cancel</button>
            </div>
        </div>
    `;

    function updateDocumentList() {
        documentList.innerHTML = '';
        documents.forEach(doc => {
            const docItem = document.createElement('div');
            docItem.classList.add('document-item');
            docItem.innerHTML = `
                <strong>${doc.type}</strong> for ${doc.clientName} <br> 
                Status: ${doc.status} | Sent to: ${doc.email}
                <button class="icon-button subtle approve-doc-btn" data-doc-id="${doc.id}" title="Approve">✔️</button>
                <button class="icon-button subtle preview-doc-btn" data-doc-id="${doc.id}" title="Preview">👁️</button>
            `;
            documentList.appendChild(docItem);
        });
        localStorage.setItem('documents', JSON.stringify(documents));
    }

    function updateNotification(message) {
        const currentCount = parseInt(notificationCount.textContent) || 0;
        notificationCount.textContent = currentCount + 1;
        window.dispatchEvent(new CustomEvent('notificationAdded', { detail: { message } }));
    }

    function showClippy(message) {
        const clippyMessage = document.getElementById('clippy-message');
        if (clippyMessage) clippyMessage.textContent = message;
        const clippy = document.getElementById('clippy-lawyer');
        if (clippy) {
            clippy.style.display = 'block';
            clippy.style.opacity = '1';
            clippy.classList.add('bounce');
            setTimeout(() => clippy.classList.remove('bounce'), 1500);
        }
    }

    async function sendDocuSign(docData) {
        try {
            const response = await fetch(docusignConfig.endpoint.replace('{accountId}', docusignConfig.accountId), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${docusignConfig.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    emailSubject: `Kershaw Law Firm: ${docData.type} for Signature`,
                    emailBlurb: docData.message || 'Please review and sign this document.',
                    documents: [{
                        documentBase64: btoa(`Sample ${docData.type} for ${docData.clientName}`),
                        name: `${docData.type}.pdf`,
                        documentId: '1'
                    }],
                    recipients: {
                        signers: [{
                            email: docData.email,
                            name: docData.clientName,
                            recipientId: '1',
                            routingOrder: '1'
                        }]
                    },
                    status: 'sent'
                })
            });
            if (!response.ok) throw new Error('DocuSign API request failed');
            const data = await response.json();
            return data.envelopeId;
        } catch (error) {
            console.error('DocuSign Error:', error);
            return null; // Simulate success for now
        }
    }

    function addDocument(docData) {
        const newDoc = {
            id: Date.now(),
            type: docData.type,
            clientName: docData.clientName,
            email: docData.email,
            message: docData.message || '',
            status: 'sent',
            envelopeId: docData.envelopeId || `SIM-${Date.now()}`
        };
        documents.push(newDoc);
        updateDocumentList();
        updateNotification(`DocuSign Sent: ${newDoc.type} for ${newDoc.clientName}`);
        showClippy(`Sent ${newDoc.type} to ${newDoc.email}! Need approval?`);
        window.dispatchEvent(new CustomEvent('documentSent', { detail: { type: newDoc.type, clientName: newDoc.clientName } }));
        return newDoc;
    }

    function showDocuSignForm() {
        if (!document.getElementById('docusign-form')) {
            documentList.insertAdjacentHTML('beforeend', docuSignFormHTML);
            const form = document.getElementById('docusign-form');
            const clientSelect = document.getElementById('doc-client');
            const sendBtn = document.getElementById('send-docusign-btn');
            const previewBtn = document.getElementById('preview-docusign-btn');
            const cancelBtn = document.getElementById('cancel-docusign-btn');

            const clients = JSON.parse(localStorage.getItem('clients')) || [];
            clients.forEach(client => {
                const option = document.createElement('option');
                option.value = client.name;
                option.textContent = `${client.name} (${client.visaType})`;
                clientSelect.appendChild(option);
            });

            sendBtn.addEventListener('click', async () => {
                const clientName = clientSelect.value;
                const type = document.getElementById('doc-type').value;
                const email = document.getElementById('doc-email').value.trim();
                const message = document.getElementById('doc-message').value.trim();

                if (clientName && email) {
                    const docData = { clientName, type, email, message };
                    const envelopeId = await sendDocuSign(docData);
                    if (envelopeId || true) { // Simulate success until real API
                        addDocument({ ...docData, envelopeId });
                        form.remove();
                    }
                } else {
                    alert('Please select a client and enter an email.');
                }
            });

            previewBtn.addEventListener('click', () => {
                const clientName = clientSelect.value;
                const type = document.getElementById('doc-type').value;
                const email = document.getElementById('doc-email').value.trim();
                if (clientName && email) {
                    alert(`Preview: ${type} for ${clientName}\nTo: ${email}\nMessage: ${document.getElementById('doc-message').value || 'N/A'}`);
                } else {
                    alert('Please select a client and enter an email for preview.');
                }
            });

            cancelBtn.addEventListener('click', () => form.remove());
        }
    }

    function approveDocument(docId) {
        const doc = documents.find(d => d.id === docId);
        if (doc) {
            doc.status = 'approved';
            updateDocumentList();
            updateNotification(`Document Approved: ${doc.type} for ${doc.clientName}`);
            showClippy(`Approved ${doc.type} for ${doc.clientName}!`);
        }
    }

    createDocuSignBtn.addEventListener('click', showDocuSignForm);

    documentList.addEventListener('click', (e) => {
        if (e.target.classList.contains('approve-doc-btn')) {
            const docId = parseInt(e.target.getAttribute('data-doc-id'));
            approveDocument(docId);
        } else if (e.target.classList.contains('preview-doc-btn')) {
            const docId = parseInt(e.target.getAttribute('data-doc-id'));
            const doc = documents.find(d => d.id === docId);
            if (doc) alert(`Preview: ${doc.type} for ${doc.clientName}\nStatus: ${doc.status}\nTo: ${doc.email}`);
        }
    });

    window.addEventListener('aiCommandProcessed', (e) => {
        const command = e.detail.command.toLowerCase();
        if (command.includes('create document') && command.match(/h-2[ab]/i)) {
            const clientName = JSON.parse(localStorage.getItem('clients'))?.[0]?.name || 'Unknown Client';
            const type = command.includes('h-2a') ? 'H-2A Agreement' : 'H-2B Agreement';
            const email = JSON.parse(localStorage.getItem('clients'))?.[0]?.email || 'unknown@example.com';
            const docData = { clientName, type, email, message: 'Generated by AI Assistant' };
            addDocument(docData);
        } else if (command.includes('approve') && (command.includes('yes') || command.includes('no'))) {
            const latestDoc = documents[documents.length - 1];
            if (latestDoc && command.includes('yes')) {
                approveDocument(latestDoc.id);
            }
        }
    });

    updateDocumentList(); // Load initial documents
});