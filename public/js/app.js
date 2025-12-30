/**
 * LaBrute - Client-side JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Limit skill selection to 3
    const skillCheckboxes = document.querySelectorAll('.skill-checkbox input[type="checkbox"]');
    if (skillCheckboxes.length > 0) {
        skillCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const checked = document.querySelectorAll('.skill-checkbox input[type="checkbox"]:checked');
                if (checked.length > 3) {
                    this.checked = false;
                    alert('¡Solo puedes seleccionar hasta 3 habilidades!');
                }
            });
        });
    }
    
    // Auto-hide flash messages
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(msg => {
        setTimeout(() => {
            msg.style.opacity = '0';
            msg.style.transition = 'opacity 0.5s';
            setTimeout(() => msg.remove(), 500);
        }, 5000);
    });
    
    // Confirm before fight
    const fightForms = document.querySelectorAll('form[action="/fight.php"]');
    fightForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Get opponent name
            const card = this.closest('.opponent-card');
            if (card) {
                const name = card.querySelector('h4')?.textContent || 'este oponente';
                if (!confirm(`¿Quieres pelear contra ${name}?`)) {
                    e.preventDefault();
                }
            }
        });
    });
    
    // Animate brute cards on hover
    const bruteCards = document.querySelectorAll('.brute-card, .opponent-card');
    bruteCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Helper function for AJAX requests (for future use)
async function apiRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }
    
    const response = await fetch(endpoint, options);
    return response.json();
}

