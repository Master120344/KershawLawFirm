/* ==========================================================================
   Base & Imports (If using a preprocessor/framework, imports go here)
   ========================================================================== */

/* Assuming font links are in HTML */

/* ==========================================================================
   Global Resets & Base Styles
   ========================================================================== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
    font-size: 16px; /* Base font size for rem units */
    -webkit-font-smoothing: antialiased; /* Smoother fonts on WebKit */
    -moz-osx-font-smoothing: grayscale; /* Smoother fonts on Firefox */
}

body {
    font-family: 'EB Garamond', serif;
    min-height: 100vh;
    color: #EAEAEA; /* Slightly softer white */
    line-height: 1.7; /* More spacious line height */
    background-color: #121418; /* Slightly deeper base dark */
    overflow-x: hidden;
    position: relative;
    opacity: 1; /* Assume loaded, JS can handle fade */
    padding-top: 110px; /* Adjusted for potential header refinement */
    padding-bottom: 80px; /* Adjusted for potential footer refinement */
    background-image: radial-gradient(circle at top left, rgba(45, 52, 64, 0.1), transparent 40%),
                      radial-gradient(circle at bottom right, rgba(211, 84, 0, 0.05), transparent 50%); /* Subtle radial gradients */
    background-attachment: fixed;
}

/* ==========================================================================
   Background & Overlay (Consistent but maybe slightly adjusted)
   ========================================================================== */
#background-static {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    z-index: -2; background-size: cover; background-position: center;
    background-repeat: no-repeat; background-image: url('../assets/austinbackground.jpg');
    filter: contrast(1.1) brightness(0.95); /* Subtle image adjustments */
}
.overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    /* More nuanced gradient, maybe slightly darker at top */
    background: linear-gradient(to bottom, rgba(10, 10, 15, 0.4), rgba(10, 10, 15, 0.15));
    z-index: -1;
    backdrop-filter: blur(1px) brightness(0.9); /* Subtle blur/brightness on overlay itself */
}

/* ==========================================================================
   Header & Navigation Tabs (Refined Styling)
   ========================================================================== */
