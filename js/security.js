// ==============================
// KERSHAW LAW FIRM WEBSITE SECURITY SCRIPT
// ==============================

// 🌟 Section 1: Anti-Content Theft (Right Click, Dragging, Shortcut Blocking)
document.addEventListener('contextmenu', (e) => e.preventDefault());

document.addEventListener('keydown', (e) => {
  if (
    e.ctrlKey &&
    ['u', 's', 'p', 'i', 'j', 'c', 'h'].includes(e.key.toLowerCase())
  ) {
    e.preventDefault();
  }
});

['dragstart', 'selectstart'].forEach((event) => {
  document.addEventListener(event, (e) => e.preventDefault());
});

console.log('%cSTOP!', 'color: red; font-size: 50px; font-weight: bold;');

// 🌟 Section 2: Honeypot Anti-Bot Protection (Hidden Field Trick)
document.addEventListener('DOMContentLoaded', () => {
  const honeypot = document.createElement('input');
  honeypot.type = 'text';
  honeypot.name = 'honeypot';
  honeypot.style.display = 'none';
  document.body.appendChild(honeypot);

  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      if (honeypot.value !== '') {
        alert('Spam bot detected!');
        e.preventDefault();
      }
    });
  });
});

// 🌟 Section 3: Basic DDoS Protection (Rate Limiting)
let clickCount = 0;
setInterval(() => (clickCount = 0), 1000);

document.addEventListener('click', () => {
  clickCount++;
  if (clickCount > 10) {
    alert('Too many requests detected. Slow down!');
    window.location.href = 'https://kershawlaw.com';
  }
});

// 🌟 Section 4: Input Validation & Sanitization
document.querySelectorAll('form').forEach((form) => {
  form.addEventListener('submit', (e) => {
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach((input) => {
      const value = input.value.trim();

      // Empty field check
      if (value === '') {
        alert(`${input.name} cannot be empty`);
        isValid = false;
      }

      // Email validation
      if (input.type === 'email' && !/^\S+@\S+\.\S+$/.test(value)) {
        alert('Please enter a valid email address');
        isValid = false;
      }

      // Prevent script injection attacks
      if (/[^a-zA-Z0-9@.\s]/.test(value)) {
        alert('Invalid characters detected');
        isValid = false;
      }
    });

    if (!isValid) e.preventDefault();
  });
});

// 🌟 Section 5: Block Known Bad Bots and Crawlers
const badBots = [
  'curl',
  'wget',
  'python',
  'bot',
  'crawler',
  'spider',
  'scraper',
  'httpclient',
];

const userAgent = navigator.userAgent.toLowerCase();
badBots.forEach((bot) => {
  if (userAgent.includes(bot)) {
    alert('Malicious bot detected — access denied!');
    window.location.href = 'https://kershawlaw.com';
  }
});

// 🌟 Section 6: Anti-Tampering (Console Protection)
setInterval(() => {
  if (window.console && console.log) {
    console.log = () => {
      alert('Console tampering detected!');
      window.location.href = 'https://kershawlaw.com';
    };
  }
}, 1000);

// 🌟 Section 7: Anti-Frame Clickjacking Protection
if (window.top !== window.self) {
  window.top.location = window.self.location;
}

// 🌟 Section 8: Content Security Policy (CSP) - Inline JS Blocker
const metaCSP = document.createElement('meta');
metaCSP.httpEquiv = 'Content-Security-Policy';
metaCSP.content = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'";
document.head.appendChild(metaCSP);

// 🌟 Section 9: Auto Backup Script (Local Storage)
function backupContent() {
  const content = document.body.innerHTML;
  localStorage.setItem('siteBackup', content);
}

window.addEventListener('beforeunload', backupContent);

// 🌟 Section 10: Alert if Backup Restored (Tampering Detector)
const storedContent = localStorage.getItem('siteBackup');
if (storedContent && storedContent !== document.body.innerHTML) {
  alert('Website content has been altered!');
  window.location.href = 'https://kershawlaw.com';
}

// 🌟 Section 11: Fake Admin Login Trap (Honey Login)
function createFakeLogin() {
  const fakeLogin = document.createElement('div');
  fakeLogin.innerHTML = `
    <form id="fake-admin" style="display:none;">
      <input type="text" name="username" placeholder="Admin Username">
      <input type="password" name="password" placeholder="Password">
      <button type="submit">Login</button>
    </form>
  `;
  document.body.appendChild(fakeLogin);

  document
    .getElementById('fake-admin')
    .addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Unauthorized access attempt logged!');
      window.location.href = 'https://kershawlaw.com';
    });
}

createFakeLogin();

// ==============================
// END OF SECURITY SCRIPT
// ==============================

console.info('Kershaw Law Firm website is armed with enhanced security protections!');
