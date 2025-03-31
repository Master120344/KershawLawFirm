// ==============================
// KERSHAW LAW FIRM WEBSITE PERFORMANCE SCRIPT
// ==============================

// 🌟 Section 1: Lazy Loading of Images and Videos (Improves Load Time)
document.addEventListener("DOMContentLoaded", function () {
  const lazyImages = document.querySelectorAll("img.lazy, video.lazy");

  const lazyLoad = (target) => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            if (img.dataset.poster) {
              img.poster = img.dataset.poster;
            }
            img.classList.remove("lazy");
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: "0px 0px 50px 0px", // Trigger 50px before the image comes into view
      }
    );

    lazyImages.forEach((img) => {
      observer.observe(img);
    });
  };

  lazyLoad();
});

// 🌟 Section 2: Smooth Scroll for Better User Experience
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);

    window.scrollTo({
      top: targetElement.offsetTop - 60, // Offset for fixed header
      behavior: 'smooth',
    });
  });
});

// 🌟 Section 3: Error Logging and Notification (For Monitoring)
(function () {
  if (!window.console) {
    console = {
      log: function () {},
      warn: function () {},
      error: function () {},
    };
  }

  const originalError = console.error;
  console.error = function (message) {
    originalError.apply(console, arguments);
    // Optionally, send errors to a remote server here
    // e.g., sendErrorToServer(message);
    alert("An error occurred on this page. Please try again later.");
  };

  window.addEventListener('error', function (e) {
    console.error('Error captured: ', e.message);
    alert('A critical error occurred on the page.');
    e.preventDefault(); // Prevents default error handling
  });
})();

// 🌟 Section 4: Reduce Render Blocking (Async and Defer Loading)
const scripts = document.querySelectorAll('script[async], script[defer]');
scripts.forEach((script) => {
  if (script.getAttribute('defer') !== null) {
    script.onload = function () {
      console.log(`Script loaded with defer: ${script.src}`);
    };
  }
});

// 🌟 Section 5: Asset Compression (Making Site Load Faster)
(function () {
  const assets = [
    { type: 'image', selector: 'img' },
    { type: 'style', selector: 'link[rel="stylesheet"]' },
    { type: 'script', selector: 'script' },
  ];

  assets.forEach((asset) => {
    const elements = document.querySelectorAll(asset.selector);
    elements.forEach((element) => {
      if (asset.type === 'image' && element.dataset.src) {
        // Compress image
        element.src = compressImage(element.dataset.src);
      } else if (asset.type === 'style' && element.href) {
        // Compress stylesheets
        element.href = compressCSS(element.href);
      } else if (asset.type === 'script' && element.src) {
        // Compress scripts
        element.src = compressJS(element.src);
      }
    });
  });

  function compressImage(url) {
    // Placeholder for image compression logic
    return url + "?quality=80"; // Example compression query
  }

  function compressCSS(url) {
    // Placeholder for CSS compression logic
    return url + "?minify=true"; // Example compression query
  }

  function compressJS(url) {
    // Placeholder for JS compression logic
    return url + "?minify=true"; // Example compression query
  }
})();

// 🌟 Section 6: Web Performance Monitoring (Optional)
(function () {
  const performanceData = {
    navigationStart: performance.timing.navigationStart,
    domContentLoaded: performance.timing.domContentLoadedEventEnd,
    loadEventEnd: performance.timing.loadEventEnd,
  };

  console.log('Performance Data:', performanceData);

  // Optional: Send data to a server for analysis
  // sendPerformanceDataToServer(performanceData);
})();

// 🌟 Section 7: Font Loading Optimization
(function () {
  const fontPreload = document.createElement("link");
  fontPreload.rel = "preload";
  fontPreload.href = "https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap";
  fontPreload.as = "style";
  document.head.appendChild(fontPreload);
})();

// 🌟 Section 8: Reduce DOM Manipulation (Best Practices)
(function () {
  let batchDOMUpdates = [];

  function processBatchUpdates() {
    if (batchDOMUpdates.length > 0) {
      batchDOMUpdates.forEach((update) => update());
      batchDOMUpdates = [];
    }
  }

  setInterval(processBatchUpdates, 200); // Process every 200ms
  document.addEventListener('DOMContentLoaded', function () {
    // Example batch update to avoid multiple DOM writes
    batchDOMUpdates.push(() => {
      document.body.classList.add("initialized");
    });
  });
})();

// 🌟 Section 9: Mobile Optimization (Viewport and Touch Events)
(function () {
  if (window.innerWidth <= 768) {
    // Adjust styles for smaller screens
    document.body.classList.add('mobile-view');
  }

  // Prevent unnecessary touch event handlers on mobile devices
  document.addEventListener('touchmove', function (e) {
    if (e.targetTouches.length > 1) {
      e.preventDefault();
    }
  });
})();

// 🌟 Section 10: Performance Analytics Reporting (Google Analytics - Optional)
(function () {
  if (window.ga) {
    // Send a custom event to Google Analytics when the page is fully loaded
    ga('send', 'event', 'Performance', 'Page Load', 'Kershaw Law Firm');
  }
})();

// ==============================
// END OF PERFORMANCE SCRIPT
// ==============================

console.info('Kershaw Law Firm website is optimized for performance!');
