// ===== MESSAGE BOX SYSTEM =====

let isAdmin = false;

// Check if admin view should be shown (simple check - can be enhanced)
function checkAdminAccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const adminKey = urlParams.get('admin');
    
    if (adminKey === 'rudolf2026') {
        isAdmin = true;
        document.getElementById('admin-section').style.display = 'block';
        loadMessages();
    }
}

// Form Submission
const messageForm = document.getElementById('customer-message-form');

if (messageForm) {
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const messageData = {
            id: Date.now(),
            name: document.getElementById('msg-name').value,
            email: document.getElementById('msg-email').value,
            phone: document.getElementById('msg-phone').value,
            vehicle: document.getElementById('msg-vehicle').value,
            subject: document.getElementById('msg-subject').value,
            message: document.getElementById('msg-message').value,
            timestamp: new Date().toISOString(),
            read: false
        };
        
        // Save to localStorage
        let messages = JSON.parse(localStorage.getItem('rudolfs-messages') || '[]');
        messages.unshift(messageData); // Add to beginning
        localStorage.setItem('rudolfs-messages', JSON.stringify(messages));
        
        console.log('Message saved:', messageData);
        
        // Show success message
        messageForm.style.display = 'none';
        document.getElementById('message-success').style.display = 'block';
        
        // Reload admin view if active
        if (isAdmin) {
            loadMessages();
        }
    });
}

// Load Messages (Admin View)
function loadMessages() {
    const messageList = document.getElementById('message-list');
    const messages = JSON.parse(localStorage.getItem('rudolfs-messages') || '[]');
    
    if (messages.length === 0) {
        messageList.innerHTML = '<li class="message-item"><p>Keine Nachrichten vorhanden.</p></li>';
        return;
    }
    
    messageList.innerHTML = messages.map(msg => `
        <li class="message-item ${msg.read ? '' : 'unread'}" data-id="${msg.id}">
            <div class="message-item-header">
                <h4>${escapeHtml(msg.name)} - ${escapeHtml(msg.subject)}</h4>
                <span class="message-item-date">${formatDate(msg.timestamp)}</span>
            </div>
            <div class="message-item-content">
                <p><strong>Fahrzeug:</strong> ${escapeHtml(msg.vehicle || 'Nicht angegeben')}</p>
                <p><strong>Nachricht:</strong></p>
                <p>${escapeHtml(msg.message)}</p>
            </div>
            <div class="message-item-contact">
                <p><strong>📧 E-Mail:</strong> <a href="mailto:${escapeHtml(msg.email)}">${escapeHtml(msg.email)}</a></p>
                <p><strong>📞 Telefon:</strong> <a href="tel:${escapeHtml(msg.phone)}">${escapeHtml(msg.phone)}</a></p>
            </div>
            <div class="message-actions">
                ${msg.read ? 
                    `<button class="btn-mark-read" onclick="markAsUnread(${msg.id})">Als ungelesen markieren</button>` : 
                    `<button class="btn-mark-read" onclick="markAsRead(${msg.id})">Als gelesen markieren</button>`
                }
                <button class="btn-delete" onclick="deleteMessage(${msg.id})">Löschen</button>
                <button class="btn-secondary" onclick="replyToMessage('${escapeHtml(msg.email)}', '${escapeHtml(msg.name)}')">Antworten</button>
            </div>
        </li>
    `).join('');
}

// Mark as Read
function markAsRead(id) {
    let messages = JSON.parse(localStorage.getItem('rudolfs-messages') || '[]');
    messages = messages.map(msg => msg.id === id ? {...msg, read: true} : msg);
    localStorage.setItem('rudolfs-messages', JSON.stringify(messages));
    loadMessages();
}

// Mark as Unread
function markAsUnread(id) {
    let messages = JSON.parse(localStorage.getItem('rudolfs-messages') || '[]');
    messages = messages.map(msg => msg.id === id ? {...msg, read: false} : msg);
    localStorage.setItem('rudolfs-messages', JSON.stringify(messages));
    loadMessages();
}

// Delete Message
function deleteMessage(id) {
    if (!confirm('Diese Nachricht wirklich löschen?')) return;
    
    let messages = JSON.parse(localStorage.getItem('rudolfs-messages') || '[]');
    messages = messages.filter(msg => msg.id !== id);
    localStorage.setItem('rudolfs-messages', JSON.stringify(messages));
    loadMessages();
}

// Delete All Messages
function clearAllMessages() {
    if (!confirm('ALLE Nachrichten löschen? Dies kann nicht rückgängig gemacht werden!')) return;
    
    localStorage.removeItem('rudolfs-messages');
    loadMessages();
}

// Toggle Messages Visibility
function toggleMessages() {
    const adminSection = document.getElementById('admin-section');
    adminSection.style.display = adminSection.style.display === 'none' ? 'block' : 'none';
}

// Reply to Message
function replyToMessage(email, name) {
    window.location.href = `mailto:${email}?subject=Re: Ihre Nachricht an Rudolfs KFZ&body=Hallo ${name},%0D%0A%0D%0AVielen Dank für Ihre Nachricht...`;
}

// Utility Functions
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAdminAccess();
    console.log('Message box system initialized! 📬');
});

// Auto-check for new messages every 30 seconds (admin view)
setInterval(() => {
    if (isAdmin) {
        loadMessages();
    }
}, 30000);
