document.addEventListener('DOMContentLoaded', () => {
    const clippyContainer = document.createElement('div');
    clippyContainer.id = 'clippy-lawyer';
    clippyContainer.classList.add('clippy-lawyer');
    clippyContainer.innerHTML = `
        <div class="clippy-avatar">
            <img src="https://via.placeholder.com/80?text=Clippy+Lawyer" alt="Clippy Lawyer" class="clippy-image">
            <div class="speech-bubble" id="clippy-speech">
                <p id="clippy-message">I’m your Kershaw AI Legal Assistant, here to help!</p>
            </div>
        </div>
    `;
    document.body.appendChild(clippyContainer);

    const clippy = document.getElementById('clippy-lawyer');
    const speechBubble = document.getElementById('clippy-speech');
    const clippyMessage = document.getElementById('clippy-message');
    const aiChatInput = document.getElementById('ai-chat-input');
    const aiChatSend = document.getElementById('ai-chat-send');
    const aiChatMessages = document.getElementById('ai-chat-messages');
    const notificationCount = document.getElementById('notification-count');
    const headerRight = document.querySelector('.header-right');
    let isVisible = false;
    let chatHistory = [];
    let isProcessing = false;
    let positionX = window.innerWidth - 120; // Bottom-right corner
    let positionY = window.innerHeight - 150;

    const clippyToggle = document.createElement('button');
    clippyToggle.classList.add('icon-button');
    clippyToggle.innerHTML = '<span class="icon-placeholder">🤖</span>';
    clippyToggle.title = 'Toggle Clippy';
    headerRight.insertBefore(clippyToggle, headerRight.firstChild);

    const aiConfig = {
        apiKey: 'AIzaSyAbBo5ye75w8JzikAnW3Xw3fpVZEmeCFQE',
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        model: 'gemini-2.0-flash'
    };

    const aiState = {
        currentClient: null,
        currentTask: null,
        currentDocument: null,
        lastCommand: ''
    };

    function showClippy(message = "I’m the Kershaw AI Legal Assistant, here to help with H-2A/H-2B visas!") {
        clippyMessage.textContent = message;
        clippy.style.display = 'block';
        clippy.style.opacity = '0';
        clippy.style.transform = 'scale(0.8)';
        setTimeout(() => {
            clippy.style.opacity = '1';
            clippy.style.transform = 'scale(1)';
            clippy.classList.add('bounce');
            clippy.classList.add('wave');
        }, 50);
        isVisible = true;
        setTimeout(() => {
            clippy.classList.remove('wave');
            if (!isProcessing) hideClippy();
        }, 7000);
    }

    function hideClippy() {
        clippy.style.opacity = '0';
        clippy.style.transform = 'scale(0.8)';
        clippy.classList.remove('bounce');
        setTimeout(() => {
            clippy.style.display = 'none';
            isVisible = false;
        }, 300);
    }

    function moveClippy() {
        positionX = window.innerWidth - 120; // Keep in bottom-right
        positionY = window.innerHeight - 150;
        clippy.style.left = `${positionX}px`;
        clippy.style.top = `${positionY}px`;
    }

    function addMessage(message, isUser = false, timestamp = new Date().toLocaleTimeString()) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('ai-message');
        messageDiv.classList.add(isUser ? 'user-message' : 'ai-message-response');
        messageDiv.innerHTML = `<span class="message-text">${message}</span><span class="message-time">${timestamp}</span>`;
        aiChatMessages.appendChild(messageDiv);
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
        chatHistory.push({ text: message, isUser, timestamp });
        if (!isUser) updateNotification('AI Response');
    }

    function updateNotification(message) {
        const currentCount = parseInt(notificationCount.textContent) || 0;
        notificationCount.textContent = currentCount + 1;
        window.dispatchEvent(new CustomEvent('notificationAdded', { detail: { message } }));
    }

    async function callAiApi(command) {
        try {
            const response = await fetch(`${aiConfig.endpoint}?key=${aiConfig.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are a legal assistant specialized in H-2A and H-2B visas for Kershaw Law Firm. ${command}`
                        }]
                    }]
                })
            });
            if (!response.ok) throw new Error('Gemini API request failed');
            const data = await response.json();
            return data.candidates[0].content.parts[0].text.trim();
        } catch (error) {
            console.error('AI Error:', error);
            return 'Sorry, I encountered an issue with the AI service. Please try again or contact support.';
        }
    }

    async function processAiCommand(command) {
        if (isProcessing) return;
        isProcessing = true;
        addMessage(command, true);
        aiState.lastCommand = command.toLowerCase();

        if (aiState.lastCommand.includes('create document') && command.match(/h-2[ab]/i)) {
            aiState.currentDocument = { visaType: command.match(/h-2[ab]/i)[0], status: 'draft' };
            const response = await callAiApi(`Draft a DocuSign document for a ${aiState.currentDocument.visaType} visa. Include placeholders for client name, employer, and terms.`);
            addMessage(`${response} Say "preview" or "send" to proceed.`);
            showClippy('Drafted a document! What’s next?');
            window.dispatchEvent(new CustomEvent('aiCommandProcessed', { detail: { command } }));
        } else if (aiState.lastCommand.includes('add client') && command.includes('@')) {
            const clientData = parseClientData(command);
            aiState.currentClient = clientData;
            const response = await callAiApi(`Confirm adding client: ${clientData.name}, ${clientData.visaType}, ${clientData.email}.`);
            addMessage(`${response} Client added. Next: "task" or "document"?`);
            updateClientList(clientData);
            showClippy(`Added ${clientData.name}! Need a task for them?`);
            window.dispatchEvent(new CustomEvent('aiCommandProcessed', { detail: { command } }));
        } else if (aiState.lastCommand.includes('task') && command.includes('by')) {
            const taskData = parseTaskData(command);
            aiState.currentTask = taskData;
            const response = await callAiApi(`Set task: "${taskData.title}" due ${taskData.dueDate} for ${taskData.assignedTo}.`);
            addMessage(`${response}`);
            updateTaskList(taskData);
            showClippy(`Task "${taskData.title}" is set!`);
            window.dispatchEvent(new CustomEvent('aiCommandProcessed', { detail: { command } }));
        } else if (aiState.lastCommand.includes('approve') && (command.includes('yes') || command.includes('no'))) {
            const approval = command.includes('yes') ? 'Approved' : 'Rejected';
            const response = await callAiApi(`Document ${aiState.currentDocument?.visaType || 'unknown'} marked as ${approval}.`);
            addMessage(`${response}`);
            if (approval === 'Approved') updateDocumentStatus(aiState.currentDocument, 'approved');
            showClippy(`Document ${approval.toLowerCase()}! Anything else?`);
            window.dispatchEvent(new CustomEvent('aiCommandProcessed', { detail: { command } }));
        } else if (aiState.lastCommand.includes('summarize clients')) {
            const clients = JSON.parse(localStorage.getItem('clients')) || [];
            const summary = clients.length > 0 ? `You have ${clients.length} clients: ${clients.map(c => `${c.name} (${c.visaType})`).join(', ')}.` : 'No clients yet.';
            addMessage(summary);
            showClippy('Here’s your client rundown!');
        } else {
            const response = await callAiApi(command);
            addMessage(response);
            showClippy('Here’s my response—how can I assist further?');
            window.dispatchEvent(new CustomEvent('aiCommandProcessed', { detail: { command } }));
        }

        moveClippy();
        isProcessing = false;
    }

    function parseClientData(command) {
        const parts = command.split(' ');
        return {
            name: parts.slice(0, parts.indexOf('h-2')).join(' '),
            visaType: parts.find(p => p.match(/h-2[ab]/i)) || 'H-2A',
            email: parts.find(p => p.includes('@')) || 'unknown@email.com',
            phone: parts.find(p => p.match(/\d{3}-\d{3}-\d{4}/)) || 'N/A'
        };
    }

    function parseTaskData(command) {
        const parts = command.split(' ');
        const byIndex = parts.indexOf('by');
        return {
            title: parts.slice(0, byIndex).join(' '),
            dueDate: parts.slice(byIndex + 1, byIndex + 4).join(' '),
            assignedTo: parts.slice(byIndex + 4).join(' ') || 'You'
        };
    }

    function updateClientList(clientData) {
        const clientList = document.getElementById('client-list');
        const clientItem = document.createElement('div');
        clientItem.classList.add('client-item');
        clientItem.innerHTML = `<strong>${clientData.name}</strong> - ${clientData.visaType} <br> ${clientData.email}`;
        clientList.appendChild(clientItem);
        updateNotification(`New Client: ${clientData.name}`);
    }

    function updateTaskList(taskData) {
        const taskList = document.getElementById('task-list');
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        taskItem.innerHTML = `<strong>${taskData.title}</strong> <br> Due: ${taskData.dueDate} | Assigned: ${taskData.assignedTo}`;
        taskList.appendChild(taskItem);
        updateNotification(`New Task: ${taskData.title}`);
    }

    function updateDocumentStatus(document, status) {
        const documentList = document.getElementById('document-list');
        const docItem = document.createElement('div');
        docItem.classList.add('document-item');
        docItem.innerHTML = `<strong>${document.visaType} Document</strong> - ${status}`;
        documentList.appendChild(docItem);
        updateNotification(`Document ${status}: ${document.visaType}`);
    }

    showClippy();

    clippyToggle.addEventListener('click', () => {
        if (isVisible) hideClippy();
        else showClippy('Back to assist you!');
    });

    clippy.addEventListener('click', () => {
        if (!isVisible) showClippy('Back to assist you!');
    });

    aiChatSend.addEventListener('click', () => {
        const command = aiChatInput.value.trim();
        if (command && !isProcessing) {
            processAiCommand(command);
            aiChatInput.value = '';
        }
    });

    aiChatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !isProcessing) {
            aiChatSend.click();
        }
    });

    document.addEventListener('click', (e) => {
        if (!clippy.contains(e.target) && !aiChatInput.contains(e.target) && !aiChatSend.contains(e.target) && !clippyToggle.contains(e.target) && isVisible) {
            hideClippy();
        }
    });

    document.querySelector('.nav-link[data-target="ai-content"]').addEventListener('click', () => {
        if (!isVisible) showClippy('Ready to assist with your visa work!');
    });

    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const command = event.results[0][0].transcript;
            processAiCommand(command);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            addMessage('Sorry, I couldn’t hear you. Try typing instead.');
            showClippy('Voice didn’t work—type it instead?');
        };

        document.getElementById('ai-chat-input').addEventListener('focus', () => {
            recognition.start();
        });
    }

    window.addEventListener('resize', moveClippy); // Adjust position on resize

    setInterval(() => {
        if (!isProcessing && !isVisible && chatHistory.length > 0) {
            const lastUserCommand = chatHistory.filter(m => m.isUser).pop()?.text.toLowerCase();
            if (lastUserCommand?.includes('document') && !aiState.currentDocument) {
                showClippy('Need a DocuSign? Specify the visa type!');
            } else if (lastUserCommand?.includes('client') && !aiState.currentClient) {
                showClippy('Add a client? Give me their details!');
            }
            moveClippy();
        }
    }, 10000);
});