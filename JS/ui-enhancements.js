// ==============================
// KERSHAW LAW FIRM UI ENHANCEMENTS SCRIPT
// ==============================

// 🌟 Section 1: Smooth Fade-in Animation on Load
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("fade-in");
});

// 🌟 Section 2: Back to Top Button
const backToTopButton = document.createElement("button");
backToTopButton.innerText = "↑";
backToTopButton.classList.add("back-to-top");
document.body.appendChild(backToTopButton);

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopButton.classList.add("visible");
  } else {
    backToTopButton.classList.remove("visible");
  }
});

backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// 🌟 Section 3: Dynamic Year in Footer
const footerYear = document.querySelector("#footer-year");
if (footerYear) footerYear.textContent = new Date().getFullYear();

// 🌟 Section 4: Mobile Menu Toggle
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    menuToggle.classList.toggle("open");
  });

  // Close menu when clicking a link
  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      menuToggle.classList.remove("open");
    });
  });
}

// 🌟 Section 5: Scroll Reveal Animations (For Sections)
const revealElements = document.querySelectorAll(".reveal");
const revealOnScroll = () => {
  revealElements.forEach((el) => {
    const elementTop = el.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    if (elementTop < windowHeight - 100) {
      el.classList.add("visible");
    } else {
      el.classList.remove("visible");
    }
  });
};

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// 🌟 Section 6: Floating Call Button (For Mobile)
const callButton = document.createElement("a");
callButton.href = "tel:7372040093";
callButton.classList.add("call-button");
callButton.innerHTML = "📞 Call Us";
document.body.appendChild(callButton);

// 🌟 Section 7: Loading Screen Animation (Optional)
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");
  if (loader) {
    loader.classList.add("fade-out");
    setTimeout(() => loader.style.display = "none", 1000);
  }
});

// ==============================
// END OF UI ENHANCEMENTS SCRIPT
// ==============================

console.info("Kershaw Law Firm website UI enhancements loaded successfully!");