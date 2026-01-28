// ========== Menu data for reference ==========
const menuData = {
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
const DELIVERY_FEE = 3.50;

// ========== Run when page loads ==========
document.addEventListener('DOMContentLoaded', function() {
    renderCart();
});

// ========== Render cart items ==========
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    const emptyCart = document.getElementById('empty-cart');
    
    if (!cartItemsContainer) return;
    
    // Check if cart is empty
    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        cartSummary.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }
    
    // Show cart items
    cartItemsContainer.style.display = 'flex';
    cartSummary.style.display = 'block';
    emptyCart.style.display = 'none';
    
    // Clear container
    cartItemsContainer.innerHTML = '';
    
    // Render each item
    cart.forEach(item => {
        const emoji = menuData[item.id]?.emoji || '🍽️';
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-emoji">${emoji}</div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <span class="item-price">£${item.price.toFixed(2)}</span>
            </div>
            <div class="quantity-controls">
                <button class="qty-btn" onclick="decreaseQuantity(${item.id})">−</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="increaseQuantity(${item.id})">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">🗑️</button>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Update summary
    updateSummary();
}

// ========== Increase item quantity ==========
function increaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += 1;
        saveCart();
        renderCart();
    }
}

// ========== Decrease item quantity ==========
function decreaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            removeFromCart(id);
            return;
        }
        saveCart();
        renderCart();
    }
}

// ========== Remove item from cart ==========
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
    showNotification('Item removed from cart');
}

// ========== Update order summary ==========
function updateSummary() {
    const subtotalEl = document.getElementById('subtotal');
    const deliveryEl = document.getElementById('delivery');
    const totalEl = document.getElementById('total');
    
    // Calculate subtotal
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Delivery is free for orders over £30
    const delivery = subtotal >= 30 ? 0 : DELIVERY_FEE;
    
    // Calculate total
    const total = subtotal + delivery;
    
    // Update display
    subtotalEl.textContent = '£' + subtotal.toFixed(2);
    deliveryEl.textContent = delivery === 0 ? 'FREE' : '£' + delivery.toFixed(2);
    totalEl.textContent = '£' + total.toFixed(2);
}