// ========== Stripe Configuration ==========
const STRIPE_PUBLIC_KEY = 'pk_test_51SuZVhPOyNFIF5r74pLwXwLt9idaCrJXCDj4OI6MVHjWOmegXqgJcXNWbWHFYpJJecbb04ow5HYZ4iLcXDlNvf9Y00dPmme4Ko';
const stripe = Stripe(STRIPE_PUBLIC_KEY);

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

// ========== Stripe Elements ==========
let cardElement;

// ========== Run when page loads ==========
document.addEventListener('DOMContentLoaded', function() {
    renderCheckoutItems();
    setMinDeliveryDate();
    setupStripeElements();
    setupPayButton();
});

// ========== Setup Stripe Card Element ==========
function setupStripeElements() {
    const elements = stripe.elements();
    
    const style = {
        base: {
            fontSize: '16px',
            color: '#2D3436',
            fontFamily: '"DM Sans", sans-serif',
            '::placeholder': {
                color: '#636E72'
            }
        },
        invalid: {
            color: '#e74c3c',
            iconColor: '#e74c3c'
        }
    };
    
    cardElement = elements.create('card', { style: style });
    
    const cardContainer = document.getElementById('card-element');
    if (cardContainer) {
        cardElement.mount('#card-element');
        
        cardElement.on('change', function(event) {
            const displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });
    }
}

// ========== Render cart items in checkout summary ==========
function renderCheckoutItems() {
    const container = document.getElementById('checkout-items');
    if (!container) return;
    
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
    
    payBtn.addEventListener('click', async function() {
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
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
        
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const delivery = subtotal >= 30 ? 0 : CHECKOUT_DELIVERY_FEE;
        const total = subtotal + delivery;
        
        await processStripePayment(formData, total);
    });
}

// ========== Process Stripe Payment ==========
async function processStripePayment(formData, total) {
    const payBtn = document.getElementById('pay-btn');
    const cardErrors = document.getElementById('card-errors');
    
    payBtn.textContent = 'Processing...';
    payBtn.disabled = true;
    
    const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            address: {
                line1: formData.address,
                city: formData.city,
                postal_code: formData.postcode,
                country: 'GB'
            }
        }
    });
    
    if (error) {
        cardErrors.textContent = error.message;
        payBtn.textContent = '💳 Pay Now';
        payBtn.disabled = false;
        return;
    }
    
    console.log('Payment Method Created:', paymentMethod.id);
    
    setTimeout(() => {
        const order = {
            id: 'ORD-' + Date.now(),
            paymentMethodId: paymentMethod.id,
            items: [...cart],
            customer: formData,
            total: total,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('nouriLastOrder', JSON.stringify(order));
        
        cart = [];
        saveCart();
        
        window.location.href = 'confirmation.html';
        
    }, 1500);
}