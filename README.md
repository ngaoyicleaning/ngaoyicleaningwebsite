# Ngaoyi Cleaning Website

A professional, mobile-first website for Ngaoyi Cleaning services with complete booking flow and payment integration.

## Features

- 📱 **Fully Responsive** - Works perfectly on all devices
- 🎨 **Modern Design** - Clean, professional interface with brand colors
- 🔄 **Complete Booking Flow** - Service selection → Add-ons → Summary → Payment
- 💳 **Yoco Payment Integration** - Secure checkout via Yoco
- 🛒 **Add-on Services** - Optional extra services with real-time pricing
- 📋 **Booking Summary** - Detailed breakdown of services, pricing, and customer info
- 🔒 **Secure** - HTTPS, form validation, and privacy-focused
- 🚀 **Fast Performance** - Optimized for speed and SEO
- 📈 **Analytics Ready** - Google Analytics integration
- 📝 **Terms & Conditions** - Comprehensive legal pages

## Complete File Structure
ngaoyi-cleaning/
├── index.html # Homepage with all features
├── services.html # Services listing page
├── pricing.html # Pricing information
├── about.html # About us page
├── booking.html # Step 1: Service selection
├── booking-addons.html # Step 2: Add-on services
├── summary.html # Step 3: Summary & payment
├── terms.html # Terms & Conditions
├── privacy.html # Privacy policy
├── assets/
│ ├── css/
│ │ └── styles.css # Custom CSS styles
│ ├── js/
│ │ └── site.js # Main JavaScript file
│ └── images/ # Images and logos
├── docs/
│ └── deployment-guide.md # Deployment instructions
└── README.md # This file

text

## Booking Flow

1. **Service Selection** (`booking.html`)
   - Personal information
   - Service type and property size
   - Date and time selection (9am, 11am, 1pm slots)
   - Special instructions
   - Real-time pricing calculation

2. **Add-on Services** (`booking-addons.html`)
   - Optional extra services
   - Window cleaning, oven cleaning, etc.
   - Quantity selection
   - Updated price summary

3. **Summary & Payment** (`summary.html`)
   - Complete booking review
   - Customer information
   - Service details
   - Price breakdown with discount option
   - Terms agreement
   - Yoco payment integration

## Setup Instructions

### 1. Replace Placeholder Values

#### **Google Analytics**
```html
<!-- In all HTML files, replace: -->
GA_MEASUREMENT_ID

<!-- With your actual Google Analytics ID: -->
G-5V9NJTNT1N
