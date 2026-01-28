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
        image: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&h=300&fit=crop"
    },
    {
        id: 2,
        name: "Avocado Toast",
        description: "Sourdough bread, smashed avocado, poached eggs, chilli flakes",
        price: 8.50,
        category: "breakfast",
        dietary: ["vegetarian"],
        image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop"
    },
    {
        id: 3,
        name: "Acai Bowl",
        description: "Acai blend, granola, banana, coconut flakes, almond butter",
        price: 9.00,
        category: "breakfast",
        dietary: ["vegan", "gf"],
        image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop"
    },
    
    // Lunch
    {
        id: 4,
        name: "Buddha Bowl",
        description: "Quinoa, roasted chickpeas, avocado, mixed greens, tahini dressing",
        price: 12.50,
        category: "lunch",
        dietary: ["vegan", "gf"],
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop"
    },
    {
        id: 5,
        name: "Chicken Salad Wrap",
        description: "Grilled chicken, mixed leaves, tomatoes, cucumber, yogurt sauce",
        price: 10.50,
        category: "lunch",
        dietary: [],
        image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop"
    },
    {
        id: 6,
        name: "Mushroom Soup",
        description: "Creamy wild mushroom soup with crusty bread",
        price: 7.50,
        category: "lunch",
        dietary: ["vegetarian"],
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop"
    },
    
    // Dinner
    {
        id: 7,
        name: "Grilled Salmon Bowl",
        description: "Wild salmon, brown rice, steamed broccoli, ginger soy glaze",
        price: 15.00,
        category: "dinner",
        dietary: ["gf"],
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop"
    },
    {
        id: 8,
        name: "Chicken Stir Fry",
        description: "Tender chicken, mixed vegetables, jasmine rice, teriyaki sauce",
        price: 13.50,
        category: "dinner",
        dietary: [],
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop"
    },
    {
        id: 9,
        name: "Vegan Curry",
        description: "Coconut curry with tofu, sweet potato, spinach, basmati rice",
        price: 12.00,
        category: "dinner",
        dietary: ["vegan", "gf"],
        image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop"
    },
    
    // Snacks
    {
        id: 10,
        name: "Energy Balls",
        description: "Dates, almonds, cocoa, coconut (pack of 4)",
        price: 4.50,
        category: "snacks",
        dietary: ["vegan", "gf"],
        image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=300&fit=crop"
    },
    {
        id: 11,
        name: "Fruit Cup",
        description: "Seasonal fresh fruit mix with mint",
        price: 5.00,
        category: "snacks",
        dietary: ["vegan", "gf"],
        image: "https://images.unsplash.com/photo-1564093497595-593b96d80f12?w=400&h=300&fit=crop"
    },
    {
        id: 12,
        name: "Hummus & Veggies",
        description: "House-made hummus with carrot, cucumber, celery sticks",
        price: 6.00,
        category: "snacks",
        dietary: ["vegan", "gf"],
        image: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400&h=300&fit=crop"
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
            <div class="food-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
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