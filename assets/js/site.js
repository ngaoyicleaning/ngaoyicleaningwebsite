// Ngaoyi Cleaning - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuDropdown = document.getElementById('mobile-menu-dropdown');
    const mainMenu = document.getElementById('main-menu');
    
    if (mobileMenuToggle && mobileMenuDropdown) {
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            mobileMenuDropdown.classList.toggle('hidden');
            
            // Toggle icon
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileMenuDropdown && !mobileMenuDropdown.classList.contains('hidden')) {
            if (!mobileMenuToggle.contains(event.target) && !mobileMenuDropdown.contains(event.target)) {
                mobileMenuDropdown.classList.add('hidden');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                const icon = mobileMenuToggle.querySelector('i');
                if (icon.classList.contains('fa-times')) {
                    icon.classList.replace('fa-times', 'fa-bars');
                }
            }
        }
    });
    
    // Form submission handling
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        // Replace with your Google Apps Script web app URL
        // GAS_ENDPOINT_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE"
        const GAS_ENDPOINT_URL = window.GAS_ENDPOINT_URL || "GAS_ENDPOINT_URL";
        
        // Yoco public key hint (replace with your actual public key)
        // YOCO_PUBLIC_HINT = "YOUR_YOCO_PUBLIC_KEY_HERE"
        const YOCO_PUBLIC_HINT = "YOCO_PUBLIC_HINT";
        
        let bookingData = null;
        let paymentId = null;
        
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Form validation
            if (!validateForm()) {
                return;
            }
            
            // Show loading state
            const submitBtn = document.getElementById('submit-btn');
            const submitText = document.getElementById('submit-text');
            const submitLoading = document.getElementById('submit-loading');
            
            submitText.classList.add('hidden');
            submitLoading.classList.remove('hidden');
            submitBtn.disabled = true;
            
            // Hide previous messages
            document.getElementById('form-success').classList.add('hidden');
            document.getElementById('form-error').classList.add('hidden');
            document.getElementById('payment-section').classList.add('hidden');
            
            // Prepare form data
            const formData = {
                timestamp: new Date().toISOString(),
                fullName: document.getElementById('full-name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                serviceType: document.getElementById('service-type').value,
                propertySize: document.getElementById('property-size').value,
                preferredDate: document.getElementById('preferred-date').value || 'Not specified',
                message: document.getElementById('message').value || 'No additional details',
                source: 'website-booking-form'
            };
            
            try {
                // First, submit booking data to Google Apps Script
                console.log('Submitting booking data to:', GAS_ENDPOINT_URL);
                
                // Note: Using no-cors mode for Google Apps Script web app
                // In production, you should use proper CORS headers
                const response = await fetch(GAS_ENDPOINT_URL, {
                    method: 'POST',
                    mode: 'no-cors', // Google Apps Script web apps require no-cors
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: 'submit_booking',
                        data: formData
                    })
                });
                
                // Since we're using no-cors, we can't read the response
                // But we assume it was successful
                
                // Store booking data for payment
                bookingData = formData;
                
                // Show success message
                document.getElementById('form-success').classList.remove('hidden');
                
                // Show payment section
                document.getElementById('payment-section').classList.remove('hidden');
                
                // Reset form loading state
                submitText.classList.remove('hidden');
                submitLoading.classList.add('hidden');
                submitBtn.disabled = false;
                
                // Scroll to payment section
                document.getElementById('payment-section').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                
                // Track conversion
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'booking_submitted', {
                        'event_category': 'booking',
                        'event_label': formData.serviceType
                    });
                }
                
            } catch (error) {
                console.error('Error submitting booking:', error);
                
                // Show error message
                document.getElementById('error-message').textContent = 
                    'There was an error submitting your booking. Please try again or contact us at 070 764 3709.';
                document.getElementById('form-error').classList.remove('hidden');
                
                // Reset form loading state
                submitText.classList.remove('hidden');
                submitLoading.classList.add('hidden');
                submitBtn.disabled = false;
            }
        });
        
        // Payment button handler
        const paymentButton = document.getElementById('payment-button');
        if (paymentButton) {
            paymentButton.addEventListener('click', async function() {
                if (!bookingData) {
                    alert('Please submit the booking form first.');
                    return;
                }
                
                // Show loading state
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
                this.disabled = true;
                
                try {
                    // Call Google Apps Script to create Yoco payment
                    console.log('Creating Yoco payment for booking:', bookingData);
                    
                    // Note: This would typically be handled by your backend/Google Apps Script
                    // The script should create a Yoco payment link and return it
                    const paymentResponse = await fetch(GAS_ENDPOINT_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            action: 'create_payment',
                            bookingData: bookingData,
                            amount: calculatePaymentAmount(bookingData),
                            currency: 'ZAR'
                        })
                    });
                    
                    // In a real implementation, you would:
                    // 1. Get the payment link from the response
                    // 2. Redirect to the Yoco payment page
                    // 3. Handle the callback to confirm booking
                    
                    // For demo purposes, we'll simulate a successful payment
                    simulatePaymentSuccess();
                    
                } catch (error) {
                    console.error('Error creating payment:', error);
                    
                    // Show error message
                    document.getElementById('error-message').textContent = 
                        'Error processing payment. Please contact us at 070 764 3709 to complete your booking.';
                    document.getElementById('form-error').classList.remove('hidden');
                    
                    // Reset button
                    this.innerHTML = originalText;
                    this.disabled = false;
                }
            });
        }
        
        // Form validation function
        function validateForm() {
            const requiredFields = [
                'full-name',
                'email',
                'phone',
                'address',
                'service-type',
                'property-size',
                'privacy-agree'
            ];
            
            let isValid = true;
            
            requiredFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (!field) return;
                
                let fieldIsValid = true;
                
                if (field.type === 'checkbox') {
                    fieldIsValid = field.checked;
                } else {
                    fieldIsValid = field.value.trim() !== '';
                    
                    // Email validation
                    if (fieldId === 'email' && field.value.trim() !== '') {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        fieldIsValid = emailRegex.test(field.value);
                    }
                    
                    // Phone validation (South African)
                    if (fieldId === 'phone' && field.value.trim() !== '') {
                        const phoneRegex = /^(\+27|0)[1-9][0-9]{8}$/;
                        fieldIsValid = phoneRegex.test(field.value.replace(/\s/g, ''));
                    }
                }
                
                if (!fieldIsValid) {
                    isValid = false;
                    field.classList.add('border-red-500');
                    
                    // Add error message
                    let errorElement = document.getElementById(`${fieldId}-error`);
                    if (!errorElement) {
                        errorElement = document.createElement('p');
                        errorElement.id = `${fieldId}-error`;
                        errorElement.className = 'text-red-500 text-sm mt-1';
                        field.parentNode.appendChild(errorElement);
                    }
                    
                    if (fieldId === 'email') {
                        errorElement.textContent = 'Please enter a valid email address.';
                    } else if (fieldId === 'phone') {
                        errorElement.textContent = 'Please enter a valid South African phone number.';
                    } else if (fieldId === 'privacy-agree') {
                        errorElement.textContent = 'You must agree to the privacy policy.';
                    } else {
                        errorElement.textContent = 'This field is required.';
                    }
                } else {
                    field.classList.remove('border-red-500');
                    
                    // Remove error message
                    const errorElement = document.getElementById(`${fieldId}-error`);
                    if (errorElement) {
                        errorElement.remove();
                    }
                }
            });
            
            return isValid;
        }
        
        // Calculate payment amount based on service type and property size
        function calculatePaymentAmount(bookingData) {
            // This is a simplified calculation
            // In production, you would have more complex logic
            const basePrices = {
                'recurring': {
                    '1-bed': 240,
                    '2-bed': 320,
                    '3-bed': 380,
                    '4-bed': 440
                },
                'once-off': {
                    '1-bed': 350,
                    '2-bed': 450,
                    '3-bed': 550,
                    '4-bed': 650
                },
                'deep': {
                    '1-bed': 1200,
                    '2-bed': 1750,
                    '3-bed': 2300,
                    '4-bed': 2850
                }
            };
            
            const serviceType = bookingData.serviceType;
            const propertySize = bookingData.propertySize;
            
            if (basePrices[serviceType] && basePrices[serviceType][propertySize]) {
                return basePrices[serviceType][propertySize];
            }
            
            // Default fallback amount
            return 500;
        }
        
        // Simulate payment success (for demo purposes)
        function simulatePaymentSuccess() {
            // Show success message
            document.getElementById('form-success').textContent = 
                '🎉 Payment successful! Your booking is confirmed. We will contact you within 2 hours with cleaner details.';
            document.getElementById('form-success').classList.remove('hidden');
            
            // Hide payment section
            document.getElementById('payment-section').classList.add('hidden');
            
            // Reset form
            bookingForm.reset();
            bookingData = null;
            
            // Reset date field
            const dateField = document.getElementById('preferred-date');
            if (dateField) {
                const today = new Date().toISOString().split('T')[0];
                dateField.min = today;
            }
            
            // Track payment conversion
            if (typeof gtag !== 'undefined') {
                gtag('event', 'payment_completed', {
                    'event_category': 'booking',
                    'event_label': 'yoco_payment'
                });
            }
            
            // Scroll to success message
            document.getElementById('form-success').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
        
        // Real-time form validation
        const formInputs = bookingForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.id) {
                    validateField(this.id);
                }
            });
            
            input.addEventListener('input', function() {
                // Remove error styling as user types
                if (this.classList.contains('border-red-500')) {
                    this.classList.remove('border-red-500');
                    
                    // Remove error message
                    const errorElement = document.getElementById(`${this.id}-error`);
                    if (errorElement) {
                        errorElement.remove();
                    }
                }
            });
        });
        
        function validateField(fieldId) {
            const field = document.getElementById(fieldId);
            if (!field) return;
            
            // Remove existing error
            field.classList.remove('border-red-500');
            const errorElement = document.getElementById(`${fieldId}-error`);
            if (errorElement) {
                errorElement.remove();
            }
            
            // Skip validation for empty optional fields
            if (!field.required && field.value.trim() === '') {
                return;
            }
            
            let isValid = true;
            
            if (field.type === 'checkbox') {
                isValid = field.checked;
            } else {
                isValid = field.value.trim() !== '';
                
                // Email validation
                if (fieldId === 'email' && field.value.trim() !== '') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    isValid = emailRegex.test(field.value);
                }
                
                // Phone validation
                if (fieldId === 'phone' && field.value.trim() !== '') {
                    const phoneRegex = /^(\+27|0)[1-9][0-9]{8}$/;
                    isValid = phoneRegex.test(field.value.replace(/\s/g, ''));
                }
            }
            
            if (!isValid) {
                field.classList.add('border-red-500');
                
                // Create error message
                const errorElement = document.createElement('p');
                errorElement.id = `${fieldId}-error`;
                errorElement.className = 'text-red-500 text-sm mt-1';
                
                if (fieldId === 'email') {
                    errorElement.textContent = 'Please enter a valid email address.';
                } else if (fieldId === 'phone') {
                    errorElement.textContent = 'Please enter a valid South African phone number.';
                } else if (fieldId === 'privacy-agree') {
                    errorElement.textContent = 'You must agree to the privacy policy.';
                } else {
                    errorElement.textContent = 'This field is required.';
                }
                
                field.parentNode.appendChild(errorElement);
            }
        }
    }
    
    // Service pricing calculator (if needed)
    const serviceTypeSelect = document.getElementById('service-type');
    const propertySizeSelect = document.getElementById('property-size');
    
    if (serviceTypeSelect && propertySizeSelect) {
        function updatePriceEstimate() {
            const serviceType = serviceTypeSelect.value;
            const propertySize = propertySizeSelect.value;
            
            // You could add dynamic price calculation here
            // This is just a placeholder
            if (serviceType && propertySize) {
                console.log(`Selected: ${serviceType} for ${propertySize}`);
            }
        }
        
        serviceTypeSelect.addEventListener('change', updatePriceEstimate);
        propertySizeSelect.addEventListener('change', updatePriceEstimate);
    }
    
    // Set minimum date for date inputs
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        const today = new Date().toISOString().split('T')[0];
        input.min = today;
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
    
    // Back to top button (optional)
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
});

// Service Worker Registration (optional - for PWA)
if ('serviceWorker' in navigator) {
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
});

window.addEventListener('offline', function() {
    console.log('You are now offline');
});

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