/* --- Refined Header --- */
.header {
    position: fixed; top: 0; left: 0; width: 100%; z-index: 1000;
    padding: 18px 0; /* Slightly adjusted padding */
    background: rgba(18, 20, 24, 0.9); /* Darker, less transparent */
    backdrop-filter: blur(12px) saturate(120%); /* Enhanced glass effect */
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5); /* Deeper shadow */
    border-bottom: 1px solid rgba(211, 84, 0, 0.15); /* Subtle orange bottom border */
}
.header-content { width: 96%; max-width: 1500px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
.logo-container { text-align: center; flex-grow: 1; }
.logo-container h1 { font-family: 'Cinzel', serif; font-size: clamp(1.7rem, 4vw, 2.1rem); color: #F5F6F5; text-shadow: 1px 1px 0px rgba(211, 84, 0, 0.3), 3px 3px 10px rgba(0, 0, 0, 0.7); letter-spacing: 1.5px; transition: color 0.4s ease, text-shadow 0.4s ease; font-weight: 700; }
.logo-container h1 a { color: inherit; text-decoration: none; }
.logo-container h1 a:hover, .logo-container h1:hover { color: #E67E22; /* Lighter orange on hover */ text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.1), 0 0 15px rgba(230, 126, 34, 0.5); }
.header-line { width: 80px; height: 2px; background: linear-gradient(90deg, rgba(211, 84, 0, 0.5), #D35400, rgba(211, 84, 0, 0.5)); margin: 8px auto 0; transition: width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.4s ease; border-radius: 1px; opacity: 0.7; }
.logo-container:hover .header-line { width: 140px; opacity: 1; }
.header-actions { display: flex; align-items: center; gap: 15px; flex-shrink: 0; }
.login-button {
    padding: 9px 25px; background: transparent; color: #D35400; text-decoration: none; font-family: 'Cinzel', serif; font-size: 0.9rem; font-weight: 700; border-radius: 30px; transition: all 0.4s ease; box-shadow: inset 0 0 0 2px rgba(211, 84, 0, 0.7); /* Inset border */ text-transform: uppercase; letter-spacing: 0.5px;
}
.login-button:hover, .login-button:active { background: #D35400; color: #121418; /* Dark text on hover */ box-shadow: 0 5px 15px rgba(211, 84, 0, 0.4), inset 0 0 0 2px #D35400; transform: translateY(-2px); }
.user-info { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; color: #ccc; }
#user-email { font-weight: 500; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-bottom: 1px dotted rgba(255,255,255,0.3); padding-bottom: 2px; }
.logout-link { color: #D35400; text-decoration: none; font-weight: 600; padding: 6px 12px; border-radius: 5px; transition: all 0.3s ease; border: 1px solid transparent; }
.logout-link:hover, .logout-link:active { color: #F5F6F5; background: rgba(211, 84, 0, 0.8); border-color: rgba(211, 84, 0, 1); }

/* --- Refined Tabs --- */
.tabs {
    position: fixed; bottom: 0; left: 0; width: 100%; z-index: 2000;
    padding: 12px 0;
    background: linear-gradient(to top, rgba(18, 20, 24, 0.98), rgba(18, 20, 24, 0.85)); /* Gradient background */
    backdrop-filter: blur(10px) saturate(110%);
    box-shadow: 0 -6px 25px rgba(0, 0, 0, 0.4);
    border-top: 1px solid rgba(211, 84, 0, 0.1); /* Subtle top border */
    display: flex; justify-content: center; align-items: center; gap: 35px;
}
.tabs a {
    color: #b0b0b0; /* Muted grey */ text-decoration: none; font-family: 'Cinzel', serif; /* Title font for tabs */ font-size: 0.95rem; font-weight: 600; padding: 10px 18px; transition: all 0.4s ease; position: relative; text-transform: uppercase; letter-spacing: 1.2px;
}
.tabs a::before { /* Underline effect element */
    content: ''; position: absolute; width: 0; height: 3px; bottom: -5px; left: 50%; transform: translateX(-50%); background: linear-gradient(90deg, #E67E22, #D35400); border-radius: 2px; transition: width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); box-shadow: 0 2px 5px rgba(211, 84, 0, 0.4); opacity: 0;
}
.tabs a:hover, .tabs a.active { color: #FFFFFF; }
.tabs a:hover::before, .tabs a.active::before { width: 80%; opacity: 1; }
.tabs a::after { /* Remove original simple underline */ display: none; }


/* ==========================================================================
   Main Content Area & Container
   ========================================================================== */
.main-content-area {
    position: relative;
    z-index: 5;
    padding: 1px 0; /* Prevent margin collapse */
}

.services-container {
    width: 90%;
    max-width: 1200px; /* Increased max-width */
    margin: 60px auto 80px auto; /* More vertical spacing */
    padding: 50px 40px; /* More internal padding */
    background: rgba(26, 29, 36, 0.85); /* Content background */
    border-radius: 15px; /* Smoother radius */
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.05); /* Outer shadow + subtle inner border */
    border: 1px solid rgba(255, 255, 255, 0.08); /* Subtle outer border */
    /* Subtle background noise texture */
    background-image: linear-gradient(rgba(26, 29, 36, 0.85), rgba(26, 29, 36, 0.85)), url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="4" height="4" viewBox="0 0 4 4"%3E%3Cpath fill="%23ffffff" fill-opacity="0.02" d="M1 3h1v1H1V3zm2-2h1v1H3V1z"%3E%3C/path%3E%3C/svg%3E');
}

/* ==========================================================================
   Section Styling Enhancements
   ========================================================================== */
section {
    margin-bottom: 70px; /* Increased spacing */
    padding: 30px 0;
}
section:last-of-type {
    margin-bottom: 0; /* Remove margin from last section */
}

/* --- Enhanced Hero Section --- */
.services-hero {
    text-align: center;
    border-bottom: 1px solid rgba(211, 84, 0, 0.25);
    padding-bottom: 40px;
    margin-bottom: 50px;
    position: relative;
}
/* Add subtle top/bottom fade effect to hero text area */
.services-hero::before, .services-hero::after {
    content: ''; position: absolute; left: 0; right: 0; height: 50px; z-index: 1; pointer-events: none;
}
.services-hero::before { top: -50px; background: linear-gradient(to bottom, rgba(26, 29, 36, 1), transparent); }
.services-hero::after { bottom: -50px; background: linear-gradient(to top, rgba(26, 29, 36, 1), transparent); }

.services-hero h2 {
    font-size: clamp(2.5rem, 6vw, 3.8rem); /* Larger heading */
    color: #FFFFFF;
    text-shadow: 0 0 5px rgba(211, 84, 0, 0.4), 0 0 15px rgba(211, 84, 0, 0.3), 0 3px 3px rgba(0,0,0,0.6);
    margin-bottom: 15px;
    font-weight: 700;
    letter-spacing: 1px;
}
.services-hero .tagline {
    font-size: clamp(1.2rem, 2.8vw, 1.6rem); /* Larger tagline */
    color: #C5C5C5; /* Slightly brighter grey */
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
    max-width: 850px;
    margin: 0 auto;
    font-weight: 400;
    font-style: italic;
}

/* --- Enhanced Introduction Section --- */
.intro-section p {
    font-size: 1.25rem; /* Larger intro text */
    max-width: 900px;
    margin: 0 auto;
    text-align: center;
    color: #D0D0D0; /* Slightly brighter */
    padding: 0 20px;
}

/* --- Enhanced Visa Details Section --- */
.visa-details-wrapper {
    display: flex;
    gap: 40px; /* Increased gap */
    justify-content: center; /* Center items if they don't fill space */
    margin-top: 60px;
    flex-wrap: wrap;
}
.visa-section {
    flex-basis: calc(50% - 20px); /* Ensure 2 columns with gap */
    min-width: 320px;
    padding: 35px 30px; /* More padding */
    background: linear-gradient(145deg, rgba(40, 44, 52, 0.6), rgba(30, 33, 39, 0.6)); /* Subtle gradient */
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.07);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    text-align: center;
    transition: transform 0.4s ease, box-shadow 0.4s ease;
    position: relative;
    overflow: hidden; /* For pseudo-elements */
}
.visa-section:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
}
/* Add a subtle shine effect on hover */
.visa-section::after {
    content: ''; position: absolute; top: -100%; left: -75%; width: 250%; height: 250%;
    background: linear-gradient(to bottom right, rgba(255,255,255,0.15), rgba(255,255,255,0));
    transform: rotate(45deg); transition: top 0.5s ease; z-index: 0; pointer-events: none; opacity: 0;
}
.visa-section:hover::after {
    top: -50%; opacity: 1;
}

.visa-icon {
    margin-bottom: 20px;
    position: relative; z-index: 1;
    display: inline-block;
    background: rgba(211, 84, 0, 0.1);
    padding: 15px;
    border-radius: 50%;
    border: 1px solid rgba(211, 84, 0, 0.3);
}
.visa-icon img {
    height: 45px; width: 45px; /* Fixed size */
    opacity: 0.9;
    filter: invert(60%) sepia(90%) saturate(1500%) hue-rotate(349deg) brightness(90%) contrast(90%);
    display: block; /* Prevents extra space below img */
}

.visa-section h3 {
    font-family: 'Cinzel', serif;
    color: #E67E22; /* Lighter orange */
    font-size: 1.7rem; /* Larger heading */
    margin-bottom: 18px;
    font-weight: 700;
    letter-spacing: 0.5px;
    position: relative; z-index: 1;
}
.visa-section p {
    font-size: 1.1rem; /* Slightly larger text */
    color: #BDBDBD; /* Lighter grey */
    position: relative; z-index: 1;
    line-height: 1.6;
}

/* --- Enhanced Advantage Section --- */
.advantage-section {
    text-align: center;
    padding-top: 20px; /* Add padding top */
}
.advantage-section h2 {
    font-size: clamp(2rem, 5vw, 2.8rem); /* Larger heading */
    color: #FFFFFF;
    margin-bottom: 15px;
    font-weight: 700;
}
.advantage-intro {
    font-size: 1.2rem; /* Larger intro */
    color: #D0D0D0;
    max-width: 850px;
    margin: 0 auto 40px auto;
}
.advantage-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); /* Adjust minmax */
    gap: 35px; /* Increased gap */
    margin-top: 40px;
    text-align: left;
}
.advantage-item {
    background: rgba(35, 39, 46, 0.7); /* Slightly different bg */
    padding: 30px; /* Increased padding */
    border-radius: 10px;
    border-left: 5px solid #D35400;
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    border: 1px solid rgba(255,255,255,0.05);
}
.advantage-item:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.3);
    border-left-color: #E67E22; /* Change border color on hover */
    border-color: rgba(255,255,255,0.1);
}
.advantage-icon {
    margin-bottom: 15px;
    height: 40px;
    display: inline-block; /* Allows centering if needed */
}
.advantage-icon img {
    height: 100%; width: auto; opacity: 0.85;
    filter: invert(60%) sepia(90%) saturate(1500%) hue-rotate(349deg) brightness(90%) contrast(90%);
}
.advantage-item h4 {
    font-family: 'Cinzel', serif;
    font-size: 1.35rem; /* Larger heading */
    color: #F0F0F0;
    margin-bottom: 12px;
    font-weight: 600;
}
.advantage-item p {
    font-size: 1.05rem; /* Slightly larger text */
    color: #BDBDBD;
    line-height: 1.65;
}

/* --- Enhanced Process Section --- */
.process-section {
    text-align: center;
    padding: 40px 0; /* Add padding */
    background: rgba(18, 20, 24, 0.4); /* Darker distinct background */
    border-radius: 10px;
    margin-top: 50px;
    border: 1px solid rgba(211, 84, 0, 0.1);
}
.process-section h2 {
    font-size: clamp(2rem, 5vw, 2.8rem); /* Larger heading */
    color: #FFFFFF;
    margin-bottom: 15px;
    font-weight: 700;
}
.process-section > p {
    font-size: 1.2rem;
    color: #D0D0D0;
    max-width: 850px;
    margin: 0 auto 40px auto;
}
.process-steps {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px; /* Increased gap */
    margin-bottom: 30px;
    padding: 0 20px; /* Ensure steps don't hit edges */
}
.step {
    background: transparent; /* Remove background */
    color: #D0D0D0;
    padding: 12px 25px; /* More padding */
    border-radius: 30px;
    font-size: 1rem; /* Larger font */
    font-weight: 500;
    border: 2px solid rgba(211, 84, 0, 0.5); /* Border instead of bg */
    display: flex;
    align-items: center;
    gap: 10px;
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}
.step:hover {
    background-color: rgba(211, 84, 0, 0.15);
    border-color: #D35400;
    color: #FFFFFF;
}
.step span {
    background: #D35400; color: #121418; /* Dark text on number */
    border-radius: 50%; width: 28px; height: 28px; display: inline-flex;
    justify-content: center; align-items: center; font-weight: 700; font-size: 0.9rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    transition: background-color 0.3s ease, color 0.3s ease;
}
.step:hover span {
    background: #E67E22; /* Lighter orange on hover */
    color: #FFFFFF;
}
.process-assurance {
    font-style: normal; /* Remove italic */
    font-family: 'Cinzel', serif; /* Use title font */
    color: #D35400; /* Orange color */
    font-size: 1.1rem; /* Larger size */
    font-weight: 600;
    letter-spacing: 0.5px;
    margin-top: 10px;
}

/* --- Enhanced CTA Section --- */
.cta-section {
    text-align: center;
    background: linear-gradient(rgba(211, 84, 0, 0.1), rgba(211, 84, 0, 0.05)), rgba(30, 33, 39, 0.5); /* Subtle orange tint + dark bg */
    padding: 60px 30px; /* More padding */
    border-radius: 10px;
    margin-top: 60px;
    border: 1px solid rgba(211, 84, 0, 0.2);
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}
.cta-section h2 {
    font-size: clamp(1.8rem, 5vw, 2.6rem); /* Larger heading */
    color: #FFFFFF;
    margin-bottom: 20px;
    font-weight: 700;
    text-shadow: 0 2px 5px rgba(0,0,0,0.5);
}
.cta-section p {
    font-size: 1.2rem; /* Larger text */
    color: #D0D0D0;
    max-width: 750px;
    margin: 0 auto 35px auto; /* More bottom margin */
    line-height: 1.6;
}
.cta-button {
    padding: 16px 45px; /* Larger button */
    background: #D35400; color: #FFFFFF; text-decoration: none;
    font-family: 'Cinzel', serif; font-size: 1.3rem; /* Larger font */
    font-weight: 700; border-radius: 35px; border: none;
    transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1); /* Smooth transition */
    box-shadow: 0 6px 18px rgba(211, 84, 0, 0.5), 0 0 0 0 rgba(211, 84, 0, 0.7); /* Added pulse setup */
    touch-action: manipulation; cursor: pointer; letter-spacing: 0.5px;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}
.cta-button:hover, .cta-button:active {
    background: #E67E22;
    transform: translateY(-4px) scale(1.02); /* More lift */
    box-shadow: 0 10px 25px rgba(211, 84, 0, 0.7);
    /* Optional: Add a subtle pulse/glow effect on hover */
    /* animation: pulse 1.5s infinite; */
}

/* Optional Pulse Animation */
@keyframes pulse {
  0% { box-shadow: 0 6px 18px rgba(211, 84, 0, 0.5), 0 0 0 0 rgba(211, 84, 0, 0.7); }
  70% { box-shadow: 0 6px 18px rgba(211, 84, 0, 0.5), 0 0 0 10px rgba(211, 84, 0, 0); }
  100% { box-shadow: 0 6px 18px rgba(211, 84, 0, 0.5), 0 0 0 0 rgba(211, 84, 0, 0); }
}


/* ==========================================================================
   Animation & Accessibility
   ========================================================================== */
.animate-on-scroll {
    opacity: 0;
    transform: translateY(40px); /* Slightly more distance */
    transition: opacity 0.9s cubic-bezier(0.165, 0.84, 0.44, 1), transform 0.9s cubic-bezier(0.165, 0.84, 0.44, 1); /* Smoother cubic-bezier */
    will-change: opacity, transform;
}
.animate-on-scroll.is-visible {
    opacity: 1;
    transform: translateY(0);
}
/* Stagger animations for grid items */
.advantage-grid .advantage-item, .visa-section {
    transition-delay: calc(0.1s * var(--animation-order, 1)); /* Use CSS variable for order */
}


a:focus-visible, button:focus-visible {
    outline: 3px solid #E67E22; /* Brighter orange outline */
    outline-offset: 3px;
    border-radius: 4px;
}

/* ==========================================================================
   Responsive Adjustments
   ========================================================================== */
@media (max-width: 992px) {
    .services-container { padding: 40px 25px; }
    .advantage-grid { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; }
    .process-steps { gap: 15px; }
    .step { padding: 10px 20px; font-size: 0.95rem; }
}

@media (max-width: 768px) {
    body { padding-top: 140px; /* Account for potentially taller stacked mobile header */ padding-bottom: 70px; }
    .header-content { flex-direction: column; gap: 15px; } /* Stack header */
    .header-actions { justify-content: center; width: 100%; }
    .services-container { width: 95%; margin: 40px auto 60px auto; padding: 30px 15px; }
    .visa-details-wrapper { flex-direction: column; gap: 25px; }
    .visa-section { flex-basis: 100%; }
    .advantage-grid { grid-template-columns: 1fr; /* Single column */ }
    .process-steps { justify-content: center; /* Center steps when wrapped */ gap: 10px; }
    .step { font-size: 0.9rem; padding: 8px 18px; }
    .step span { width: 24px; height: 24px; font-size: 0.8rem; }
    .services-hero h2 { font-size: clamp(2rem, 8vw, 2.8rem); }
    .services-hero .tagline { font-size: clamp(1.1rem, 4vw, 1.4rem); }
    .cta-button { padding: 14px 35px; font-size: 1.1rem; }
}

@media (max-width: 480px) {
    body { line-height: 1.6; }
    .services-container { padding: 25px 10px; }
    .logo-container h1 { font-size: 1.6rem; }
    .tabs { gap: 10px; }
    .tabs a { font-size: 0.85rem; padding: 8px 10px; letter-spacing: 0.8px; }
    .services-hero h2 { letter-spacing: 0.5px; }
    .visa-section h3 { font-size: 1.5rem; }
    .advantage-item h4 { font-size: 1.2rem; }
    .cta-button { width: 100%; /* Full width button */ }
}