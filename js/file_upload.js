// ==========================================================================
// Kershaw Law Firm - File Upload Management (V1.0 - H-2A/H-2B Dashboard)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // === Core Element Selectors ===
    const uploadDocBtn = document.getElementById('upload-doc-btn');
    const documentTableBody = document.getElementById('document-table-body');
    const fileUploadModal = createFileUploadModal();

    // === External Data Access ===
    // These will sync with dashboard_desktop.js via a shared data layer later
    let documents = JSON.parse(localStorage.getItem('documents')) || [];

    // === File Upload Modal ===
    function createFileUploadModal() {
        const modal = document.createElement('div');
        modal.id = 'file-upload-modal';
        modal.className = 'modal';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 17, 20, 0.95); display: none; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(8px); transition: opacity 0.3s ease; opacity: 0;';
        modal.innerHTML = `
            <div class="modal-content" style="background: linear-gradient(to bottom, #1b2028, #232832); padding: 30px; border-radius: 12px; box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5); width: 90%; max-width: 600px; transform: scale(0.95); transition: transform 0.3s ease;">
                <h2 style="font-family: 'Cinzel', serif; color: #ffffff; font-size: 1.8rem; margin-bottom: 20px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);">Upload Document</h2>
                <form id="file-upload-form">
                    <div class="form-group">
                        <label for="file-input" style="color: #e2e2e2; font-weight: 600;">Select File</label>
                        <input type="file" id="file-input" accept=".pdf,.docx,.jpg,.png" required style="width: 100%; padding: 12px; margin-top: 8px; background: #2d333f; border: 1px solid #4a5160; border-radius: 8px; color: #e2e2e2;">
                    </div>
                    <div class="form-group">
                        <label for="client-select" style="color: #e2e2e2; font-weight: 600;">Client</label>
                        <select id="client-select" required style="width: 100%; padding: 12px; margin-top: 8px; background: #2d333f; border: 1px solid #4a5160; border-radius: 8px; color: #e2e2e2;">
                            <option value="" disabled selected>Select Client...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="case-select" style="color: #e2e2e2; font-weight: 600;">Case ID</label>
                        <select id="case-select" required style="width: 100%; padding: 12px; margin-top: 8px; background: #2d333f; border: 1px solid #4a5160; border-radius: 8px; color: #e2e2e2;">
                            <option value="" disabled selected>Select Case...</option>
                        </select>
                    </div>
                    <div style="display: flex; gap: 15px; margin-top: 25px;">
                        <button type="submit" class="button primary" style="flex-grow: 1;">Upload</button>
                        <button type="button" id="cancel-upload" class="button secondary" style="flex-grow: 1;">Cancel</button>
                    </div>
                </form>
                <div id="upload-preview" style="margin-top: 20px; display: none;">
                    <h3 style="color: #e2e2e2;">Preview</h3>
                    <div id="preview-content" style="background: #3c4352; padding: 15px; border-radius: 8px; color: #e2e2e2;"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    // === Populate Dropdowns ===
    function populateDropdowns() {
        const clientSelect = document.getElementById('client-select');
        const caseSelect = document.getElementById('case-select');
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        const cases = JSON.parse(localStorage.getItem('cases')) || [];

        clientSelect.innerHTML = '<option value="" disabled selected>Select Client...</option>';
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = client.name;
            clientSelect.appendChild(option);
        });

        caseSelect.innerHTML = '<option value="" disabled selected>Select Case...</option>';
        cases.forEach(caseData => {
            const option = document.createElement('option');
            option.value = caseData.id;
            option.textContent = `${caseData.id} - ${caseData.client}`;
            caseSelect.appendChild(option);
        });
    }

    // === File Upload Handling ===
    const fileInput = document.getElementById('file-input');
    const fileUploadForm = document.getElementById('file-upload-form');
    const previewContent = document.getElementById('preview-content');
    const uploadPreview = document.getElementById('upload-preview');

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadPreview.style.display = 'block';
            previewContent.innerHTML = `
                <p><strong>File:</strong> ${file.name}</p>
                <p><strong>Size:</strong> ${(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <p><strong>Type:</strong> ${file.type || file.name.split('.').pop().toUpperCase()}</p>
            `;
            previewContent.style.animation = 'fadeIn 0.6s ease-in-out';
        }
    });

    fileUploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const file = fileInput.files[0];
        const clientId = document.getElementById('client-select').value;
        const caseId = document.getElementById('case-select').value;

        if (!file || !clientId || !caseId) {
            alert('Please select a file, client, and case.');
            return;
        }

        const client = (JSON.parse(localStorage.getItem('clients')) || []).find(c => c.id === clientId);
        const newDoc = {
            id: `D${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            fileName: file.name,
            clientId: clientId,
            client: client ? client.name : 'Unknown',
            caseId: caseId,
            uploaded: new Date().toISOString().split('T')[0],
            status: 'Pending Review',
            type: file.type || file.name.split('.').pop().toUpperCase(),
            size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
            reviewer: null,
            fileData: null // Placeholder for backend integration
        };

        // Simulate file storage (for now, no real file data)
        documents.push(newDoc);
        localStorage.setItem('documents', JSON.stringify(documents));
        renderDocuments();
        closeModal();
        triggerNotification(`Document "${file.name}" uploaded successfully`);
    });

    // === Modal Controls ===
    uploadDocBtn.addEventListener('click', () => {
        populateDropdowns();
        fileUploadModal.style.display = 'flex';
        setTimeout(() => {
            fileUploadModal.style.opacity = '1';
            fileUploadModal.querySelector('.modal-content').style.transform = 'scale(1)';
        }, 10);
    });

    document.getElementById('cancel-upload').addEventListener('click', closeModal);

    function closeModal() {
        fileUploadModal.style.opacity = '0';
        fileUploadModal.querySelector('.modal-content').style.transform = 'scale(0.95)';
        setTimeout(() => {
            fileUploadModal.style.display = 'none';
            fileUploadForm.reset();
            uploadPreview.style.display = 'none';
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
                <td>${doc.status}</td>
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
                const status = prompt('Enter review status (Approved/Rejected/Pending):', doc.status);
                if (status) {
                    doc.status = status;
                    doc.reviewer = 'Eleanor Vance'; // Simulated admin
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
                alert(`Simulated download: ${doc.fileName} (${doc.size}) - Full download requires backend integration.`);
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
});

// === CSS Injection for Modal (Temporary until added to dashboard_desktop.css) ===
const style = document.createElement('style');
style.textContent = `
    .modal-content input:focus, .modal-content select:focus {
        border-color: #d63b2c;
        box-shadow: 0 0 0 4px rgba(214, 59, 44, 0.25);
        background: #3c4352;
    }
    .event-dot { width: 8px; height: 8px; border-radius: 50%; margin: 2px; }
    .type-deadline { background: #d63b2c; }
    .type-meeting { background: #17a2b8; }
    .type-other { background: #ffc107; }
`;
document.head.appendChild(style);
