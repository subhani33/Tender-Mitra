// Preload.js - Executed before React initializes to improve perceived performance

// Function to preload key assets
function preloadAssets() {
    const criticalAssets = [
        '/textures/black-marble.jpg',
        '/textures/white-marble.jpg',
        '/textures/gold-veins.png'
    ];

    // Preload images in background
    criticalAssets.forEach(url => {
        if (url.match(/\.(jpe?g|png|gif|svg)$/)) {
            const img = new Image();
            img.src = url;
        }
    });
}

// Initialize performance monitoring
function initPerformanceMonitoring() {
    // Report key metrics to console in development
    if (window.performance) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                const domReadyTime = perfData.domComplete - perfData.domLoading;

                console.log(`Page load time: ${pageLoadTime}ms`);
                console.log(`DOM ready time: ${domReadyTime}ms`);

                // Report to analytics in production
                if (window.gtag && process.env.NODE_ENV === 'production') {
                    window.gtag('event', 'timing_complete', {
                        name: 'page_load',
                        value: pageLoadTime,
                        event_category: 'Performance'
                    });
                }
            }, 0);
        });
    }
}

// Implement instant page transitions with preloading
function enableInstantPageTransitions() {
    document.addEventListener('mouseover', e => {
        // Preload link targets on hover
        const linkElem = e.target.closest('a');
        if (linkElem &&
            linkElem.href &&
            linkElem.href.startsWith(window.location.origin) &&
            !linkElem.hasAttribute('data-no-preload')) {
            const linkUrl = new URL(linkElem.href);

            // Create prefetch link
            const prefetchLink = document.createElement('link');
            prefetchLink.rel = 'prefetch';
            prefetchLink.href = linkUrl.pathname;
            document.head.appendChild(prefetchLink);
        }
    });
}

// Initialize device capability detection
function detectDeviceCapabilities() {
    // Create capability flags on window
    window.deviceCapabilities = {
        highPerformance: false,
        touchDevice: 'ontouchstart' in window,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
        connection: 'unknown'
    };

    // Detect connection speed
    if ('connection' in navigator) {
        const connection = navigator.connection;
        window.deviceCapabilities.connection = connection.effectiveType || 'unknown';
        window.deviceCapabilities.saveData = !!connection.saveData;
    }

    // Determine if high-performance device based on heuristics
    const highEndGPU = (!window.deviceCapabilities.reducedMotion &&
        window.devicePixelRatio >= 2 &&
        (window.deviceCapabilities.connection === '4g' || window.deviceCapabilities.connection === 'unknown')
    );

    window.deviceCapabilities.highPerformance = highEndGPU;

    // Apply appropriate body classes
    document.documentElement.classList.add(
        window.deviceCapabilities.touchDevice ? 'touch-device' : 'no-touch',
        window.deviceCapabilities.reducedMotion ? 'reduced-motion' : 'allow-motion',
        window.deviceCapabilities.highPerformance ? 'high-performance' : 'standard-performance'
    );
}

// Main preload initialization
(function() {
    // Initialize all preload functions
    preloadAssets();
    initPerformanceMonitoring();
    enableInstantPageTransitions();
    detectDeviceCapabilities();

    // Mark as complete for React to check
    window.preloadComplete = true;
})();