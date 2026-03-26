// ===== CONTACT FORM =====
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const phone = document.getElementById('contact-phone').value;
        const subject = document.getElementById('contact-subject').value;
        const message = document.getElementById('contact-message').value;
        const privacy = document.getElementById('contact-privacy').checked;
        
        if (!name || !email || !subject || !message) {
            alert('Bitte füllen Sie alle Pflichtfelder aus.');
            return;
        }
        
        if (!privacy) {
            alert('Bitte akzeptieren Sie die Datenschutzerklärung.');
            return;
        }
        
        // Save to localStorage (for demo)
        const contactData = {
            name,
            email,
            phone,
            subject,
            message,
            timestamp: new Date().toISOString()
        };
        
        let contacts = JSON.parse(localStorage.getItem('kostas-contacts') || '[]');
        contacts.push(contactData);
        localStorage.setItem('kostas-contacts', JSON.stringify(contacts));
        
        console.log('Contact form submitted:', contactData);
        
        // Show success message
        alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
        contactForm.reset();
        
        // In production, send to backend
        // sendContactToBackend(contactData);
    });
}

console.log('Contact page loaded! 📧');
