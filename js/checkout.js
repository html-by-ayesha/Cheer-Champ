// =============================================
// CHECKOUT PAGE FUNCTIONALITY - WHATSAPP READY
// =============================================

// Load cart from localStorage
let cart = [];
try {
    const cartData = localStorage.getItem('cheerChampCart');
    if (cartData) cart = JSON.parse(cartData);
} catch (e) {
    console.error('Cart load error:', e);
}

// Update cart count if function exists
if (typeof updateCartCount === 'function') updateCartCount();

// =============================================
// DISPLAY CHECKOUT ITEMS
// =============================================
function displayCheckoutItems() {
    const container = document.getElementById('orderItems');
    if (!container) return;

    try {
        const freshCart = localStorage.getItem('cheerChampCart');
        if (freshCart) cart = JSON.parse(freshCart);
    } catch (e) {}

    if (!cart || cart.length === 0) {
        container.innerHTML =
            '<p style="text-align:center;color:#999;padding:40px;">Your cart is empty. Redirecting…</p>';
        setTimeout(() => window.location.href = 'cart.html', 2000);
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="order-item">
            <div class="order-item-info">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-qty">
                    Qty: ${item.quantity} × PKR ${item.price.toLocaleString()}
                </div>
            </div>
            <div class="order-item-price">
                PKR ${(item.price * item.quantity).toLocaleString()}
            </div>
        </div>
    `).join('');

    updateCheckoutSummary();
}

// =============================================
// UPDATE SUMMARY
// =============================================
function updateCheckoutSummary() {
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = subtotal > 5000 ? 0 : 250;
    const total = subtotal + shipping;

    const subtotalEl = document.getElementById('checkoutSubtotal');
    const shippingEl = document.getElementById('checkoutShipping');
    const totalEl = document.getElementById('checkoutTotal');

    if (subtotalEl) subtotalEl.textContent = `PKR ${subtotal.toLocaleString()}`;
    if (shippingEl) {
        shippingEl.textContent = shipping === 0 ? 'FREE ✨' : `PKR ${shipping}`;
        shippingEl.style.color = shipping === 0 ? '#27ae60' : '#666';
        shippingEl.style.fontWeight = shipping === 0 ? '700' : 'normal';
    }
    if (totalEl) totalEl.textContent = `PKR ${total.toLocaleString()}`;
}

// =============================================
// PLACE ORDER VIA WHATSAPP (100% OPEN)
// =============================================
function placeOrder() {
    // Reload cart
    try {
        const freshCart = localStorage.getItem('cheerChampCart');
        if (freshCart) cart = JSON.parse(freshCart);
    } catch (e) {}

    if (!cart || cart.length === 0) {
        alert('❌ Your cart is empty!');
        window.location.href = 'cart.html';
        return;
    }

    // Form fields
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const apartment = document.getElementById('apartment').value.trim();
    const city = document.getElementById('city').value.trim();
    const province = document.getElementById('province').value;
    const postalCode = document.getElementById('postalCode').value.trim();
    const orderNotes = document.getElementById('orderNotes').value.trim();

    const paymentInput = document.querySelector('input[name="payment"]:checked');
    const paymentMethod = paymentInput ? paymentInput.value : 'Not selected';

    // Build WhatsApp message
    let message = `🌟 *NEW ORDER – CHEER CHAMP* 🌟\n\n`;
    message += `👤 *Customer detail*\nName: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\n\n`;
    message += `📦 *Shipping Address*\n${address}\n`;
    if (apartment) message += `${apartment}\n`;
    message += `${city}, ${province} ${postalCode}\n\n`;
    message += `🛒 *Order Items*\n━━━━━━━━━━━━━━\n`;

    cart.forEach((item, i) => {
        message += `${i + 1}. ${item.name}\n`;
        if (item.category) message += `   Category: ${item.category}\n`;
        message += `   Price: PKR ${item.price}\n   Qty: ${item.quantity}\n   Subtotal: PKR ${item.price * item.quantity}\n\n`;
    });

    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = subtotal > 5000 ? 0 : 250;
    const total = subtotal + shipping;

    message += `💰 *Subtotal:* PKR ${subtotal}\n`;
    message += `🚚 *Shipping:* ${shipping === 0 ? 'FREE' : 'PKR ' + shipping}\n`;
    message += `💵 *Total:* PKR ${total}\n`;
    message += `💳 *Payment Method:* ${paymentMethod}\n\n`;

    if (orderNotes) message += `📝 *Notes:*\n${orderNotes}\n\n`;
    message += `Thank you for shopping with Cheer Champ 💖`;

    // WhatsApp redirect
    const whatsappURL = `https://wa.me/923176476167?text=${encodeURIComponent(message)}`;
    window.location.href = whatsappURL;

    // Clear cart after redirect
    setTimeout(() => localStorage.removeItem('cheerChampCart'), 3000);
}

// =============================================
// PAGE INIT
// =============================================
if (window.location.pathname.includes('checkout.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        displayCheckoutItems();

        const orderBtn = document.getElementById('placeOrderBtn');
        if (orderBtn) orderBtn.addEventListener('click', placeOrder);
    });
}


