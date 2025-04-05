@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Roboto:wght@300;400;500&display=swap');

:root {
    --color-background-base: #0a0b0d;
    --color-background-darker: #101216;
    --color-background-dark: #15181e;
    --color-background-medium: #1b2028;
    --color-background-light: #232832;
    --color-background-lighter: #2d333f;
    --color-background-lightest: #3c4352;

    --color-primary-red: #b82f21;
    --color-primary-red-dark: #96261a;
    --color-primary-red-light: #d63b2c;
    --color-primary-red-glow: rgba(214, 59, 44, 0.25);

    --color-text-primary: #e2e2e2;
    --color-text-secondary: #9aa0ae;
    --color-text-headings: #ffffff;
    --color-text-accent: var(--color-primary-red-light);
    --color-text-on-red: #ffffff;

    --color-border-base: #000000;
    --color-border-dark: #1a1e25;
    --color-border-medium: #2a2f3a;
    --color-border-light: #4a5160;
    --color-border-accent: var(--color-primary-red);

    --color-success: #28a745;
    --color-success-glow: rgba(40, 167, 69, 0.3);
    --color-warning: #ffc107;
    --color-warning-glow: rgba(255, 193, 7, 0.3);
    --color-danger: var(--color-primary-red);
    --color-danger-glow: var(--color-primary-red-glow);
    --color-info: #17a2b8;
    --color-info-glow: rgba(23, 162, 184, 0.3);

    --color-shadow-soft: rgba(0, 0, 0, 0.2);
    --color-shadow-medium: rgba(0, 0, 0, 0.4);
    --color-shadow-hard: rgba(0, 0, 0, 0.6);
    --color-shadow-inset: rgba(0, 0, 0, 0.25);
    --color-shadow-glow: rgba(255, 255, 255, 0.02);

    --font-primary: 'EB Garamond', serif;
    --font-secondary: 'Roboto', sans-serif;
    --font-display: 'Cinzel', serif;

    --spacing-xs: 5px;
    --spacing-sm: 10px;
    --spacing-md: 14px;
    --spacing-lg: 18px;
    --spacing-xl: 24px;
    --spacing-xxl: 32px;
    --border-radius-sm: 4px;
    --border-radius-md: 8px;
    --border-radius-lg: 12px;

    --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-medium: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-content: 0.45s cubic-bezier(0.4, 0, 0.2, 1);

    --z-index-background: -10;
    --z-index-content: 1;
    --z-index-sidebar: 100;
    --z-index-header: 200;
    --z-index-dropdown: 300;
    --z-index-overlay: 500;
    --z-index-modal: 1000;
}

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { font-size: 16px; scroll-behavior: smooth; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; height: 100%; overflow: hidden; -webkit-overflow-scrolling: touch; }
body { font-family: var(--font-secondary); background-color: var(--color-background-base); color: var(--color-text-primary); line-height: 1.6; font-size: 1rem; height: 100%; overflow: hidden; position: relative; }
body.preload * { transition: none !important; animation: none !important; }
a { color: var(--color-text-accent); text-decoration: none; transition: color var(--transition-fast); }
a:hover { color: var(--color-primary-red-light); text-decoration: none; }
img { max-width: 100%; height: auto; display: block; }
input, button, select, textarea { font-family: inherit; font-size: inherit; line-height: inherit; color: inherit; background: none; border: none; }
button { cursor: pointer; touch-action: manipulation; }
ul, ol { list-style: none; }

.background-layer { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: var(--z-index-background); }
.layer-1 { background: linear-gradient(165deg, rgba(15, 17, 20, 0.6) 0%, rgba(21, 24, 30, 0.8) 50%, rgba(184, 47, 33, 0.05) 100%); opacity: 0.9; }
.layer-2 { background: url('https://www.transparenttextures.com/patterns/old-map.png') repeat; background-size: 300px 300px; opacity: 0.04; mix-blend-mode: overlay; animation: backgroundShift 90s linear infinite; }
@keyframes backgroundShift { 0% { background-position: 0 0; } 50% { background-position: 150px 75px; } 100% { background-position: 0 0; } }

.dashboard-container { display: flex; flex-direction: column; height: 100vh; width: 100vw; position: fixed; top: 0; left: 0; overflow: hidden; }

