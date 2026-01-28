// ========== Cart Data ==========
let cart = [];

// ========== Run when page loads ==========
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    console.log('Nouri website loaded!');
});

// ========== Load cart from local storage ==========
function loadCart() {
    const savedCart = localStorage.getItem('nouriCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartCount();
}

// ========== Save cart to local storage ==========
function saveCart() {
    localStorage.setItem('nouriCart', JSON.stringify(cart));
    updateCartCount();
}

// ========== Update cart count in navbar ==========
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

// ========== Add item to cart ==========
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    saveCart();
    showNotification(name + ' added to cart!');
}

// ========== Show notification toast ==========
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}