// ==========================================================================
// Kershaw Law Firm - DocuSign Integration (V1.0 - H-2A/H-2B Dashboard)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // === Core Element Selectors ===
    const documentsContent = document.getElementById('documents-content');
    const documentTableBody = document.getElementById('document-table-body');
    const docusignModal = createDocusignModal();

    // === Data Stores (Synced with localStorage) ===
    let documents = JSON.parse(localStorage.getItem('documents')) || [];
    let clients = JSON.parse(localStorage.getItem('clients')) || [];
    let cases = JSON.parse(localStorage.getItem('cases')) || [];

    // === DocuSign Modal ===
    function createDocusignModal() {
        const modal = document.createElement('div');
        modal.id = 'docusign-modal';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 17, 20, 0.95); display: none; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(8px); transition: opacity 0.3s ease; opacity: 0;';
        modal.innerHTML = `
            <div class="modal-content" style="background: linear-gradient(to bottom, #1b2028, #232832); padding: 30px; border-radius: 12px; box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5); width: 90%; max-width: 700px; transform: scale(0.95); transition: transform 0.3s ease;">
                <h2 style="font-family: 'Cinzel', serif; color: #ffffff; font-size: 1.8rem; margin-bottom: 20px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);">DocuSign e-Signature</h2>
                <div id="docusign-status" style="margin-bottom: 20px; padding: 15px; background: #2d333f; border-radius: 8px; color: #e2e2e2; font-family: 'Roboto', sans-serif;">
                    <p><strong>Status:</strong> Preparing document for signature...</p>
                </div>
                <form id="docusign-form">
                    <div class="form-group">
                        <label for="doc-select" style="color: #e2e2e2; font-weight: 600;">Select Document</label>
                        <select id="doc-select" required style="width: 100%; padding: 12px; margin-top: 8px; background: #2d333f; border: 1px solid #4a5160; border-radius: 8px; color: #e2e2e2;">
                            <option value="" disabled selected>Select Document...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="signer-select" style="color: #e2e2e2; font-weight: 600;">Signer</label>
                        <select id="signer-select" required style="width: 100%; padding: 12px; margin-top: 8px; background: #2d333f; border: 1px solid #4a5160; border-radius: 8px; color: #e2e2e2;">
                            <option value="" disabled selected>Select Signer...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="signer-email" style="color: #e2e2e2; font-weight: 600;">Signer Email</label>
                        <input type="email" id="signer-email" required placeholder="Enter signer email" style="width: 100%; padding: 12px; margin-top: 8px; background: #2d333f; border: 1px solid #4a5160; border-radius: 8px; color: #e2e2e2;">
                    </div>
                    <div style="display: flex; gap: 15px; margin-top: 25px;">
                        <button type="submit" class="button primary" style="flex-grow: 1;">Send for Signature</button>
                        <button type="button" id="cancel-docusign" class="button secondary" style="flex-grow: 1;">Cancel</button>
                    </div>
                </form>
                <div id="docusign-preview" style="margin-top: 20px; display: none;">
                    <h3 style="color: #e2e2e2;">Preview</h3>
                    <div id="docusign-preview-content" style="background: #3c4352; padding: 15px; border-radius: 8px; color: #e2e2e2; height: 200px; overflow-y: auto;"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    // === Add DocuSign Button to Documents Section ===
    const headerActions = documentsContent.querySelector('.header-actions');
    const docusignBtn = document.createElement('button');
    docusignBtn.className = 'button primary small';
    docusignBtn.innerHTML = '✍️ DocuSign';
    docusignBtn.style.cssText = 'margin-left: 10px;';
    headerActions.appendChild(docusignBtn);

    // === Populate Dropdowns ===
    function populateDropdowns() {
        const docSelect = document.getElementById('doc-select');
        const signerSelect = document.getElementById('signer-select');

        docSelect.innerHTML = '<option value="" disabled selected>Select Document...</option>';
        documents.forEach(doc => {
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = `${doc.fileName} (${doc.caseId})`;
            docSelect.appendChild(option);
        });

        signerSelect.innerHTML = '<option value="" disabled selected>Select Signer...</option>';
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = client.name;
            signerSelect.appendChild(option);
        });
        const adminOption = document.createElement('option');
        adminOption.value = 'admin';
        adminOption.textContent = 'Admin (Eleanor Vance)';
        signerSelect.appendChild(adminOption);
    }

    // === DocuSign Form Handling ===
    const docusignForm = document.getElementById('docusign-form');
    const docSelect = document.getElementById('doc-select');
    const signerSelect = document.getElementById('signer-select');
    const signerEmail = document.getElementById('signer-email');
    const docusignPreview = document.getElementById('docusign-preview');
    const docusignPreviewContent = document.getElementById('docusign-preview-content');
    const docusignStatus = document.getElementById('docusign-status');

    docSelect.addEventListener('change', updatePreview);
    signerSelect.addEventListener('change', updatePreview);

    function updatePreview() {
        const docId = docSelect.value;
        const signerId = signerSelect.value;
        if (docId && signerId) {
            const doc = documents.find(d => d.id === docId);
            const signer = signerId === 'admin' ? { name: 'Eleanor Vance', email: 'eleanor@kershawlaw.com' } : clients.find(c => c.id === signerId);
            docusignPreview.style.display = 'block';
            docusignPreviewContent.innerHTML = `
                <p><strong>Document:</strong> ${doc.fileName}</p>
                <p><strong>Case ID:</strong> ${doc.caseId}</p>
                <p><strong>Signer:</strong> ${signer.name}</p>
                <p><strong>Email:</strong> ${signerEmail.value || signer.email}</p>
                <p><strong>Status:</strong> Ready to send via DocuSign</p>
            `;
            docusignPreviewContent.style.animation = 'fadeIn 0.6s ease-in-out';
        }
    }

    docusignForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const docId = docSelect.value;
        const signerId = signerSelect.value;
        const email = signerEmail.value;

        if (!docId || !signerId || !email) {
            alert('Please select a document, signer, and enter an email.');
            return;
        }

        const doc = documents.find(d => d.id === docId);
        const signer = signerId === 'admin' ? { name: 'Eleanor Vance', email: 'eleanor@kershawlaw.com' } : clients.find(c => c.id === signerId);

        // Simulate DocuSign API call
        docusignStatus.innerHTML = '<p><strong>Status:</strong> Sending to DocuSign...</p>';
        setTimeout(() => {
            doc.status = 'Sent for Signature';
            doc.reviewer = signer.name;
            doc.docusign = { sent: new Date().toISOString(), signer: signer.name, email };
            localStorage.setItem('documents', JSON.stringify(documents));
            renderDocuments();
            closeModal();
            triggerNotification(`Document "${doc.fileName}" sent to ${signer.name} via DocuSign`);
            docusignStatus.innerHTML = '<p><strong>Status:</strong> Document sent successfully!</p>';
        }, 1500); // Simulated delay
    });

    // === Modal Controls ===
    docusignBtn.addEventListener('click', () => {
        populateDropdowns();
        docusignModal.style.display = 'flex';
        setTimeout(() => {
            docusignModal.style.opacity = '1';
            docusignModal.querySelector('.modal-content').style.transform = 'scale(1)';
        }, 10);
    });

    document.getElementById('cancel-docusign').addEventListener('click', closeModal);

    function closeModal() {
        docusignModal.style.opacity = '0';
        docusignModal.querySelector('.modal-content').style.transform = 'scale(0.95)';
        setTimeout(() => {
            docusignModal.style.display = 'none';
            docusignForm.reset();
            docusignPreview.style.display = 'none';
            docusignStatus.innerHTML = '<p><strong>Status:</strong> Preparing document for signature...</p>';
        }, 300);
    }

    // === Document Rendering ===
    function renderDocuments() {
        documentTableBody.innerHTML = '';
        documents.forEach(doc => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doc.fileName}</td>
                <td>${doc.client}</td>
                <td>${doc.caseId}</td>
                <td>${doc.uploaded}</td>
                <td>${doc.status}${doc.docusign ? ' (DocuSign)' : ''}</td>
                <td>
                    <button class="button small secondary review-doc" data-id="${doc.id}">Review</button>
                    <button class="button small secondary download-doc" data-id="${doc.id}">Download</button>
                    <button class="button small secondary delete-doc" data-id="${doc.id}">Delete</button>
                </td>`;
            row.style.transition = 'background 0.3s ease, transform 0.3s ease';
            documentTableBody.appendChild(row);
        });
        attachDocumentEventListeners();
    }

    // === Document Actions ===
    function attachDocumentEventListeners() {
        document.querySelectorAll('.review-doc').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const doc = documents.find(d => d.id === id);
                const status = prompt('Enter review status (Approved/Rejected/Pending/Signed):', doc.status);
                if (status) {
                    doc.status = status;
                    doc.reviewer = 'Eleanor Vance'; // Simulated admin
                    if (status === 'Signed' && doc.docusign) {
                        doc.docusign.signed = new Date().toISOString();
                    }
                    localStorage.setItem('documents', JSON.stringify(documents));
                    renderDocuments();
                    triggerNotification(`Document "${doc.fileName}" marked as ${status}`);
                }
            });
        });

        document.querySelectorAll('.download-doc').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const doc = documents.find(d => d.id === id);
                alert(`Simulated download: ${doc.fileName} (${doc.size})${doc.docusign ? ' - DocuSign status: ' + doc.status : ''}`);
            });
        });

        document.querySelectorAll('.delete-doc').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                if (confirm('Are you sure you want to delete this document?')) {
                    documents = documents.filter(d => d.id !== id);
                    localStorage.setItem('documents', JSON.stringify(documents));
                    renderDocuments();
                    triggerNotification(`Document deleted (ID: ${id})`);
                }
            });
        });
    }

    // === Notification Trigger ===
    function triggerNotification(message) {
        const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
        notifications.push({ id: `N${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`, message, date: new Date().toISOString(), read: false });
        localStorage.setItem('notifications', JSON.stringify(notifications));
        updateDashboardNotifications();
    }

    // === Sync with Dashboard Notifications ===
    function updateDashboardNotifications() {
        const notificationButton = document.querySelector('.notification-button');
        const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
        const unreadCount = notifications.filter(n => !n.read).length;
        const badge = notificationButton.querySelector('.notification-badge');
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }

    // === Initial Render ===
    renderDocuments();

    // === CSS Injection (Temporary until added to dashboard_desktop.css) ===
    const style = document.createElement('style');
    style.textContent = `
        .modal-content input:focus, .modal-content select:focus {
            border-color: #d63b2c;
            box-shadow: 0 0 0 4px rgba(214, 59, 44, 0.25);
            background: #3c4352;
        }
    `;
    document.head.appendChild(style);
});