.sidebar { position: fixed; top: 0; left: -100%; width: 80%; max-width: 280px; height: 100%; background: linear-gradient(180deg, var(--color-background-darker) 0%, #0d0f12 100%); border-right: 1px solid var(--color-border-base); box-shadow: 4px 0 20px rgba(0, 0, 0, 0.4); display: flex; flex-direction: column; padding: 0; color: var(--color-text-secondary); z-index: var(--z-index-sidebar); transition: left var(--transition-medium); }
.sidebar.open { left: 0; }
.sidebar-header { padding: 0 var(--spacing-md); height: 60px; border-bottom: 1px solid var(--color-border-dark); display: flex; align-items: center; justify-content: space-between; background: linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0)); }
.sidebar-logo-link { display: flex; align-items: center; gap: var(--spacing-sm); text-decoration: none; color: inherit; transition: transform var(--transition-fast); }
.sidebar-logo-link:hover, .sidebar-logo-link:active { transform: scale(1.02); filter: brightness(1.1); }
.sidebar-logo { width: 28px; height: 28px; background: linear-gradient(145deg, var(--color-primary-red-light), var(--color-primary-red)); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-weight: 700; font-size: 0.8rem; color: var(--color-text-on-red); box-shadow: 0 2px 4px var(--color-primary-red-glow), inset 0 -1px 2px rgba(0,0,0,0.3); }
.sidebar-title { font-family: var(--font-display); font-weight: 600; font-size: 1rem; color: var(--color-text-headings); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: 0.8px; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
#sidebar-toggle { font-size: 1.2rem; color: var(--color-text-secondary); background: none; border: none; padding: 0 var(--spacing-sm); }
.sidebar-nav { flex-grow: 1; overflow-y: auto; overflow-x: hidden; padding: var(--spacing-md) 0; }
.sidebar-nav { scrollbar-width: thin; scrollbar-color: var(--color-border-light) transparent; }
.sidebar-nav::-webkit-scrollbar { width: 6px; }
.sidebar-nav::-webkit-scrollbar-track { background: transparent; }
.sidebar-nav::-webkit-scrollbar-thumb { background-color: var(--color-border-light); border-radius: 3px; border: 1px solid var(--color-background-darker); }
.sidebar-nav::-webkit-scrollbar-thumb:hover { background-color: var(--color-border-light); }
.sidebar-nav ul { list-style: none; }
.sidebar-nav li a.nav-link { display: flex; align-items: center; padding: 10px var(--spacing-md); margin: 4px var(--spacing-sm); color: var(--color-text-secondary); font-family: var(--font-secondary); font-size: 0.95rem; font-weight: 400; border-radius: var(--border-radius-md); transition: all var(--transition-medium); position: relative; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; gap: var(--spacing-sm); border: 1px solid transparent; background: transparent; }
.sidebar-nav li a.nav-link::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%) scaleX(0); transform-origin: left; width: 4px; height: 20px; background-color: var(--color-primary-red); border-radius: 0 2px 2px 0; transition: transform var(--transition-medium), opacity var(--transition-medium); opacity: 0; box-shadow: 0 0 6px var(--color-primary-red-glow); }
.nav-icon { flex-shrink: 0; width: 22px; text-align: center; transition: color var(--transition-fast), transform var(--transition-fast), filter var(--transition-medium); font-size: 1rem; line-height: 1; opacity: 0.7; filter: grayscale(50%); }
.nav-text { flex-grow: 1; transition: opacity var(--transition-medium), transform var(--transition-fast); }
.sidebar-nav li a.nav-link:hover, .sidebar-nav li a.nav-link:active { background-color: var(--color-background-light); color: var(--color-text-primary); border-color: var(--color-border-medium); box-shadow: 0 2px 6px rgba(0,0,0,0.2); }
.sidebar-nav li a.nav-link:hover .nav-icon, .sidebar-nav li a.nav-link:active .nav-icon { color: var(--color-primary-red-light); opacity: 1; transform: scale(1.1) rotate(-5deg); filter: grayscale(0%); }
.sidebar-nav li a.nav-link:hover .nav-text, .sidebar-nav li a.nav-link:active .nav-text { transform: translateX(3px); }
.sidebar-nav li a.nav-link.active { background: linear-gradient(90deg, var(--color-background-light) 0%, var(--color-background-lighter) 100%); color: var(--color-text-headings); font-weight: 500; border-color: var(--color-border-dark); box-shadow: inset 0 1px 4px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.1); }
.sidebar-nav li a.nav-link.active::before { transform: translateY(-50%) scaleX(1); opacity: 1; }
.sidebar-nav li a.nav-link.active .nav-icon { color: var(--color-primary-red-light); opacity: 1; filter: grayscale(0%); transform: scale(1.05); }
.sidebar-nav li a.nav-link:focus-visible { outline: none; border-color: var(--color-primary-red-light); box-shadow: inset 0 0 8px rgba(0,0,0,0.2), 0 0 0 2px var(--color-primary-red-glow); }
.sidebar-footer { padding: var(--spacing-sm) var(--spacing-md); border-top: 1px solid var(--color-border-dark); margin-top: auto; flex-shrink: 0; background-color: rgba(0,0,0,0.15); }
.connection-status { display: flex; align-items: center; font-size: 0.75rem; color: var(--color-text-secondary); margin-bottom: var(--spacing-sm); font-family: var(--font-secondary); }
.status-indicator { width: 8px; height: 8px; border-radius: 50%; margin-right: var(--spacing-sm); background-color: var(--color-danger); box-shadow: 0 0 5px var(--color-danger); transition: background-color var(--transition-slow), box-shadow var(--transition-slow); border: 1px solid rgba(0,0,0,0.5); }
.status-indicator.online { background-color: var(--color-success); box-shadow: 0 0 5px var(--color-success); }
.status-indicator.connecting { background-color: var(--color-warning); box-shadow: 0 0 5px var(--color-warning); animation: pulse 1.5s infinite ease-in-out; }
.copyright { font-size: 0.7rem; color: #555; text-align: center; }

.main-wrapper { flex-grow: 1; display: flex; flex-direction: column; background-color: var(--color-background-medium); position: relative; overflow: hidden; }

.header { display: flex; justify-content: space-between; align-items: center; padding: 0 var(--spacing-md); background: var(--color-background-dark); border-bottom: 1px solid var(--color-border-base); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.45); height: 50px; flex-shrink: 0; z-index: var(--z-index-header); position: relative; }
.header-left { display: flex; align-items: center; gap: var(--spacing-sm); }
.header-main-title { font-family: var(--font-display); font-size: 1.1rem; color: var(--color-text-headings); font-weight: 600; white-space: nowrap; letter-spacing: 0.5px; text-shadow: 0 1px 2px rgba(0,0,0,0.5); overflow: hidden; text-overflow: ellipsis; max-width: 50%; }
.header-right { display: flex; align-items: center; gap: var(--spacing-sm); }
.icon-button { color: var(--color-text-secondary); font-size: 1.1rem; width: 32px; height: 32px; border-radius: 50%; position: relative; transition: color var(--transition-fast), background-color var(--transition-fast), transform var(--transition-fast); background: none; border: none; display: inline-flex; align-items: center; justify-content: center; }
.icon-button.subtle { font-size: 0.9rem; width: 28px; height: 28px; }
.icon-button:hover, .icon-button:active { color: var(--color-text-primary); background-color: var(--color-background-lighter); transform: scale(1.1); }
.icon-button .icon-placeholder { display: block; line-height: 1; }
.notification-button .notification-badge { position: absolute; top: 0px; right: 0px; background: linear-gradient(135deg, var(--color-primary-red-light), var(--color-danger)); color: var(--color-text-on-red); border-radius: 50%; width: 18px; height: 18px; font-size: 0.7rem; font-weight: 700; display: flex; align-items: center; justify-content: center; line-height: 1; font-family: var(--font-secondary); box-shadow: 0 0 6px var(--color-danger-glow); border: 1px solid var(--color-background-dark); animation: pulse-badge 2s infinite ease-in-out; }
.profile-menu-container { position: relative; }
.profile-button { display: flex; align-items: center; gap: var(--spacing-xs); padding: 4px 6px; border-radius: var(--border-radius-md); transition: background-color var(--transition-fast); border: 1px solid transparent; background: none; }
.profile-button:hover, .profile-button:active { background-color: var(--color-background-lighter); border-color: var(--color-border-medium); }
.profile-avatar { width: 30px; height: 30px; border-radius: 50%; border: 2px solid var(--color-border-light); object-fit: cover; background-color: var(--color-background-lighter); box-shadow: 0 2px 4px var(--color-shadow-medium); }
.profile-name { font-family: var(--font-secondary); font-size: 0.85rem; font-weight: 500; color: var(--color-text-primary); display: none; }
.profile-arrow { font-size: 0.7rem; color: var(--color-text-secondary); transition: transform var(--transition-medium); }
.profile-button:hover .profile-arrow, .profile-button:active .profile-arrow { transform: rotate(180deg); }
.profile-dropdown { position: absolute; top: calc(100% + 10px); right: 0; background-color: var(--color-background-light); border: 1px solid var(--color-border-dark); border-radius: var(--border-radius-md); box-shadow: 0 8px 25px var(--color-shadow-hard); width: 180px; padding: var(--spacing-sm) 0; z-index: var(--z-index-dropdown); opacity: 0; visibility: hidden; transform: translateY(10px) scale(0.98); transform-origin: top right; transition: opacity var(--transition-medium), transform var(--transition-medium), visibility var(--transition-medium); backdrop-filter: blur(3px); }
.profile-menu-container:hover .profile-dropdown, .profile-button:focus + .profile-dropdown, .profile-dropdown:hover { opacity: 1; visibility: visible; transform: translateY(0) scale(1); }
.profile-dropdown a, .profile-dropdown button { display: flex; align-items: center; gap: var(--spacing-sm); padding: 9px var(--spacing-md); color: var(--color-text-secondary); font-family: var(--font-secondary); font-size: 0.85rem; width: 100%; text-align: left; transition: background-color var(--transition-fast), color var(--transition-fast); background: none; border: none; }
.profile-dropdown a:hover, .profile-dropdown button:hover, .profile-dropdown a:active, .profile-dropdown button:active { background-color: var(--color-background-lighter); color: var(--color-text-primary); }
.profile-dropdown .icon-placeholder { width: 16px; text-align: center; color: var(--color-text-secondary); font-size: 0.9rem; transition: color var(--transition-fast); }
.profile-dropdown a:hover .icon-placeholder, .profile-dropdown button:hover .icon-placeholder { color: var(--color-primary-red-light); }
.dropdown-divider { height: 1px; background-color: var(--color-border-medium); margin: var(--spacing-sm) 0; }
.logout-button-dropdown { color: var(--color-danger); }
.logout-button-dropdown:hover, .logout-button-dropdown:active { background-color: var(--color-danger-glow); color: var(--color-danger); }
.logout-button-dropdown:hover .icon-placeholder, .logout-button-dropdown:active .icon-placeholder { color: var(--color-danger); }

