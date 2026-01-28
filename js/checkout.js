// ========== Menu data for emoji reference ==========
const menuDataCheckout = {
    1: { name: "Overnight Oats", emoji: "🥣" },
    2: { name: "Avocado Toast", emoji: "🥑" },
    3: { name: "Acai Bowl", emoji: "🫐" },
    4: { name: "Buddha Bowl", emoji: "🥗" },
    5: { name: "Chicken Salad Wrap", emoji: "🌯" },
    6: { name: "Mushroom Soup", emoji: "🍄" },
    7: { name: "Grilled Salmon Bowl", emoji: "🍣" },
    8: { name: "Chicken Stir Fry", emoji: "🍗" },
    9: { name: "Vegan Curry", emoji: "🍛" },
    10: { name: "Energy Balls", emoji: "🟤" },
    11: { name: "Fruit Cup", emoji: "🍓" },
    12: { name: "Hummus & Veggies", emoji: "🥕" }
};

// ========== Delivery fee ==========
const CHECKOUT_DELIVERY_FEE = 3.50;

// ========== Run when page loads ==========
document.addEventListener('DOMContentLoaded', function() {
    renderCheckoutItems();
    setMinDeliveryDate();
    setupPayButton();
});

// ========== Render cart items in checkout summary ==========
function renderCheckoutItems() {
    const container = document.getElementById('checkout-items');
    if (!container) return;
    
    // If cart is empty, redirect to menu
    if (cart.length === 0) {
        window.location.href = 'menu.html';
        return;
    }
    
    container.innerHTML = '';
    
    cart.forEach(item => {
        const emoji = menuDataCheckout[item.id]?.emoji || '🍽️';
        const itemTotal = item.price * item.quantity;
        
        const checkoutItem = document.createElement('div');
        checkoutItem.className = 'checkout-item';
        checkoutItem.innerHTML = `
            <div class="checkout-item-info">
                <span class="checkout-item-emoji">${emoji}</span>
                <div>
                    <div class="checkout-item-name">${item.name}</div>
                    <div class="checkout-item-qty">x${item.quantity}</div>
                </div>
            </div>
            <span class="checkout-item-price">£${itemTotal.toFixed(2)}</span>
        `;
        
        container.appendChild(checkoutItem);
    });
    
    updateCheckoutSummary();
}

// ========== Update checkout totals ==========
function updateCheckoutSummary() {
    const subtotalEl = document.getElementById('checkout-subtotal');
    const deliveryEl = document.getElementById('checkout-delivery');
    const totalEl = document.getElementById('checkout-total');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = subtotal >= 30 ? 0 : CHECKOUT_DELIVERY_FEE;
    const total = subtotal + delivery;
    
    subtotalEl.textContent = '£' + subtotal.toFixed(2);
    deliveryEl.textContent = delivery === 0 ? 'FREE' : '£' + delivery.toFixed(2);
    totalEl.textContent = '£' + total.toFixed(2);
}

// ========== Set minimum delivery date (tomorrow) ==========
function setMinDeliveryDate() {
    const dateInput = document.getElementById('deliveryDate');
    if (!dateInput) return;
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    
    dateInput.min = `${year}-${month}-${day}`;
}

// ========== Setup pay button ==========
function setupPayButton() {
    const payBtn = document.getElementById('pay-btn');
    const form = document.getElementById('checkout-form');
    
    if (!payBtn || !form) return;
    
    payBtn.addEventListener('click', function() {
        // Check form validity
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        // Get form data
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            postcode: document.getElementById('postcode').value,
            deliveryDate: document.getElementById('deliveryDate').value,
            deliveryTime: document.getElementById('deliveryTime').value,
            notes: document.getElementById('notes').value
        };
        
        // Calculate total
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const delivery = subtotal >= 30 ? 0 : CHECKOUT_DELIVERY_FEE;
        const total = subtotal + delivery;
        
        // In a real app, this would redirect to Stripe Checkout
        // For demo, we simulate a successful payment
        processPayment(formData, total);
    });
}

// ========== Process payment (demo) ==========
function processPayment(formData, total) {
    const payBtn = document.getElementById('pay-btn');
    
    // Show loading state
    payBtn.textContent = 'Processing...';
    payBtn.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        // Save order to localStorage (for demo purposes)
        const order = {
            id: 'ORD-' + Date.now(),
            items: [...cart],
            customer: formData,
            total: total,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('nouriLastOrder', JSON.stringify(order));
        
        // Clear cart
        cart = [];
        saveCart();
        
        // Redirect to confirmation page
        window.location.href = 'confirmation.html';
        
    }, 2000);
}