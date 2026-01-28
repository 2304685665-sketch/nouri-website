// ========== Menu Data ==========
const menuItems = [
    // Breakfast
    {
        id: 1,
        name: "Overnight Oats",
        description: "Rolled oats, almond milk, chia seeds, fresh berries, and honey",
        price: 6.50,
        category: "breakfast",
        dietary: ["vegetarian"],
        emoji: "🥣"
    },
    {
        id: 2,
        name: "Avocado Toast",
        description: "Sourdough bread, smashed avocado, poached eggs, chilli flakes",
        price: 8.50,
        category: "breakfast",
        dietary: ["vegetarian"],
        emoji: "🥑"
    },
    {
        id: 3,
        name: "Acai Bowl",
        description: "Acai blend, granola, banana, coconut flakes, almond butter",
        price: 9.00,
        category: "breakfast",
        dietary: ["vegan", "gf"],
        emoji: "🫐"
    },
    
    // Lunch
    {
        id: 4,
        name: "Buddha Bowl",
        description: "Quinoa, roasted chickpeas, avocado, mixed greens, tahini dressing",
        price: 12.50,
        category: "lunch",
        dietary: ["vegan", "gf"],
        emoji: "🥗"
    },
    {
        id: 5,
        name: "Chicken Salad Wrap",
        description: "Grilled chicken, mixed leaves, tomatoes, cucumber, yogurt sauce",
        price: 10.50,
        category: "lunch",
        dietary: [],
        emoji: "🌯"
    },
    {
        id: 6,
        name: "Mushroom Soup",
        description: "Creamy wild mushroom soup with crusty bread",
        price: 7.50,
        category: "lunch",
        dietary: ["vegetarian"],
        emoji: "🍄"
    },
    
    // Dinner
    {
        id: 7,
        name: "Grilled Salmon Bowl",
        description: "Wild salmon, brown rice, steamed broccoli, ginger soy glaze",
        price: 15.00,
        category: "dinner",
        dietary: ["gf"],
        emoji: "🍣"
    },
    {
        id: 8,
        name: "Chicken Stir Fry",
        description: "Tender chicken, mixed vegetables, jasmine rice, teriyaki sauce",
        price: 13.50,
        category: "dinner",
        dietary: [],
        emoji: "🍗"
    },
    {
        id: 9,
        name: "Vegan Curry",
        description: "Coconut curry with tofu, sweet potato, spinach, basmati rice",
        price: 12.00,
        category: "dinner",
        dietary: ["vegan", "gf"],
        emoji: "🍛"
    },
    
    // Snacks
    {
        id: 10,
        name: "Energy Balls",
        description: "Dates, almonds, cocoa, coconut (pack of 4)",
        price: 4.50,
        category: "snacks",
        dietary: ["vegan", "gf"],
        emoji: "🟤"
    },
    {
        id: 11,
        name: "Fruit Cup",
        description: "Seasonal fresh fruit mix with mint",
        price: 5.00,
        category: "snacks",
        dietary: ["vegan", "gf"],
        emoji: "🍓"
    },
    {
        id: 12,
        name: "Hummus & Veggies",
        description: "House-made hummus with carrot, cucumber, celery sticks",
        price: 6.00,
        category: "snacks",
        dietary: ["vegan", "gf"],
        emoji: "🥕"
    }
];

// ========== Current filter ==========
let currentCategory = 'all';

// ========== Run when page loads ==========
document.addEventListener('DOMContentLoaded', function() {
    renderMenuItems(menuItems);
    setupFilterButtons();
});

// ========== Render menu items to page ==========
function renderMenuItems(items) {
    const container = document.getElementById('menu-items');
    if (!container) return;
    
    container.innerHTML = '';
    
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.setAttribute('data-category', item.category);
        
        // Build dietary tags HTML
        let tagsHTML = '';
        item.dietary.forEach(tag => {
            if (tag === 'vegetarian') {
                tagsHTML += '<span class="tag vegetarian">V</span>';
            } else if (tag === 'vegan') {
                tagsHTML += '<span class="tag vegan">VG</span>';
            } else if (tag === 'gf') {
                tagsHTML += '<span class="tag gf">GF</span>';
            }
        });
        
        card.innerHTML = `
            <div class="food-image">${item.emoji}</div>
            <div class="food-info">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="food-footer">
                    <span class="price">£${item.price.toFixed(2)}</span>
                    <span class="dietary-tags">${tagsHTML}</span>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${item.id}, '${item.name}', ${item.price})">
                    Add to Cart
                </button>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// ========== Setup filter buttons ==========
function setupFilterButtons() {
    const buttons = document.querySelectorAll('.filter-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button style
            buttons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Get selected category
            currentCategory = this.getAttribute('data-category');
            
            // Filter and render items
            if (currentCategory === 'all') {
                renderMenuItems(menuItems);
            } else {
                const filtered = menuItems.filter(item => item.category === currentCategory);
                renderMenuItems(filtered);
            }
        });
    });
}