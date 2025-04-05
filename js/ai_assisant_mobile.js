document.addEventListener('DOMContentLoaded', () => {
    const aiPopup = document.getElementById('ai-assistant-popup');
    const aiClose = document.getElementById('ai-assistant-close');
    const aiChatInput = document.getElementById('ai-chat-input');
    const aiChatSend = document.getElementById('ai-chat-send');
    const aiChatMessages = document.getElementById('ai-chat-messages');
    const notificationCount = document.getElementById('notification-count');
    let isAiVisible = false;
    let chatHistory = [];
    let isProcessing = false;

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

    function showAiPopup(message = "I’m the Kershaw AI Legal Assistant, here to help with H-2A/H-2B visas!") {
        aiPopup.querySelector('p').textContent = message;
        aiPopup.style.display = 'flex';
        aiPopup.style.opacity = '0';
        aiPopup.style.transform = 'translateY(20px) scale(0.9)';
        setTimeout(() => {
            aiPopup.style.opacity = '1';
            aiPopup.style.transform = 'translateY(0) scale(1)';
            aiPopup.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        }, 50);
        isAiVisible = true;
        setTimeout(hideAiPopup, 7000);
    }

    function hideAiPopup() {
        aiPopup.style.opacity = '0';
        aiPopup.style.transform = 'translateY(20px) scale(0.9)';
        setTimeout(() => {
            aiPopup.style.display = 'none';
            isAiVisible = false;
        }, 300);
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
        console.log(`Notification: ${message}`);
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
        } else if (aiState.lastCommand.includes('add client') && command.includes('@')) {
            const clientData = parseClientData(command);
            aiState.currentClient = clientData;
            const response = await callAiApi(`Confirm adding client: ${clientData.name}, ${clientData.visaType}, ${clientData.email}.`);
            addMessage(`${response} Client added. Next: "task" or "document"?`);
            updateClientList(clientData);
        } else if (aiState.lastCommand.includes('task') && command.includes('by')) {
            const taskData = parseTaskData(command);
            aiState.currentTask = taskData;
            const response = await callAiApi(`Set task: "${taskData.title}" due ${taskData.dueDate} for ${taskData.assignedTo}.`);
            addMessage(`${response}`);
            updateTaskList(taskData);
        } else if (aiState.lastCommand.includes('approve') && (command.includes('yes') || command.includes('no'))) {
            const approval = command.includes('yes') ? 'Approved' : 'Rejected';
            const response = await callAiApi(`Document ${aiState.currentDocument?.visaType || 'unknown'} marked as ${approval}.`);
            addMessage(`${response}`);
            if (approval === 'Approved') updateDocumentStatus(aiState.currentDocument, 'approved');
        } else {
            const response = await callAiApi(command);
            addMessage(response);
        }

        if (!isAiVisible) showAiPopup(`Processing: ${command}`);
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

    showAiPopup();

    aiClose.addEventListener('click', hideAiPopup);

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
        if (!aiPopup.contains(e.target) && !aiChatInput.contains(e.target) && !aiChatSend.contains(e.target) && isAiVisible) {
            hideAiPopup();
        }
    });

    document.querySelector('.nav-link[data-target="ai-content"]').addEventListener('click', () => {
        if (!isAiVisible) showAiPopup('Ready to assist with your visa work!');
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
        };

        document.getElementById('ai-chat-input').addEventListener('focus', () => {
            recognition.start();
        });
    }

    setInterval(() => {
        if (!isProcessing && !isAiVisible && chatHistory.length > 0) {
            const lastUserCommand = chatHistory.filter(m => m.isUser).pop()?.text.toLowerCase();
            if (lastUserCommand?.includes('document') && !aiState.currentDocument) {
                showAiPopup('Need a DocuSign? Specify the visa type!');
            } else if (lastUserCommand?.includes('client') && !aiState.currentClient) {
                showAiPopup('Add a client? Give me their details!');
            }
        }
    }, 10000);
});