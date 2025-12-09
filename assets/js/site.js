// Ngaoyi Cleaning - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle for all pages
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
            
            // Toggle icon
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenu.classList.contains('hidden')) {
                if (!mobileMenuToggle.contains(event.target) && !mobileMenu.contains(event.target)) {
                    mobileMenu.classList.add('hidden');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    const icon = mobileMenuToggle.querySelector('i');
                    if (icon.classList.contains('fa-times')) {
                        icon.classList.replace('fa-times', 'fa-bars');
                    }
                }
            }
        });
    }
    
    // Form validation helper
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validatePhone(phone) {
        const re = /^(\+27|0)[1-9][0-9]{8}$/;
        return re.test(phone.replace(/\s/g, ''));
    }
    
    // Initialize date pickers
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        const today = new Date().toISOString().split('T')[0];
        input.min = today;
        
        // Set default to tomorrow
        if (!input.value) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            input.value = tomorrow.toISOString().split('T')[0];
        }
    });
    
    // Initialize time slots
    const timeSlotSelects = document.querySelectorAll('select[id*="time-slot"]');
    timeSlotSelects.forEach(select => {
        if (!select.value) {
            select.value = '9am'; // Default to 9am slot
        }
    });
    
    // WhatsApp click tracking
    const whatsappButtons = document.querySelectorAll('a[href*="whatsapp"]');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'whatsapp_click', {
                    'event_category': 'engagement',
                    'event_label': 'whatsapp_contact'
                });
            }
        });
    });
    
    // Phone call tracking
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_click', {
                    'event_category': 'engagement',
                    'event_label': 'phone_contact'
                });
            }
        });
    });
    
    // Email click tracking
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'email_click', {
                    'event_category': 'engagement',
                    'event_label': 'email_contact'
                });
            }
        });
    });
    
    // Back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.className = 'fixed bottom-6 left-6 w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 hidden';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    backToTopButton.id = 'back-to-top';
    
    document.body.appendChild(backToTopButton);
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Show/hide back to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.remove('hidden');
        } else {
            backToTopButton.classList.add('hidden');
        }
    });
    
    // Booking data management
    function saveBookingData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
    
    function getBookingData(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
    
    function clearBookingData() {
        localStorage.removeItem('bookingData');
        localStorage.removeItem('bookingAddons');
        localStorage.removeItem('bookingSubtotal');
    }
    
    // Initialize Yoco SDK if available
    if (typeof YocoSDK !== 'undefined') {
        // Replace with your actual Yoco public key
        // YOCO_PUBLIC_KEY = "YOUR_YOCO_PUBLIC_KEY_HERE"
        const yocoPublicKey = "YOCO_PUBLIC_KEY";
        
        const yoco = new YocoSDK({
            publicKey: yocoPublicKey
        });
        
        // You can use yoco for inline card payments if needed
        window.yoco = yoco;
    }
    
    // Service pricing calculator (global)
    window.calculateServicePrice = function(serviceType, propertySize, isEmergency = false) {
        const pricing = {
            'weekly': { '1-bed': 240, '2-bed': 320, '3-bed': 380, '4-bed': 440, '5+bed': 500, 'office': 600 },
            'biweekly': { '1-bed': 300, '2-bed': 400, '3-bed': 470, '4-bed': 540, '5+bed': 610, 'office': 700 },
            'monthly': { '1-bed': 360, '2-bed': 480, '3-bed': 560, '4-bed': 640, '5+bed': 720, 'office': 800 },
            'once-off': { '1-bed': 350, '2-bed': 450, '3-bed': 550, '4-bed': 650, '5+bed': 750, 'office': 850 },
            'deep': { '1-bed': 1200, '2-bed': 1750, '3-bed': 2300, '4-bed': 2850, '5+bed': 3400, 'office': 4000 },
            'emergency': { '1-bed': 525, '2-bed': 675, '3-bed': 825, '4-bed': 975, '5+bed': 1125, 'office': 1275 },
            'commercial': { '1-bed': 500, '2-bed': 600, '3-bed': 700, '4-bed': 800, '5+bed': 900, 'office': 1000 }
        };
        
        let basePrice = 0;
        if (serviceType && propertySize && pricing[serviceType] && pricing[serviceType][propertySize]) {
            basePrice = pricing[serviceType][propertySize];
        }
        
        if (isEmergency && serviceType === 'emergency') {
            basePrice = Math.round(basePrice * 1.5); // 50% emergency surcharge
        }
        
        return basePrice;
    };
    
    // Format currency
    window.formatCurrency = function(amount) {
        return 'R ' + amount.toLocaleString('en-ZA');
    };
    
    // Format date
    window.formatDate = function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-ZA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    
    // Format time slot
    window.formatTimeSlot = function(slot) {
        const slots = {
            '9am': '9:00 AM - 11:00 AM',
            '11am': '11:00 AM - 1:00 PM',
            '1pm': '1:00 PM - 3:00 PM'
        };
        return slots[slot] || slot;
    };
    
    // Service type mapping
    window.getServiceTypeName = function(type) {
        const types = {
            'weekly': 'Weekly Recurring',
            'biweekly': 'Bi-weekly Recurring',
            'monthly': 'Monthly Recurring',
            'once-off': 'Once-Off Cleaning',
            'deep': 'Deep Cleaning',
            'emergency': 'Emergency Service',
            'commercial': 'Commercial Cleaning'
        };
        return types[type] || type;
    };
    
    // Property size mapping
    window.getPropertySizeName = function(size) {
        const sizes = {
            '1-bed': '1-Bedroom',
            '2-bed': '2-Bedroom',
            '3-bed': '3-Bedroom',
            '4-bed': '4-Bedroom',
            '5+bed': '5+ Bedroom',
            'office': 'Office/Commercial'
        };
        return sizes[size] || size;
    };
    
    // Add-on names and prices
    window.addonPrices = {
        'windows': { name: 'Window Cleaning', price: 150 },
        'oven': { name: 'Oven Cleaning', price: 180 },
        'fridge': { name: 'Fridge Cleaning', price: 100 },
        'laundry': { name: 'Laundry Service', price: 80 },
        'carpet': { name: 'Carpet Cleaning', price: 200 },
        'blinds': { name: 'Blind Cleaning', price: 120 }
    };
    
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'absolute bg-gray-900 text-white text-xs rounded py-1 px-2 bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-50 whitespace-nowrap';
            tooltip.textContent = tooltipText;
            this.appendChild(tooltip);
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.absolute');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
    
    // Initialize accordions
    const accordions = document.querySelectorAll('[data-accordion]');
    accordions.forEach(accordion => {
        const header = accordion.querySelector('[data-accordion-header]');
        const content = accordion.querySelector('[data-accordion-content]');
        
        if (header && content) {
            header.addEventListener('click', function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !isExpanded);
                content.classList.toggle('hidden');
                
                // Toggle icon
                const icon = this.querySelector('i');
                if (icon) {
                    if (isExpanded) {
                        icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
                    } else {
                        icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
                    }
                }
            });
        }
    });
    
    // Initialize modals
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.classList.remove('hidden');
                document.body.classList.add('overflow-hidden');
            }
        });
    });
    
    const modalCloses = document.querySelectorAll('[data-modal-close]');
    modalCloses.forEach(close => {
        close.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            }
        });
    });
    
    // Close modal on outside click
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }
    });
    
    // Initialize counters
    const counters = document.querySelectorAll('[data-counter]');
    counters.forEach(counter => {
        const minusBtn = counter.querySelector('[data-counter-minus]');
        const plusBtn = counter.querySelector('[data-counter-plus]');
        const valueEl = counter.querySelector('[data-counter-value]');
        
        if (minusBtn && plusBtn && valueEl) {
            let value = parseInt(valueEl.textContent) || 0;
            const min = parseInt(counter.getAttribute('data-counter-min')) || 0;
            const max = parseInt(counter.getAttribute('data-counter-max')) || 999;
            
            minusBtn.addEventListener('click', function() {
                if (value > min) {
                    value--;
                    valueEl.textContent = value;
                    updateCounter(counter, value);
                }
            });
            
            plusBtn.addEventListener('click', function() {
                if (value < max) {
                    value++;
                    valueEl.textContent = value;
                    updateCounter(counter, value);
                }
            });
        }
    });
    
    function updateCounter(counter, value) {
        const onChange = counter.getAttribute('data-counter-onchange');
        if (onChange && typeof window[onChange] === 'function') {
            window[onChange](value);
        }
    }
    
    // Initialize tabs
    const tabContainers = document.querySelectorAll('[data-tabs]');
    tabContainers.forEach(container => {
        const tabs = container.querySelectorAll('[data-tab]');
        const tabPanes = container.querySelectorAll('[data-tab-pane]');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Update active tab
                tabs.forEach(t => {
                    t.classList.remove('active');
                    t.classList.remove('text-primary');
                    t.classList.add('text-gray-600');
                });
                this.classList.add('active', 'text-primary');
                this.classList.remove('text-gray-600');
                
                // Show active tab pane
                tabPanes.forEach(pane => {
                    pane.classList.add('hidden');
                    if (pane.getAttribute('data-tab-pane') === tabId) {
                        pane.classList.remove('hidden');
                    }
                });
            });
        });
    });
    
    // Page load animations
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('[data-animate]');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                const animation = element.getAttribute('data-animate');
                element.classList.add(animation);
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check
    
    // Initialize lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img.lazy').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Service Worker Registration (optional - for PWA)
    if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js').then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }
    
    // Offline detection
    window.addEventListener('online', function() {
        console.log('You are now online');
        showNotification('You are back online!', 'success');
    });
    
    window.addEventListener('offline', function() {
        console.log('You are now offline');
        showNotification('You are offline. Some features may not work.', 'warning');
    });
    
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
        }`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('-translate-y-full');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Page load performance tracking
    window.addEventListener('load', function() {
        if (typeof gtag !== 'undefined') {
            // Measure page load time
            const navTiming = performance.getEntriesByType('navigation')[0];
            if (navTiming) {
                const loadTime = navTiming.loadEventEnd - navTiming.loadEventStart;
                gtag('event', 'timing_complete', {
                    'name': 'page_load',
                    'value': Math.round(loadTime),
                    'event_category': 'Performance'
                });
            }
        }
    });
    
    // Booking abandonment tracking
    let bookingStartTime = new Date();
    
    // Track when user starts booking
    if (window.location.pathname.includes('/booking.html')) {
        localStorage.setItem('bookingStarted', bookingStartTime.toISOString());
        
        // Track page changes
        window.addEventListener('beforeunload', function() {
            const timeSpent = new Date() - bookingStartTime;
            if (timeSpent > 10000) { // Only track if spent more than 10 seconds
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'booking_abandoned', {
                        'event_category': 'booking',
                        'event_label': 'service_selection',
                        'value': Math.round(timeSpent / 1000) // Time in seconds
                    });
                }
            }
        });
    }
    
    // Track booking completion
    if (window.location.pathname.includes('/summary.html')) {
        const bookingStarted = localStorage.getItem('bookingStarted');
        if (bookingStarted) {
            const completionTime = new Date() - new Date(bookingStarted);
            if (typeof gtag !== 'undefined') {
                gtag('event', 'booking_completed', {
                    'event_category': 'booking',
                    'event_label': 'checkout',
                    'value': Math.round(completionTime / 1000) // Time in seconds
                });
            }
            localStorage.removeItem('bookingStarted');
        }
    }
});

// Google Apps Script integration helper
window.submitToGoogleAppsScript = async function(data, endpoint) {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script web apps
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        // With no-cors, we can't read the response, but we assume success
        return { success: true };
    } catch (error) {
        console.error('Error submitting to Google Apps Script:', error);
        return { success: false, error: error.message };
    }
};

// Yoco payment helper
window.processYocoPayment = async function(amount, currency = 'ZAR') {
    if (!window.yoco) {
        throw new Error('Yoco SDK not loaded');
    }
    
    try {
        const result = await window.yoco.createToken({
            amountInCents: amount * 100,
            currency: currency,
            name: document.getElementById('full-name')?.value || 'Customer',
            description: 'Ngaoyi Cleaning Service',
            successCallback: function(data) {
                console.log('Yoco token created:', data);
                return data;
            },
            errorCallback: function(error) {
                console.error('Yoco error:', error);
                throw error;
            }
        });
        
        return result;
    } catch (error) {
        console.error('Yoco payment error:', error);
        throw error;
    }
};