.main-content { flex-grow: 1; position: relative; overflow: hidden; background-color: transparent; }
.loading-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(15, 17, 20, 0.85); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: var(--z-index-overlay); opacity: 0; visibility: hidden; transition: opacity var(--transition-medium), visibility var(--transition-medium); pointer-events: none; }
.loading-overlay.is-active { opacity: 1; visibility: visible; pointer-events: auto; }
.spinner { width: 45px; height: 45px; border: 4px solid var(--color-border-light); border-top-color: var(--color-primary-red); border-radius: 50%; animation: spin 1s linear infinite; box-shadow: 0 0 12px var(--color-primary-red-glow); }

.content-section { position: absolute; top: 0; left: 0; width: 100%; height: 100%; padding: var(--spacing-md) var(--spacing-lg); overflow-y: auto; opacity: 0; visibility: hidden; transform: scale(1.02) translateY(10px); transition: opacity var(--transition-content), transform var(--transition-content), visibility var(--transition-content); z-index: var(--z-index-content); will-change: transform, opacity; background: transparent; }
.content-section.is-active { opacity: 1; visibility: visible; transform: scale(1) translateY(0); z-index: calc(var(--z-index-content) + 1); }
.content-section.is-exiting { opacity: 0; visibility: hidden; transform: scale(0.98) translateY(-10px); z-index: var(--z-index-content); }
.content-section { scrollbar-width: thin; scrollbar-color: var(--color-border-light) transparent; }
.content-section::-webkit-scrollbar { width: 6px; height: 6px; }
.content-section::-webkit-scrollbar-track { background: transparent; }
.content-section::-webkit-scrollbar-thumb { background-color: var(--color-border-light); border-radius: 3px; border: 1px solid var(--color-background-medium); }
.content-section::-webkit-scrollbar-thumb:hover { background-color: var(--color-border-light); }

