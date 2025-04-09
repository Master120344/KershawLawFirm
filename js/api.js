// ==========================================================================
// Kershaw Law Firm - API Simulation (V1.0 - H-2A/H-2B Dashboard)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // === Simulated API Base URL (Replace with real backend later) ===
    const API_BASE_URL = 'http://simulated-api.kershawlawfirm.com';

    // === Simulated API Functions ===
    async function apiFetch(endpoint, method = 'GET', data = null) {
        console.log(`API ${method} Request to ${API_BASE_URL}${endpoint}`, data || '');
        return new Promise((resolve) => {
            setTimeout(() => {
                switch (endpoint) {
                    case '/clients':
                        if (method === 'GET') resolve(JSON.parse(localStorage.getItem('clients')) || []);
                        if (method === 'POST') {
                            const newClient = { ...data, id: `C${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}` };
                            const clients = JSON.parse(localStorage.getItem('clients')) || [];
                            clients.push(newClient);
                            localStorage.setItem('clients', JSON.stringify(clients));
                            resolve(newClient);
                        }
                        break;
                    case '/cases':
                        if (method === 'GET') resolve(JSON.parse(localStorage.getItem('cases')) || []);
                        if (method === 'POST') {
                            const newCase = { ...data, id: `H2${data.visaType === 'H-2A' ? 'A' : 'B'}-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}` };
                            const cases = JSON.parse(localStorage.getItem('cases')) || [];
                            cases.push(newCase);
                            localStorage.setItem('cases', JSON.stringify(cases));
                            resolve(newCase);
                        }
                        break;
                    case '/documents':
                        if (method === 'GET') resolve(JSON.parse(localStorage.getItem('documents')) || []);
                        if (method === 'POST') {
                            const newDoc = { ...data, id: `D${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}` };
                            const documents = JSON.parse(localStorage.getItem('documents')) || [];
                            documents.push(newDoc);
                            localStorage.setItem('documents', JSON.stringify(documents));
                            resolve(newDoc);
                        }
                        break;
                    case '/forums':
                        if (method === 'GET') resolve(JSON.parse(localStorage.getItem('forums')) || []);
                        if (method === 'POST') {
                            const newForum = { ...data, id: `F${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}` };
                            const forums = JSON.parse(localStorage.getItem('forums')) || [];
                            forums.push(newForum);
                            localStorage.setItem('forums', JSON.stringify(forums));
                            resolve(newForum);
                        }
                        break;
                    case '/notifications':
                        if (method === 'GET') resolve(JSON.parse(localStorage.getItem('notifications')) || []);
                        if (method === 'POST') {
                            const newNotification = { ...data, id: `N${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}` };
                            const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
                            notifications.push(newNotification);
                            localStorage.setItem('notifications', JSON.stringify(notifications));
                            resolve(newNotification);
                        }
                        break;
                    default:
                        resolve({ error: 'Endpoint not found' });
                }
            }, 500); // Simulated network delay
        });
    }

    // === Public API Methods ===
    window.api = {
        getClients: () => apiFetch('/clients'),
        addClient: (client) => apiFetch('/clients', 'POST', client),
        getCases: () => apiFetch('/cases'),
        addCase: (caseData) => apiFetch('/cases', 'POST', caseData),
        getDocuments: () => apiFetch('/documents'),
        addDocument: (doc) => apiFetch('/documents', 'POST', doc),
        getForums: () => apiFetch('/forums'),
        addForum: (forum) => apiFetch('/forums', 'POST', forum),
        getNotifications: () => apiFetch('/notifications'),
        addNotification: (notification) => apiFetch('/notifications', 'POST', notification)
    };

    // === Initial Data Sync ===
    async function syncInitialData() {
        const clients = await api.getClients();
        const cases = await api.getCases();
        const documents = await api.getDocuments();
        const forums = await api.getForums();
        const notifications = await api.getNotifications();
        console.log('Initial API Sync:', { clients, cases, documents, forums, notifications });
    }

    syncInitialData();

    // === Example Usage (For Testing) ===
    document.getElementById('add-client-btn')?.addEventListener('click', async () => {
        const newClient = { name: 'Test Client', email: 'test@example.com', phone: '555-555-5555', cases: [], address: 'N/A', status: 'Active', created: new Date().toISOString().split('T')[0] };
        const result = await api.addClient(newClient);
        console.log('Added Client via API:', result);
    });
});
