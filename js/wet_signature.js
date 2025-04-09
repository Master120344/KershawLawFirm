// ==========================================================================
// Kershaw Law Firm - Wet Signature Management (V1.0 - H-2A/H-2B Dashboard)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // === Core Element Selectors ===
    const documentsContent = document.getElementById('documents-content');
    const documentTableBody = document.getElementById('document-table-body');
    const wetSignatureModal = createWetSignatureModal();

    // === Data Stores (Synced with localStorage) ===
    let documents = JSON.parse(localStorage.getItem('documents')) || [];

    // === Wet Signature Modal ===
    function createWetSignatureModal() {
        const modal = document.createElement('div');
        modal.id = 'wet-signature-modal';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 17, 20, 0.95); display: none; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(8px); transition: opacity 0.3s ease; opacity: 0;';
        modal.innerHTML = `
            <div class="modal-content" style="background: linear-gradient(to bottom, #1b2028, #232832); padding: 30px; border-radius: 12px; box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5); width: 90%; max-width: 700px; transform: scale(0.95); transition: transform 0.3s ease;">
                <h2 style="font-family: 'Cinzel', serif; color: #ffffff; font-size: 1.8rem; margin-bottom: 20px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);">Wet Signature Capture</h2>
                <div id="wet-signature-instructions" style="margin-bottom: 20px; padding: 15px; background: #2d333f; border-radius: 8px; color: #e2e2e2; font-family: 'Roboto', sans-serif;">
                    <p>Use your mouse or touchscreen to draw your signature below.</p>
                </div>
                <form id="wet-signature-form">
                    <div class="form-group">
                        <label for="doc-select-wet" style="color: #e2e2e2; font-weight: 600;">Select Document</label>
                        <select id="doc-select-wet" required style="width: 100%; padding: 12px; margin-top: 8px; background: #2d333f; border: 1px solid #4a5160; border-radius: 8px; color: #e2e2e2;">
                            <option value="" disabled selected>Select Document...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <canvas id="signature-canvas" width="600" height="200" style="background: #ffffff; border: 2px solid #4a5160; border-radius: 8px; width: 100%; cursor: crosshair;"></canvas>
                    </div>
                    <div style="display: flex; gap: 15px; margin-top: 15px;">
                        <button type="button" id="clear-signature" class="button secondary" style="flex-grow: 1;">Clear</button>
                        <button type="submit" class="button primary" style="flex-grow: 1;">Save Signature</button>
                        <button type="button" id="cancel-wet-signature" class="button secondary" style="flex-grow: 1;">Cancel</button>
                    </div>
                </form>
                <div id="wet-signature-preview" style="margin-top: 20px; display: none;">
                    <h3 style="color: #e2e2e2;">Signature Preview</h3>
                    <img id="signature-preview-img" style="max-width: 100%; border-radius: 8px; border: 1px solid #4a5160;" alt="Signature Preview">
                    <button id="download-wet-signature" class="button secondary" style="margin-top: 15px;">💾 Download Signed Document</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    // === Add Wet Signature Button to Documents Section ===
    const headerActions = documentsContent.querySelector('.header-actions');
    const wetSignatureBtn = document.createElement('button');
    wetSignatureBtn.className = 'button primary small';
    wetSignatureBtn.innerHTML = '🖋️ Sign Wet';
    wetSignatureBtn.style.cssText = 'margin-left: 10px;';
    headerActions.appendChild(wetSignatureBtn);

    // === Populate Document Dropdown ===
    function populateDropdown() {
        const docSelect = document.getElementById('doc-select-wet');
        docSelect.innerHTML = '<option value="" disabled selected>Select Document...</option>';
        documents.forEach(doc => {
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = `${doc.fileName} (${doc.caseId})`;
            docSelect.appendChild(option);
        });
    }

    // === Signature Canvas Setup ===
    const canvas = document.getElementById('signature-canvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('touchstart', startTouchDrawing);
    canvas.addEventListener('touchmove', drawTouch);
    canvas.addEventListener('touchend', stopDrawing);

    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function draw(e) {
        if (!isDrawing) return;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function startTouchDrawing(e) {
        e.preventDefault();
        isDrawing = true;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
    }

    function drawTouch(e) {
        e.preventDefault();
        if (!isDrawing) return;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        [lastX, lastY] = [x, y];
    }

    function stopDrawing() {
        isDrawing = false;
    }

    document.getElementById('clear-signature').addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        document.getElementById('wet-signature-preview').style.display = 'none';
    });

    // === Wet Signature Form Handling ===
    const wetSignatureForm = document.getElementById('wet-signature-form');
    const docSelectWet = document.getElementById('doc-select-wet');
    const previewImg = document.getElementById('signature-preview-img');
    const previewSection = document.getElementById('wet-signature-preview');

    wetSignatureForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const docId = docSelectWet.value;
        if (!docId) {
            alert('Please select a document.');
            return;
        }

        const signatureData = canvas.toDataURL('image/png');
        const doc = documents.find(d => d.id === docId);
        doc.wetSignature = signatureData;
        doc.status = 'Wet Signature Captured';
        doc.reviewer = 'Eleanor Vance'; // Simulated admin
        localStorage.setItem('documents', JSON.stringify(documents));

        previewImg.src = signatureData;
        previewSection.style.display = 'block';
        previewSection.style.animation = 'fadeIn 0.6s ease-in-out';
        renderDocuments();
        triggerNotification(`Wet signature captured for "${doc.fileName}"`);
    });

    document.getElementById('download-wet-signature').addEventListener('click', () => {
        const docId = docSelectWet.value;
        const doc = documents.find(d => d.id === docId);
        alert(`Simulated PDF download: ${doc.fileName} with wet signature - Requires backend for real PDF generation.`);
        closeModal();
    });

    // === Modal Controls ===
    wetSignatureBtn.addEventListener('click', () => {
        populateDropdown();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        wetSignatureModal.style.display = 'flex';
        setTimeout(() => {
            wetSignatureModal.style.opacity = '1';
            wetSignatureModal.querySelector('.modal-content').style.transform = 'scale(1)';
        }, 10);
    });

    document.getElementById('cancel-wet-signature').addEventListener('click', closeModal);

    function closeModal() {
        wetSignatureModal.style.opacity = '0';
        wetSignatureModal.querySelector('.modal-content').style.transform = 'scale(0.95)';
        setTimeout(() => {
            wetSignatureModal.style.display = 'none';
            wetSignatureForm.reset();
            previewSection.style.display = 'none';
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
                <td>${doc.status}${doc.wetSignature ? ' (Wet Signed)' : ''}${doc.docusign ? ' (DocuSign)' : ''}</td>
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
                    doc.reviewer = 'Eleanor Vance';
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
                alert(`Simulated download: ${doc.fileName} (${doc.size})${doc.wetSignature ? ' - Wet signature included' : ''}${doc.docusign ? ' - DocuSign status: ' + doc.status : ''}`);
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