.content-header { display: flex; flex-direction: column; align-items: flex-start; margin-bottom: var(--spacing-md); padding-bottom: var(--spacing-sm); border-bottom: 1px solid var(--color-border-medium); min-height: 30px; }
.content-header h2 { font-family: var(--font-display); font-size: 1.3rem; color: var(--color-text-headings); font-weight: 600; margin: 0 0 var(--spacing-sm) 0; letter-spacing: 0.5px; text-shadow: 0 1px 2px rgba(0,0,0,0.4); }
.header-actions { display: flex; flex-wrap: wrap; align-items: center; gap: var(--spacing-sm); width: 100%; }
.section-description { font-size: 0.9rem; color: var(--color-text-secondary); margin-bottom: var(--spacing-lg); border-left: 3px solid var(--color-border-medium); padding-left: var(--spacing-sm); background: rgba(0,0,0,0.05); padding: var(--spacing-xs) var(--spacing-sm); border-radius: 0 var(--border-radius-sm) var(--border-radius-sm) 0; }

.widget-grid { display: flex; flex-direction: column; gap: var(--spacing-md); margin-bottom: var(--spacing-lg); }
.widget { background: linear-gradient(145deg, var(--color-background-light) 0%, #272c38 100%); border-radius: var(--border-radius-lg); box-shadow: 0 6px 20px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.04); border: 1px solid var(--color-border-dark); padding: var(--spacing-md); display: flex; gap: var(--spacing-md); align-items: center; transition: all var(--transition-medium); position: relative; overflow: hidden; }
.widget::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%); opacity: 0.7; }
.widget.clickable { cursor: pointer; }
.widget.clickable:hover, .widget.clickable:active { transform: translateY(-6px) scale(1.02); box-shadow: 0 12px 30px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.04); border-color: var(--color-border-medium); z-index: 10; }
.widget-icon { flex-shrink: 0; width: 40px; height: 40px; border-radius: var(--border-radius-md); background: linear-gradient(145deg, var(--color-background-lighter), var(--color-background-light)); color: var(--color-primary-red-light); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; box-shadow: 0 3px 8px rgba(0,0,0,0.25), inset 0 -1px 2px rgba(0,0,0,0.3); border: 1px solid var(--color-border-medium); transition: all var(--transition-medium); }
.widget.clickable:hover .widget-icon, .widget.clickable:active .widget-icon { transform: rotate(-8deg) scale(1.1); color: var(--color-text-headings); background: linear-gradient(145deg, var(--color-primary-red), var(--color-primary-red-dark)); box-shadow: 0 5px 12px var(--color-primary-red-glow), inset 0 -1px 2px rgba(0,0,0,0.3); }
.widget-content { flex-grow: 1; }
.widget-title { font-family: var(--font-secondary); font-size: 0.75rem; font-weight: 500; color: var(--color-text-secondary); margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.8px; }
.widget-data { font-family: var(--font-display); font-size: 1.8rem; font-weight: 700; color: var(--color-text-headings); line-height: 1.1; margin-bottom: 4px; text-shadow: 0 1px 2px rgba(0,0,0,0.4); }
.widget-change { font-family: var(--font-secondary); font-size: 0.8rem; font-weight: 500; display: inline-flex; align-items: center; gap: 3px; }
.widget-change::before { content: ''; display: inline-block; width: 0; height: 0; border-left: 3px solid transparent; border-right: 3px solid transparent; margin-right: 2px; transition: transform var(--transition-fast); }
.widget.clickable:hover .widget-change::before, .widget.clickable:active .widget-change::before { transform: scale(1.2); }
.widget-change.up { color: var(--color-success); }
.widget-change.up::before { border-bottom: 4px solid var(--color-success); }
.widget-change.down, .widget-change.overdue { color: var(--color-danger); }
.widget-change.down::before, .widget-change.overdue::before { border-top: 4px solid var(--color-danger); }
.widget-change.neutral { color: var(--color-text-secondary); }
.widget-change.neutral::before { content: '–'; border: none; width: auto; height: auto; margin-right: 4px; font-weight: bold; font-size: 1em; }

