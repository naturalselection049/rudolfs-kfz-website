// ===== BOOKING SYSTEM =====

let selectedService = null;
let selectedDate = null;
let selectedTime = null;

// Service Selection
document.querySelectorAll('.service-option').forEach(option => {
    option.addEventListener('click', () => {
        // Remove selected from all
        document.querySelectorAll('.service-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Add selected to clicked
        option.classList.add('selected');
        selectedService = option.getAttribute('data-service');
    });
});

// Time Slot Selection
document.querySelectorAll('.time-slot').forEach(slot => {
    slot.addEventListener('click', () => {
        if (slot.classList.contains('booked')) return;
        
        // Remove selected from all
        document.querySelectorAll('.time-slot').forEach(s => {
            s.classList.remove('selected');
        });
        
        // Add selected to clicked
        slot.classList.add('selected');
        selectedTime = slot.getAttribute('data-time');
    });
});

// Date Selection
const dateInput = document.getElementById('booking-date');
if (dateInput) {
    dateInput.addEventListener('change', (e) => {
        selectedDate = e.target.value;
        loadAvailableTimes(selectedDate);
    });
}

// Navigation Functions
function nextStep(step) {
    // Validate current step
    if (step === 2 && !selectedService) {
        alert('Bitte wählen Sie einen Service aus.');
        return;
    }
    
    if (step === 3 && (!selectedDate || !selectedTime)) {
        alert('Bitte wählen Sie Datum und Zeit.');
        return;
    }
    
    if (step === 4 && !validateForm()) {
        return;
    }
    
    // Hide all steps
    document.querySelectorAll('.booking-step').forEach(s => {
        s.style.display = 'none';
    });
    
    // Show next step
    document.getElementById(`step${step}`).style.display = 'block';
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    if (step === 4) {
        showConfirmation();
    }
}

function prevStep(step) {
    // Hide all steps
    document.querySelectorAll('.booking-step').forEach(s => {
        s.style.display = 'none';
    });
    
    // Show previous step
    document.getElementById(`step${step}`).style.display = 'block';
}

// Form Validation
function validateForm() {
    const form = document.getElementById('booking-form');
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const vehicle = document.getElementById('vehicle').value.trim();
    const terms = document.getElementById('terms').checked;
    
    if (!name || !email || !phone || !vehicle) {
        alert('Bitte füllen Sie alle Pflichtfelder aus.');
        return false;
    }
    
    if (!validateEmail(email)) {
        alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
        return false;
    }
    
    if (!terms) {
        alert('Bitte akzeptieren Sie die AGB und Datenschutzerklärung.');
        return false;
    }
    
    return true;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Load Available Times (Mock)
function loadAvailableTimes(date) {
    // In production, this would fetch from backend
    const timeSlots = document.querySelectorAll('.time-slot');
    
    // Mock: Randomly book some slots
    timeSlots.forEach(slot => {
        slot.classList.remove('booked');
        // Randomly book ~20% of slots
        if (Math.random() < 0.2) {
            slot.classList.add('booked');
        }
    });
}

// Show Confirmation
function showConfirmation() {
    const form = document.getElementById('booking-form');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const vehicle = document.getElementById('vehicle').value;
    const notes = document.getElementById('notes').value;
    
    const serviceNames = {
        'diagnose': 'Fahrzeugdiagnose',
        'tuev': 'TÜV Durchsicht',
        'inspektion-klein': 'Kleine Inspektion',
        'inspektion-gross': 'Grosse Inspektion',
        'oelwechsel': 'Ölwechsel',
        'bremsen': 'Bremsen Service',
        'klima': 'Klima Service',
        'reifen': 'Reifenwechsel',
        'sonstiges': 'Sonstiges'
    };
    
    const summary = document.getElementById('booking-summary');
    summary.innerHTML = `
        <h3>Ihre Buchungsdetails</h3>
        <ul>
            <li><strong>Service:</strong> ${serviceNames[selectedService] || selectedService}</li>
            <li><strong>Datum:</strong> ${formatDate(selectedDate)}</li>
            <li><strong>Zeit:</strong> ${selectedTime} Uhr</li>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>E-Mail:</strong> ${email}</li>
            <li><strong>Telefon:</strong> ${phone}</li>
            <li><strong>Fahrzeug:</strong> ${vehicle}</li>
            ${notes ? `<li><strong>Notizen:</strong> ${notes}</li>` : ''}
        </ul>
    `;
    
    // Save booking to localStorage (for demo)
    saveBooking({
        service: selectedService,
        date: selectedDate,
        time: selectedTime,
        name,
        email,
        phone,
        vehicle,
        notes,
        timestamp: new Date().toISOString()
    });
    
    // In production, send to backend
    // sendBookingToBackend(...);
}

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('de-CH', options);
}

// Save Booking (LocalStorage for demo)
function saveBooking(booking) {
    let bookings = JSON.parse(localStorage.getItem('kostas-bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('kostas-bookings', JSON.stringify(bookings));
    console.log('Booking saved:', booking);
}

// Submit Booking
function submitBooking() {
    if (validateForm()) {
        nextStep(4);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Booking system initialized! 📅');
});
