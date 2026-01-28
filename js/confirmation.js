// ========== Run when page loads ==========
document.addEventListener('DOMContentLoaded', function() {
    displayOrderDetails();
});

// ========== Display order details ==========
function displayOrderDetails() {
    const container = document.getElementById('order-details');
    if (!container) return;
    
    // Get last order from localStorage
    const orderData = localStorage.getItem('nouriLastOrder');
    
    if (!orderData) {
        // No order found, redirect to home
        window.location.href = 'index.html';
        return;
    }
    
    const order = JSON.parse(orderData);
    
    // Format delivery date
    const deliveryDate = new Date(order.customer.deliveryDate);
    const formattedDate = deliveryDate.toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Format time slot
    const timeSlots = {
        '9-11': '9:00 AM - 11:00 AM',
        '11-13': '11:00 AM - 1:00 PM',
        '13-15': '1:00 PM - 3:00 PM',
        '15-17': '3:00 PM - 5:00 PM',
        '17-19': '5:00 PM - 7:00 PM'
    };
    const formattedTime = timeSlots[order.customer.deliveryTime] || order.customer.deliveryTime;
    
    // Build order details HTML
    container.innerHTML = `
        <h3>Order Details</h3>
        <div class="order-info-row">
            <span class="order-info-label">Order ID</span>
            <span class="order-info-value">${order.id}</span>
        </div>
        <div class="order-info-row">
            <span class="order-info-label">Name</span>
            <span class="order-info-value">${order.customer.firstName} ${order.customer.lastName}</span>
        </div>
        <div class="order-info-row">
            <span class="order-info-label">Email</span>
            <span class="order-info-value">${order.customer.email}</span>
        </div>
        <div class="order-info-row">
            <span class="order-info-label">Delivery Address</span>
            <span class="order-info-value">${order.customer.address}, ${order.customer.city}, ${order.customer.postcode}</span>
        </div>
        <div class="order-info-row">
            <span class="order-info-label">Delivery Date</span>
            <span class="order-info-value">${formattedDate}</span>
        </div>
        <div class="order-info-row">
            <span class="order-info-label">Time Slot</span>
            <span class="order-info-value">${formattedTime}</span>
        </div>
        <div class="order-info-row">
            <span class="order-info-label">Total Paid</span>
            <span class="order-info-value" style="color: var(--primary); font-size: 1.2rem;">£${order.total.toFixed(2)}</span>
        </div>
    `;
}