.content-row { display: flex; flex-direction: column; gap: var(--spacing-md); margin-bottom: var(--spacing-lg); }
.content-panel { background-color: var(--color-background-light); border-radius: var(--border-radius-lg); padding: var(--spacing-md); border: 1px solid var(--color-border-dark); box-shadow: 0 4px 12px var(--color-shadow-soft), inset 0 1px 2px var(--color-shadow-glow); transition: box-shadow var(--transition-medium), border-color var(--transition-medium), transform var(--transition-medium); }
.content-panel:hover, .content-panel:active { box-shadow: 0 6px 20px var(--color-shadow-medium), inset 0 1px 2px var(--color-shadow-glow); border-color: var(--color-border-medium); transform: translateY(-2px); }
.content-panel.column-1, .content-panel.column-2, .content-panel.column-3 { flex: none; width: 100%; }
.content-panel h3 { font-family: var(--font-display); font-size: 1rem; color: var(--color-text-headings); margin: -4px 0 var(--spacing-md) 0; padding-bottom: var(--spacing-sm); border-bottom: 1px solid var(--color-border-medium); font-weight: 600; letter-spacing: 0.3px; text-shadow: 0 1px 2px rgba(0,0,0,0.3); }

.activity-feed { list-style: none; max-height: 300px; overflow-y: auto; padding-right: var(--spacing-xs); margin: 0; padding: 0; }
.activity-feed li { display: flex; gap: var(--spacing-sm); padding: 10px var(--spacing-xs); font-size: 0.85rem; border-bottom: 1px solid var(--color-border-medium); color: var(--color-text-secondary); transition: background-color var(--transition-fast), border-left-color var(--transition-medium); border-left: 3px solid transparent; }
.activity-feed li:last-child { border-bottom: none; }
.activity-feed li:hover, .activity-feed li:active { background-color: rgba(255,255,255,0.02); border-left-color: var(--color-primary-red); }
.activity-icon { flex-shrink: 0; color: var(--color-primary-red); width: 18px; text-align: center; font-size: 1em; opacity: 0.9; }
.timestamp { margin-left: auto; font-size: 0.75rem; color: #666; white-space: nowrap; padding-left: var(--spacing-sm); background: var(--color-background-dark); padding: 2px 5px; border-radius: var(--border-radius-sm); font-weight: 300; }

.quick-links { list-style: none; }
.quick-links li { margin-bottom: var(--spacing-sm); }
.quick-links a { display: block; padding: 8px var(--spacing-md); background-color: transparent; border-radius: var(--border-radius-md); color: var(--color-text-secondary); font-family: var(--font-secondary); font-size: 0.85rem; transition: all var(--transition-medium); border: 1px solid var(--color-border-medium); position: relative; overflow: hidden; box-shadow: inset 0 1px 1px rgba(255,255,255,0.03); }
.quick-links a::before { content: '›'; position: absolute; left: var(--spacing-md); top: 50%; transform: translateY(-50%) translateX(-20px); opacity: 0; color: var(--color-primary-red); transition: all var(--transition-medium); font-weight: bold; font-size: 1.1em; }
.quick-links a:hover, .quick-links a:active { background-color: var(--color-background-lighter); color: var(--color-text-primary); border-color: var(--color-border-light); padding-left: 34px; box-shadow: 0 2px 4px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.03); }
.quick-links a:hover::before, .quick-links a:active::before { transform: translateY(-50%) translateX(0); opacity: 1; }

.form-group { margin-bottom: var(--spacing-md); }
.form-label { display: block; font-family: var(--font-secondary); font-size: 0.75rem; font-weight: 500; color: var(--color-text-secondary); margin-bottom: var(--spacing-xs); text-transform: uppercase; letter-spacing: 0.8px; }
.form-control { display: block; width: 100%; padding: 9px var(--spacing-md); background-color: var(--color-background-dark); border: 1px solid var(--color-border-medium); border-radius: var(--border-radius-md); color: var(--color-text-primary); font-size: 0.9rem; transition: border-color var(--transition-medium), box-shadow var(--transition-medium), background-color var(--transition-medium); box-shadow: inset 0 1px 4px var(--color-shadow-inset); }
.form-control:focus { outline: none; border-color: var(--color-primary-red); box-shadow: inset 0 1px 4px var(--color-shadow-inset), 0 0 0 2px var(--color-primary-red-glow); background-color: var(--color-background-light); }
.form-control::placeholder { color: var(--color-text-secondary); opacity: 0.5; font-style: italic; }
.table-search { padding: 7px var(--spacing-md); font-size: 0.85rem; background-color: var(--color-background-light); border: 1px solid var(--color-border-medium); border-radius: var(--border-radius-md); width: 100%; max-width: 200px; transition: all var(--transition-medium); }
.table-search:focus { outline: none; border-color: var(--color-primary-red); background-color: var(--color-background-lighter); max-width: 220px; }

