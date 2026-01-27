// =============================================
// SHOPPING CART FUNCTIONALITY
// =============================================

// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cheerChampCart')) || [];

// Update cart count on page load
updateCartCount();

// =============================================
// ADD TO CART FUNCTION
// =============================================
function addToCart(id, name, price, oldPrice, category) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        // Increase quantity if item exists
        existingItem.quantity += 1;
    } else {
        // Add new item to cart
        const item = {
            id: id,
            name: name,
            price: price,
            oldPrice: oldPrice,
            category: category,
            quantity: 1,
            image: '👗' // Will be replaced with actual images later
        };
        cart.push(item);
    }
    
    // Save to localStorage
    localStorage.setItem('cheerChampCart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show notification
    showCartNotification();
}

// =============================================
// UPDATE CART COUNT
// =============================================
function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        
        // Add animation
        if (totalItems > 0) {
            cartCountElement.style.display = 'flex';
            cartCountElement.style.animation = 'bounce 0.5s';
        } else {
            cartCountElement.style.display = 'none';
        }
    }
}

// =============================================
// SHOW CART NOTIFICATION
// =============================================
function showCartNotification() {
    const notification = document.getElementById('cartNotification');
    if (notification) {
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }
}

// =============================================
// REMOVE FROM CART
// =============================================
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cheerChampCart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
}

// =============================================
// UPDATE QUANTITY
// =============================================
function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    
    if (item) {
        item.quantity += change;
        
        // Remove item if quantity is 0
        if (item.quantity <= 0) {
            removeFromCart(id);
            return;
        }
        
        localStorage.setItem('cheerChampCart', JSON.stringify(cart));
        updateCartCount();
        displayCartItems();
    }
}

// =============================================
// DISPLAY CART ITEMS (FOR CART PAGE)
// =============================================
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartSummary = document.getElementById('cartSummary');
    
    if (!cartItemsContainer) return; // Not on cart page
    
    // Check if cart is empty
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h2>Your Cart is Empty</h2>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <button class="btn-primary" onclick="window.location.href='index.html'">
                    Continue Shopping
                </button>
            </div>
        `;
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }
    
    // Display cart items
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                ${item.image}
            </div>
            <div class="cart-item-detail">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-category">${item.category}</div>
                <div class="cart-item-price">PKR ${item.price.toLocaleString()}</div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">
                        🗑️ Remove
                    </button>
                </div>
            </div>
            <div class="cart-item-total">
                <div style="font-size: 20px; font-weight: 700; color: #ff6ec7; font-family: 'Fredoka', sans-serif;">
                    PKR ${(item.price * item.quantity).toLocaleString()}
                </div>
            </div>
        </div>
    `).join('');
    
    // Update summary
    updateCartSummary();
}

// =============================================
// UPDATE CART SUMMARY
// =============================================
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 5000 ? 0 : 250; // Free shipping over 5000
    const total = subtotal + shipping;
    
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) subtotalElement.textContent = `PKR ${subtotal.toLocaleString()}`;
    if (shippingElement) {
        shippingElement.textContent = shipping === 0 ? 'FREE' : `PKR ${shipping}`;
        shippingElement.style.color = shipping === 0 ? '#27ae60' : '#666';
    }
    if (totalElement) totalElement.textContent = `PKR ${total.toLocaleString()}`;
}

// =============================================
// PROCEED TO CHECKOUT
// =============================================
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    window.location.href = 'checkout.html';
}

// =============================================
// QUICK VIEW PRODUCT
// =============================================
function viewProduct(id) {
    alert(`product-detail page coming soon! Product ID: ${id}`);
    // You can create a product-detail.html page later
}

// =============================================
// LOAD CART PAGE
// =============================================
if (window.location.pathname.includes('cart.html')) {
    displayCartItems();
}

// =============================================
// ANIMATION FOR CART COUNT
// =============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.3); }
    }
`;
document.head.appendChild(style);

// =============================================
// CONSOLE LOG FOR DEBUGGING
// =============================================
console.log('🛒 Cart System Loaded!');
console.log('Current Cart:', cart);