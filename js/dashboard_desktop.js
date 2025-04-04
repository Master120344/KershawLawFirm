                        </button>
                    </div>
                </div>
            </div>
        </header>
        <main class="main-content scrollable" id="main-content-area">
            <div class="loading-overlay" id="loading-overlay">
                <div class="spinner"></div>
            </div>
            <!-- == Overview Content == -->
            <div id="overview-content" class="content-section is-active">
                <div class="content-header">
                    <h2>Dashboard Overview</h2>
                    <div class="header-actions">
                        <button class="button primary small">➕ Widget</button>
                        <button class="button secondary small">🔧 Customize</button>
                    </div>
                </div>
                <p class="section-description">Key metrics and quick access to important areas.</p>
                <div class="widget-grid">
                    <div class="widget clickable" data-link-target="cases-content">
                        <div class="widget-icon">📁</div>
                        <div class="widget-content">
                            <h3 class="widget-title">Active Cases</h3>
                            <p class="widget-data">28</p>
                            <p class="widget-change up">+3 this week</p>
                        </div>
                    </div>
                    <div class="widget clickable" data-link-target="tasks-content">
                        <div class="widget-icon">✅</div>
                        <div class="widget-content">
                            <h3 class="widget-title">Pending Tasks</h3>
                            <p class="widget-data">14</p>
                            <p class="widget-change overdue">5 Overdue</p>
                        </div>
                    </div>
                    <div class="widget clickable" data-link-target="calendar-content">
                        <div class="widget-icon">📅</div>
                        <div class="widget-content">
                            <h3 class="widget-title">Upcoming Deadlines</h3>
                            <p class="widget-data">6</p>
                            <p class="widget-change">Next: Filing (J. Doe)</p>
                        </div>
                    </div>
                    <div class="widget clickable" data-link-target="documents-content">
                        <div class="widget-icon">📄</div>
                        <div class="widget-content">
                            <h3 class="widget-title">Docs Awaiting Review</h3>
                            <p class="widget-data">9</p>
                            <p class="widget-change">Client Uploads: 4</p>
                        </div>
                    </div>
                </div>
                <div class="content-row">
                    <div class="content-panel column-2">
                        <h3>Recent Activity</h3>
                        <ul class="activity-feed">
                            <li>
                                <span class="activity-icon">👤</span>
                                New client 'Acme Corp' added. <span class="timestamp">1h ago</span>
                            </li>
                            <li>
                                <span class="activity-icon">📎</span>
                                Document 'Passport - J. Smith' uploaded. <span class="timestamp">3h ago</span>
                            </li>
                            <li>
                                <span class="activity-icon">🔄</span>
                                Case #H2B-012 status changed to 'RFE Received'. <span class="timestamp">5h ago</span>
                            </li>
                            <li>
                                <span class="activity-icon">✔️</span>
                                Task 'Prepare LCA - Farm LLC' completed. <span class="timestamp">Yesterday</span>
                            </li>
                        </ul>
                    </div>
                    <div class="content-panel column-1">
                        <h3>Quick Links</h3>
                        <ul class="quick-links">
                            <li>
                                <a href="#cases" data-target="cases-content" class="nav-link-trigger">➕ Start New Case</a>
                            </li>
                            <li>
                                <a href="#clients" data-target="clients-content" class="nav-link-trigger">➕ Add New Client</a>
                            </li>
                            <li>
                                <a href="#tasks" data-target="tasks-content" class="nav-link-trigger">➕ Create Task</a>
                            </li>
                            <li>
                                <a href="#calendar" data-target="calendar-content" class="nav-link-trigger">View Calendar</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <!-- == Clients Content == -->
            <div id="clients-content" class="content-section">
                <div class="content-header">
                    <h2>Client Management</h2>
                    <div class="header-actions">
                        <!-- Fixed missing id/name -->
                        <input type="search" id="client-search-input" name="clientSearch" placeholder="Search clients..." class="table-search">
                        <button class="button secondary small">⚖️ Filters</button>
                        <button class="button primary small">➕ Add Client</button>
                    </div>
                </div>
                <p class="section-description">View, search, and manage client information.</p>
                <div class="placeholder-table">Client Data Table Goes Here...</div>
            </div>
            <!-- == Cases Content == -->
            <div id="cases-content" class="content-section">
                <div class="content-header">
                    <h2>Case Management</h2>
                    <div class="header-actions">
                        <!-- Fixed missing id/name -->
                        <input type="search" id="case-search-input" name="caseSearch" placeholder="Search cases..." class="table-search">
                        <button class="button secondary small">⚖️ Filters</button>
                        <button class="button primary small">➕ Add Case</button>
                    </div>
                </div>
                <p class="section-description">Track H2A/H2B cases, deadlines, and statuses.</p>
                <div class="placeholder-table">Case Data Table Goes Here...</div>
            </div>
            <!-- == Documents Content == -->
            <div id="documents-content" class="content-section">
                <div class="content-header">
                    <h2>Document Generator & eSign</h2>
                    <div class="header-actions"></div>
                </div>
                <p class="section-description">Generate preliminary agreements and manage eSignature requests.</p>
                <div class="content-row docusign-layout">
                    <div class="docusign-column-main">
                        <div class="content-panel mb-3" id="pending-signatures-panel">
                            <h3>Pending Signatures</h3>
                            <ul id="pending-signatures-list" class="pending-list">
                                <li data-id="req-001">
                                    <span class="pending-name">John Doe (H2B Agreement)</span>
                                    <span class="pending-status pending">Sent: Oct 25</span>
                                    <button class="icon-button subtle tiny" title="Resend">🔁</button>
                                </li>
                                <li data-id="req-002">
                                    <span class="pending-name">Acme Corp (H2A Retainer)</span>
                                    <span class="pending-status error">Error</span>
                                    <button class="icon-button subtle tiny" title="View Error">❗</button>
                                </li>
                                <li class="no-pending" style="display: none;">No documents currently pending signature.</li>
                            </ul>
                        </div>
                        <div class="content-panel">
                            <form id="docusign-generator-form" class="docusign-form">
                                <h3>Generate New Agreement</h3>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="client-first-name" class="form-label">Client First Name</label>
                                        <input type="text" id="client-first-name" name="clientFirstName" class="form-control" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="client-last-name" class="form-label">Client Last Name</label>
                                        <input type="text" id="client-last-name" name="clientLastName" class="form-control" required>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="client-email" class="form-label">Client Email (for Signature)</label>
                                    <input type="email" id="client-email" name="clientEmail" class="form-control" required>
                                </div>
                                <div class="form-group">
                                    <label for="client-phone" class="form-label">Client Phone (Optional)</label>
                                    <input type="tel" id="client-phone" name="clientPhone" class="form-control" placeholder="e.g., 555-123-4567">
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="case-id" class="form-label">Case ID (Optional)</label>
                                        <input type="text" id="case-id" name="caseId" class="form-control" placeholder="e.g., H2B-015">
                                    </div>
                                    <div class="form-group">
                                        <label for="visa-type" class="form-label">Visa Type</label>
                                        <select id="visa-type" name="visaType" class="form-control" required>
                                            <option value="" disabled selected>Select Visa Program...</option>
                                            <option value="H-2A">H-2A (Agricultural)</option>
                                            <option value="H-2B">H-2B (Non-Agricultural)</option>
                                            <option value="Both">Both H-2A & H-2B</option>
                                            <option value="Other">Other/Consultation</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="employer-name" class="form-label">Employer Name</label>
                                    <input type="text" id="employer-name" name="employerName" class="form-control" required>
                                </div>
                                <fieldset class="form-fieldset">
                                    <legend class="form-legend">Agreement Terms</legend>
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label for="legal-fee" class="form-label">Legal Fee ($)</label>
                                            <input type="number" id="legal-fee" name="legalFee" class="form-control" step="0.01" min="0" required placeholder="e.g., 5000.00">
                                        </div>
                                        <div class="form-group">
                                            <label for="filing-fee" class="form-label">Est. Filing Fees ($)</label>
                                            <input type="number" id="filing-fee" name="filingFee" class="form-control" step="0.01" min="0" placeholder="e.g., 1500.00">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="payment-terms" class="form-label">Payment Terms / Scope</label>
                                        <textarea id="payment-terms" name="paymentTerms" class="form-control" rows="4" placeholder="e.g., 50% retainer upon signing, balance due upon case filing. Scope includes..." required></textarea>
                                    </div>
                                </fieldset>
                                <div class="form-actions">
                                    <button type="submit" id="generate-preview-btn" class="button primary">📄 Generate Preview</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="docusign-column-preview">
                        <div class="content-panel sticky-preview" id="preview-panel" style="display: none;">
                            <div class="preview-header">
                                <h3>Document Preview</h3>
                                <button class="icon-button subtle close-preview" id="close-preview-btn" title="Close Preview">✕</button>
                            </div>
                            <div id="document-preview-area" class="document-preview">Preview will appear here...</div>
                            <div class="form-actions preview-actions">
                                <button type="button" id="send-email-btn" class="button success" disabled>📧 Send for Signature</button>
                                <button type="button" id="download-pdf-btn" class="button secondary" disabled>💾 Download PDF (Simulated)</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- == Calendar Content == -->
            <div id="calendar-content" class="content-section">
                <div class="content-header">
                    <h2>Firm Calendar</h2>
                    <div class="header-actions">
                        <button class="button secondary small">👁️ View Options</button>
                        <button class="button secondary small">⚖️ Filter</button>
                        <button class="button primary small">➕ Add Event</button>
                    </div>
                </div>
                <p class="section-description">Overview of key dates, deadlines, and appointments.</p>
                <div class="calendar-container card-style">
                    <div class="calendar-header">
                        <button id="prev-month-btn" class="calendar-nav-btn" title="Previous Month">‹</button>
                        <h3 id="month-year" class="calendar-month-title">Month Year</h3>
                        <button id="next-month-btn" class="calendar-nav-btn" title="Next Month">›</button>
                        <button id="today-btn" class="button secondary tiny" title="Go to Today">Today</button>
                    </div>
                    <div class="calendar-weekdays">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                    </div>
                    <div class="calendar-grid" id="calendar-days"></div>
                </div>
                <div class="content-panel mt-3">
                    <h3>Upcoming Deadlines & Events</h3>
                    <ul class="upcoming-events-list">
                        <li>
                            <span class="event-date">Oct 28</span>
                            Filing Deadline - Case #H2A-015 <span class="event-time">EOD</span>
                        </li>
                        <li>
                            <span class="event-date">Oct 30</span>
                            Client Meeting - Acme Corp <span class="event-time">10:00 AM</span>
                        </li>
                        <li>
                            <span class="event-date">Nov 02</span>
                            RFE Response Due - Case #H2B-007 <span class="event-time">EOD</span>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- == Tasks Content == -->
            <div id="tasks-content" class="content-section">
                <div class="content-header">
                    <h2>Tasks & Reminders</h2>
                    <div class="header-actions">
                        <button class="button secondary small">⚖️ Filter Tasks</button>
                        <button class="button secondary small">📋 View As</button>
                        <button class="button primary small">➕ Add Task</button>
                    </div>
                </div>
                <p class="section-description">Manage your workload and track important action items.</p>
                <div class="placeholder-table">Task List / Kanban Board Goes Here...</div>
            </div>
            <!-- == Analytics Content == -->
            <div id="analytics-content" class="content-section">
                <div class="content-header">
                    <h2>Reporting & Analytics</h2>
                    <div class="header-actions">
                        <button class="button secondary small">🗓️ Date Range</button>
                        <button class="button secondary small">📄 Generate Report</button>
                        <button class="button secondary small">💾 Export Data</button>
                    </div>
                </div>
                <p class="section-description">Visualize key performance indicators and case trends.</p>
                <div class="placeholder-complex">Chart Components (Approval Rates, Processing Times, etc.) Go Here...</div>
            </div>
            <!-- == AI Assistant Content == -->
            <div id="ai-content" class="content-section">
                <div class="content-header">
                    <h2>AI Legal Assistant</h2>
                    <div class="header-actions">
                        <button class="button secondary small">💬 History</button>
                    </div>
                </div>
                <p class="section-description">Utilize AI for insights, summaries, and assistance.</p>
                <div class="placeholder-complex ai-panel">
                    <p>AI Chat Window & Suggestion Tools Go Here...</p>
                    <p>
                        <em>"I am your Kershaw Law Visa Assistant AI. How can I help?"</em>
                    </p>
                </div>
            </div>
            <!-- == Settings Content == -->
            <div id="settings-content" class="content-section">
                <div class="content-header">
                    <h2>System Settings</h2>
                    <div class="header-actions">
                        <button class="button primary small" disabled>💾 Save Changes</button>
                    </div>
                </div>
                <p class="section-description">Manage user accounts, integrations, and preferences.</p>
                <div class="placeholder-complex">Settings Forms (User Management, Notifications, API Keys) Go Here...</div>
            </div>
        </main>
    </div>
    <!-- End Main Wrapper -->
</div>
<!-- End Dashboard Container -->
<!-- === SCRIPT PATHS MUST MATCH YOUR REPOSITORY FOLDER STRUCTURE === -->
<!-- These paths assume a 'js' (lowercase) folder exists next to this HTML file -->
<script src="js/dashboard_desktop.js"></script>
<script src="js/docusign_desktop.js"></script> THIS WHOLE FILE YOU SENT ME YOU WANT ME TO PUT THERIS WHERE