.button { display: inline-flex; align-items: center; justify-content: center; gap: var(--spacing-sm); padding: 7px var(--spacing-md); font-family: var(--font-secondary); font-size: 0.85rem; font-weight: 500; border-radius: var(--border-radius-md); border: 1px solid transparent; cursor: pointer; transition: all var(--transition-medium); white-space: nowrap; line-height: 1.5; position: relative; overflow: hidden; text-shadow: 0 1px 1px rgba(0,0,0,0.2); }
.button::before { content: ''; position: absolute; top: 0; left: -80%; width: 60%; height: 100%; background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%); transform: skewX(-25deg); transition: left var(--transition-slow); opacity: 0.7; }
.button:hover::before, .button:active::before { left: 130%; }
.button.primary { background: linear-gradient(145deg, var(--color-primary-red), var(--color-primary-red-dark)); color: var(--color-text-on-red); border-color: var(--color-primary-red-dark); box-shadow: 0 3px 8px var(--color-primary-red-glow), inset 0 -1px 2px rgba(0,0,0,0.3); }
.button.primary:hover, .button.primary:active { background: linear-gradient(145deg, var(--color-primary-red-light), var(--color-primary-red)); border-color: var(--color-primary-red); box-shadow: 0 5px 12px var(--color-primary-red-glow), inset 0 -1px 2px rgba(0,0,0,0.3); transform: translateY(-2px); }
.button.primary:active { background: var(--color-primary-red-dark); border-color: var(--color-primary-red-dark); box-shadow: inset 0 2px 4px rgba(0,0,0,0.4); transform: translateY(0); }
.button.secondary { background-color: var(--color-background-light); color: var(--color-text-secondary); border-color: var(--color-border-medium); box-shadow: inset 0 1px 2px var(--color-shadow-glow), 0 1px 2px rgba(0,0,0,0.1); }
.button.secondary:hover, .button.secondary:active { background-color: var(--color-background-lighter); border-color: var(--color-border-light); color: var(--color-text-primary); transform: translateY(-1px); box-shadow: inset 0 1px 2px var(--color-shadow-glow), 0 2px 4px rgba(0,0,0,0.15); }
.button.secondary:active { background-color: var(--color-border-dark); border-color: var(--color-border-dark); color: var(--color-text-primary); box-shadow: inset 0 2px 4px var(--color-shadow-inset); transform: translateY(0); }
.button.success { background: linear-gradient(145deg, var(--color-success), #1f8b4c); color: #ffffff; border-color: #1a6e3b; box-shadow: 0 3px 8px var(--color-success-glow), inset 0 -1px 1px rgba(0,0,0,0.2); text-shadow: 0 -1px 0 rgba(0,0,0,0.2); }
.button.success:hover, .button.success:active { background: linear-gradient(145deg, #2ecc71, var(--color-success)); border-color: var(--color-success); box-shadow: 0 5px 12px var(--color-success-glow), inset 0 -1px 1px rgba(0,0,0,0.2); transform: translateY(-2px); }
.button.success:active { background: #1f8b4c; border-color: #1f8b4c; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3); transform: translateY(0); }
.button.small { padding: 5px var(--spacing-sm); font-size: 0.8rem; }
.button.tiny { padding: 3px var(--spacing-xs); font-size: 0.75rem; border-radius: var(--border-radius-sm); }
.button:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--color-background-dark), 0 0 0 4px var(--color-primary-red-light); z-index: 1; }
.button:disabled, .button:disabled:hover, .button:disabled:active { opacity: 0.4; cursor: not-allowed; box-shadow: none; transform: none; background: var(--color-background-light); border-color: var(--color-border-medium); color: var(--color-text-secondary); text-shadow: none; }

.placeholder-table, .placeholder-complex { background: repeating-linear-gradient(45deg, var(--color-background-dark), var(--color-background-dark) 10px, var(--color-background-light) 10px, var(--color-background-light) 20px); border: 1px solid var(--color-border-dark); border-radius: var(--border-radius-lg); padding: var(--spacing-lg); text-align: center; color: var(--color-text-secondary); font-style: italic; min-height: 200px; display: flex; align-items: center; justify-content: center; margin-top: var(--spacing-md); font-size: 1rem; box-shadow: inset 0 0 15px rgba(0,0,0,0.3); opacity: 0.7; }
.placeholder-complex.ai-panel { border-color: var(--color-info); color: var(--color-info); background: linear-gradient(135deg, var(--color-background-dark) 0%, rgba(41, 128, 185, 0.05) 100%); box-shadow: inset 0 0 15px rgba(41, 128, 185, 0.15); }
.placeholder-complex.ai-panel p:last-child { margin-top: var(--spacing-md); font-family: var(--font-display); font-weight: 600; font-size: 1rem; }

.docusign-layout { flex-direction: column; }
.docusign-column-main, .docusign-column-preview { width: 100%; }
.docusign-form .form-row { display: flex; flex-direction: column; gap: var(--spacing-md); }
.docusign-form .form-fieldset { border: 1px solid var(--color-border-medium); border-radius: var(--border-radius-md); padding: var(--spacing-md); margin-top: var(--spacing-lg); margin-bottom: var(--spacing-lg); background-color: rgba(0,0,0,0.1); box-shadow: inset 0 1px 4px rgba(0,0,0,0.2); }
.docusign-form .form-legend { font-family: var(--font-secondary); font-size: 0.8rem; font-weight: 500; color: var(--color-text-secondary); padding: 0 var(--spacing-sm); margin-left: var(--spacing-sm); text-transform: uppercase; letter-spacing: 0.8px; }
.docusign-form .form-control { font-size: 0.9rem; background-color: var(--color-background-dark); }
.docusign-form .form-control:focus { background-color: var(--color-background-light); }
.docusign-form select.form-control { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%239aa0ae'%3E%3Cpath fill-rule='evenodd' d='M4.22 6.22a.75.75 0 011.06 0L8 8.94l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L4.22 7.28a.75.75 0 010-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right var(--spacing-md) center; background-size: 14px 14px; padding-right: calc(var(--spacing-md) * 2 + 14px); cursor: pointer; }
.docusign-form select.form-control:focus { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23d63b2c'%3E%3Cpath fill-rule='evenodd' d='M4.22 6.22a.75.75 0 011.06 0L8 8.94l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L4.22 7.28a.75.75 0 010-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E"); }
.docusign-form textarea.form-control { min-height: 80px; resize: vertical; line-height: 1.5; }
.docusign-form .form-actions { margin-top: var(--spacing-lg); text-align: right; padding-top: var(--spacing-md); border-top: 1px solid var(--color-border-medium); }
#preview-panel { display: flex; flex-direction: column; max-height: calc(100vh - 50px - (var(--spacing-md) * 2) - 60px); min-height: 350px; background-color: var(--color-background-dark); border-radius: var(--border-radius-lg); border: 1px solid var(--color-border-dark); box-shadow: 0 4px 12px var(--color-shadow-soft); padding: 0; }
#preview-panel .preview-header { display: flex; justify-content: space-between; align-items: center; padding: var(--spacing-sm) var(--spacing-md); border-bottom: 1px solid var(--color-border-medium); flex-shrink: 0; }
#preview-panel h3 { padding: 0; margin: 0; border: none; font-size: 0.9rem; }
.document-preview { flex-grow: 1; background-color: #fdfdfd; border: none; border-radius: 0; padding: var(--spacing-lg); font-family: 'Times New Roman', Times, serif; font-size: 0.95rem; line-height: 1.6; color: #282828; white-space: pre-wrap; overflow-y: auto; margin-bottom: 0; box-shadow: inset 0 2px 8px rgba(0,0,0,0.1); scrollbar-width: thin; scrollbar-color: #ccc #f0f0f0; }
.document-preview::-webkit-scrollbar { width: 6px; }
.document-preview::-webkit-scrollbar-track { background: #f0f0f0; border-radius: 3px; }
.document-preview::-webkit-scrollbar-thumb { background-color: #ccc; border-radius: 3px; border: 1px solid #f0f0f0; }
.document-preview::-webkit-scrollbar-thumb:hover { background-color: #bbb; }
.preview-actions { margin-top: 0; padding: var(--spacing-md); border-top: 1px solid var(--color-border-medium); flex-shrink: 0; display: flex; justify-content: flex-end; gap: var(--spacing-sm); background-color: var(--color-background-light); border-radius: 0 0 var(--border-radius-lg) var(--border-radius-lg); }

.calendar-container { background-color: var(--color-background-light); border-radius: var(--border-radius-lg); padding: var(--spacing-md); border: 1px solid var(--color-border-dark); box-shadow: 0 4px 12px var(--color-shadow-soft), inset 0 1px 2px var(--color-shadow-glow); margin-top: var(--spacing-md); }
.card-style { background-color: var(--color-background-light); border-radius: var(--border-radius-lg); border: 1px solid var(--color-border-dark); box-shadow: 0 3px 10px var(--color-shadow-soft); }
.calendar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md); padding-bottom: var(--spacing-sm); border-bottom: 1px solid var(--color-border-medium); flex-wrap: wrap; gap: var(--spacing-sm); }
.calendar-month-title { font-family: var(--font-display); font-size: 1.1rem; font-weight: 600; color: var(--color-text-headings); text-align: center; flex-grow: 1; text-shadow: 0 1px 2px rgba(0,0,0,0.3); }
.calendar-nav-btn { background-color: var(--color-background-lighter); color: var(--color-text-secondary); border: 1px solid var(--color-border-medium); border-radius: 50%; width: 28px; height: 28px; font-size: 0.9rem; font-weight: bold; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: all var(--transition-fast); box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
.calendar-nav-btn:hover, .calendar-nav-btn:active { background-color: var(--color-background-lightest); color: var(--color-primary-red-light); border-color: var(--color-border-light); transform: scale(1.1); box-shadow: 0 2px 4px rgba(0,0,0,0.3); }
.calendar-nav-btn:active { transform: scale(0.95); box-shadow: inset 0 1px 2px rgba(0,0,0,0.3); }
#today-btn { margin-left: var(--spacing-sm); }
.calendar-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); margin-bottom: var(--spacing-sm); padding-bottom: var(--spacing-xs); border-bottom: 1px solid var(--color-border-medium); }
.calendar-weekdays div { text-align: center; font-family: var(--font-secondary); font-size: 0.7rem; font-weight: 500; color: var(--color-text-secondary); text-transform: uppercase; padding: 4px 0; }
.calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
.calendar-day { background-color: var(--color-background-medium); border: 1px solid var(--color-border-dark); border-radius: var(--border-radius-sm); padding: var(--spacing-xs); min-height: 70px; position: relative; cursor: pointer; transition: all var(--transition-medium); display: flex; flex-direction: column; box-shadow: inset 0 1px 2px rgba(0,0,0,0.15); }
.calendar-day:hover, .calendar-day:active { background-color: var(--color-background-lighter); border-color: var(--color-border-light); transform: translateY(-2px) scale(1.02); z-index: 5; box-shadow: 0 3px 10px var(--color-shadow-medium), inset 0 1px 1px rgba(255,255,255,0.03); }
.day-number { font-family: var(--font-secondary); font-size: 0.75rem; font-weight: 500; color: var(--color-text-primary); margin-bottom: var(--spacing-xs); text-align: right; position: absolute; top: 4px; right: 6px; background: rgba(0,0,0,0.2); padding: 1px 4px; border-radius: 3px; line-height: 1.2; }
.calendar-day.other-month { background-color: transparent; border-color: transparent; cursor: default; box-shadow: none; }
.calendar-day.other-month .day-number { color: var(--color-text-secondary); opacity: 0.2; background: none; }
.calendar-day.other-month:hover, .calendar-day.other-month:active { background-color: rgba(0,0,0,0.03); border-color: transparent; transform: none; box-shadow: none; }
.calendar-day.current-day { background-color: rgba(184, 47, 33, 0.08); border-color: var(--color-primary-red); box-shadow: inset 0 0 8px rgba(184, 47, 33, 0.1); }
.calendar-day.current-day .day-number { color: var(--color-primary-red-light); font-weight: 700; background: none; font-size: 0.8rem; }
.calendar-day.selected-day { background-color: rgba(41, 128, 185, 0.1); border-color: var(--color-info); box-shadow: inset 0 0 8px rgba(41, 128, 185, 0.2); }
.calendar-day.selected-day:hover, .calendar-day.selected-day:active { background-color: rgba(41, 128, 185, 0.15); }
.event-indicators { margin-top: auto; padding: 3px 3px 1px 3px; display: flex; flex-wrap: wrap; gap: 3px; justify-content: flex-start; max-height: 20px; overflow: hidden; }
.event-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; border: 1px solid rgba(0,0,0,0.3); opacity: 0.9; transition: transform var(--transition-fast); }
.calendar-day:hover .event-dot, .calendar-day:active .event-dot { transform: scale(1.1); }
.event-dot.type-deadline { background-color: var(--color-danger); box-shadow: 0 0 3px var(--color-danger); }
.event-dot.type-meeting { background-color: var(--color-info); box-shadow: 0 0 3px var(--color-info); }
.event-dot.type-filing { background-color: var(--color-success); box-shadow: 0 0 3px var(--color-success); }
.event-dot.type-other { background-color: var(--color-warning); box-shadow: 0 0 3px var(--color-warning); }
.upcoming-events-list { list-style: none; margin-top: var(--spacing-md); max-height: 180px; overflow-y: auto; padding-right: var(--spacing-xs); }
.upcoming-events-list li { padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--color-border-medium); font-size: 0.85rem; color: var(--color-text-secondary); display: flex; align-items: baseline; gap: var(--spacing-sm); transition: background-color var(--transition-fast); border-radius: var(--border-radius-sm); margin-right: var(--spacing-xs); }
.upcoming-events-list li:last-child { border-bottom: none; }
.upcoming-events-list li:hover, .upcoming-events-list li:active { background-color: rgba(255,255,255,0.03); }
.event-date { font-weight: 600; color: var(--color-text-primary); background-color: var(--color-background-lighter); padding: 2px var(--spacing-sm); border-radius: var(--border-radius-sm); white-space: nowrap; font-size: 0.75rem; border: 1px solid var(--color-border-medium); }
.event-time { margin-left: auto; font-size: 0.75rem; color: var(--color-text-secondary); background-color: var(--color-background-dark); padding: 2px var(--spacing-sm); border-radius: var(--border-radius-sm); border: 1px solid var(--color-border-dark); }

.mt-1 { margin-top: var(--spacing-sm); }
.mt-2 { margin-top: var(--spacing-md); }
.mt-3 { margin-top: var(--spacing-lg); }
.mb-1 { margin-bottom: var(--spacing-sm); }
.mb-2 { margin-bottom: var(--spacing-md); }
.mb-3 { margin-bottom: var(--spacing-lg); }

/* Clippy Lawyer Styles */
.clippy-lawyer {
    position: fixed;
    z-index: var(--z-index-modal);
    width: 100px;
    height: 120px;
    display: none;
    pointer-events: auto;
}

.clippy-avatar {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
}

.clippy-image {
    width: 80px;
    height: 80px;
    border-radius: 10px;
    background: linear-gradient(145deg, #333, #1a1a1a); /* Dark suit color */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.1);
    border: 2px solid #fff; /* White shirt collar effect */
    object-fit: cover;
    transition: transform var(--transition-medium);
}

.clippy-lawyer:hover .clippy-image {
    transform: scale(1.1) rotate(5deg);
}

.clippy-lawyer.bounce {
    animation: clippyBounce 1.5s infinite ease-in-out;
}

@keyframes clippyBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.speech-bubble {
    position: absolute;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    color: #333;
    padding: 8px 12px;
    border-radius: 8px;
    border: 2px solid #000;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    font-family: var(--font-secondary);
    font-size: 0.85rem;
    max-width: 200px;
    text-align: center;
    opacity: 0;
    transition: opacity var(--transition-fast);
}

.clippy-lawyer:hover .speech-bubble,
.clippy-lawyer.bounce .speech-bubble {
    opacity: 1;
}

.speech-bubble::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 10px solid #000;
}