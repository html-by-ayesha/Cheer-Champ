// =============================================
// ENHANCED PRODUCT FILTERING WITH VISUAL FEEDBACK
// =============================================

let activeFilters = {
    price: 'all',
    discount: 'all'
};

function showFilterMenu() {
    const filterHTML = `
        <div id="filterModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 40px; border-radius: 20px; max-width: 500px; width: 90%;">
                <h3 style="font-family: 'Fredoka', sans-serif; font-size: 24px; color: #ff6ec7; margin-bottom: 20px;">Filter shop</h3>
                
                <div style="margin-bottom: 20px;">
                    <label style="font-weight: 600; display: block; margin-bottom: 10px;">Price Range:</label>
                    <select id="priceFilter" style="width: 100%; padding: 12px; border: 2px solid #ffe6f5; border-radius: 10px; font-size: 14px;">
                        <option value="all" ${activeFilters.price === 'all' ? 'selected' : ''}>All Prices</option>
                        <option value="0-3000" ${activeFilters.price === '0-3000' ? 'selected' : ''}>Under PKR 3,000</option>
                        <option value="3000-5000" ${activeFilters.price === '3000-5000' ? 'selected' : ''}>PKR 3,000 - 5,000</option>
                        <option value="5000-7000" ${activeFilters.price === '5000-7000' ? 'selected' : ''}>PKR 5,000 - 7,000</option>
                        <option value="7000-10000" ${activeFilters.price === '7000-10000' ? 'selected' : ''}>PKR 7,000 - 10,000</option>
                        <option value="10000" ${activeFilters.price === '10000' ? 'selected' : ''}>Above PKR 10,000</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="font-weight: 600; display: block; margin-bottom: 10px;">Discount:</label>
                    <select id="discountFilter" style="width: 100%; padding: 12px; border: 2px solid #ffe6f5; border-radius: 10px; font-size: 14px;">
                        <option value="all" ${activeFilters.discount === 'all' ? 'selected' : ''}>All shop</option>
                        <option value="sale" ${activeFilters.discount === 'sale' ? 'selected' : ''}>On Sale Only</option>
                        <option value="new" ${activeFilters.discount === 'new' ? 'selected' : ''}>New Arrivals</option>
                    </select>
                </div>
                
                <div style="display: flex; gap: 10px; margin-top: 30px;">
                    <button onclick="applyFilters()" style="flex: 1; padding: 15px; background: linear-gradient(135deg, #ff6ec7 0%, #ffd93d 100%); color: white; border: none; border-radius: 50px; font-weight: 700; cursor: pointer;">Apply Filters</button>
                    <button onclick="clearAllFilters()" style="flex: 1; padding: 15px; background: #f0f0f0; color: #333; border: none; border-radius: 50px; font-weight: 700; cursor: pointer;">Clear All</button>
                    <button onclick="closeFilterModal()" style="padding: 15px 20px; background: #e74c3c; color: white; border: none; border-radius: 50px; font-weight: 700; cursor: pointer;">✕</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', filterHTML);
}

function closeFilterModal() {
    const modal = document.getElementById('filterModal');
    if (modal) modal.remove();
}

function applyFilters() {
    const priceRange = document.getElementById('priceFilter').value;
    const discountType = document.getElementById('discountFilter').value;
    
    // Save active filters
    activeFilters.price = priceRange;
    activeFilters.discount = discountType;
    
    const productCards = document.querySelectorAll('.product-card');
    let visibleCount = 0;
    let totalCount = productCards.length;
    
    productCards.forEach(card => {
        let show = true;
        
        // Price filter
        if (priceRange !== 'all') {
            const priceElement = card.querySelector('.product-price');
            if (priceElement) {
                const priceText = priceElement.textContent;
                const price = parseInt(priceText.replace(/[^0-9]/g, ''));
                
                if (priceRange === '0-3000' && price >= 3000) show = false;
                if (priceRange === '3000-5000' && (price < 3000 || price >= 5000)) show = false;
                if (priceRange === '5000-7000' && (price < 5000 || price >= 7000)) show = false;
                if (priceRange === '7000-10000' && (price < 7000 || price >= 10000)) show = false;
                if (priceRange === '10000' && price < 10000) show = false;
            }
        }
        
        // Discount filter
        if (discountType === 'sale') {
            const hasSaleBadge = card.querySelector('.badge-sale');
            if (!hasSaleBadge) show = false;
        }
        
        if (discountType === 'new') {
            const hasNewBadge = card.querySelector('.badge-new');
            if (!hasNewBadge) show = false;
        }
        
        // Show/hide product with animation
        if (show) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease';
            visibleCount++;
        } else {
            card.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    closeFilterModal();
    
    // Show active filter tags
    showActiveFilterTags();
    
    // Update product count
    updateProductCount(visibleCount, totalCount);
    
    // Show result message
    if (visibleCount === 0) {
        showMessage('❌ No shop match your filters', 'error');
    } else {
        showMessage(`✅ Showing ${visibleCount} of ${totalCount} shop`, 'success');
    }
}

function showActiveFilterTags() {
    // Remove existing filter tags
    const existingTags = document.getElementById('activeFilterTags');
    if (existingTags) existingTags.remove();
    
    // Check if any filters are active
    const hasActiveFilters = activeFilters.price !== 'all' || activeFilters.discount !== 'all';
    
    if (!hasActiveFilters) return;
    
    // Create filter tags container
    const filterSection = document.querySelector('.filter-group');
    if (!filterSection) return;
    
    const tagsHTML = `
        <div id="activeFilterTags" style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 15px; padding: 15px; background: #fff3f8; border-radius: 12px; border: 2px dashed #ff6ec7;">
            <span style="font-weight: 600; color: #ff6ec7; font-size: 14px;">Active Filters:</span>
            ${activeFilters.price !== 'all' ? `
                <span class="filter-tag" style="background: linear-gradient(135deg, #ff6ec7 0%, #ffd93d 100%); color: white; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; gap: 5px;">
                    💰 ${getPriceRangeText(activeFilters.price)}
                    <button onclick="removeFilter('price')" style="background: rgba(255,255,255,0.3); border: none; color: white; width: 18px; height: 18px; border-radius: 50%; cursor: pointer; font-size: 12px; line-height: 1;">✕</button>
                </span>
            ` : ''}
            ${activeFilters.discount !== 'all' ? `
                <span class="filter-tag" style="background: linear-gradient(135deg, #ff6ec7 0%, #ffd93d 100%); color: white; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; gap: 5px;">
                    ${activeFilters.discount === 'sale' ? '🏷️ On Sale' : '✨ New Arrivals'}
                    <button onclick="removeFilter('discount')" style="background: rgba(255,255,255,0.3); border: none; color: white; width: 18px; height: 18px; border-radius: 50%; cursor: pointer; font-size: 12px; line-height: 1;">✕</button>
                </span>
            ` : ''}
            <button onclick="clearAllFilters()" style="background: #e74c3c; color: white; border: none; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer;">Clear All</button>
        </div>
    `;
    
    filterSection.insertAdjacentHTML('afterend', tagsHTML);
}

function getPriceRangeText(range) {
    const ranges = {
        '0-3000': 'Under PKR 3,000',
        '3000-5000': 'PKR 3,000 - 5,000',
        '5000-7000': 'PKR 5,000 - 7,000',
        '7000-10000': 'PKR 7,000 - 10,000',
        '10000': 'Above PKR 10,000'
    };
    return ranges[range] || range;
}

function removeFilter(filterType) {
    activeFilters[filterType] = 'all';
    
    // Reapply filters
    const productCards = document.querySelectorAll('.product-card');
    let visibleCount = 0;
    
    productCards.forEach(card => {
        let show = true;
        
        // Price filter
        if (activeFilters.price !== 'all') {
            const priceElement = card.querySelector('.product-price');
            if (priceElement) {
                const priceText = priceElement.textContent;
                const price = parseInt(priceText.replace(/[^0-9]/g, ''));
                
                if (activeFilters.price === '0-3000' && price >= 3000) show = false;
                if (activeFilters.price === '3000-5000' && (price < 3000 || price >= 5000)) show = false;
                if (activeFilters.price === '5000-7000' && (price < 5000 || price >= 7000)) show = false;
                if (activeFilters.price === '7000-10000' && (price < 7000 || price >= 10000)) show = false;
                if (activeFilters.price === '10000' && price < 10000) show = false;
            }
        }
        
        // Discount filter
        if (activeFilters.discount === 'sale') {
            const hasSaleBadge = card.querySelector('.badge-sale');
            if (!hasSaleBadge) show = false;
        }
        
        if (activeFilters.discount === 'new') {
            const hasNewBadge = card.querySelector('.badge-new');
            if (!hasNewBadge) show = false;
        }
        
        if (show) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    showActiveFilterTags();
    updateProductCount(visibleCount, productCards.length);
    showMessage(`Filter removed! Showing ${visibleCount} shop`, 'success');
}

function clearAllFilters() {
    activeFilters.price = 'all';
    activeFilters.discount = 'all';
    
    // Show all shop
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.display = 'block';
        card.style.animation = 'fadeIn 0.3s ease';
    });
    
    // Remove filter tags
    const existingTags = document.getElementById('activeFilterTags');
    if (existingTags) existingTags.remove();
    
    // Update count
    updateProductCount(productCards.length, productCards.length);
    
    // Close modal if open
    closeFilterModal();
    
    showMessage('✅ All filters cleared!', 'success');
}

function updateProductCount(visible, total) {
    // Find or create product count display
    let countDisplay = document.getElementById('productCount');
    
    if (!countDisplay) {
        const filterGroup = document.querySelector('.filter-group');
        if (filterGroup) {
            const countHTML = `
                <div id="productCount" style="padding: 10px 20px; background: #f8f9fa; border-radius: 10px; font-weight: 600; color: #4a5568; font-size: 14px;">
                    Showing <span style="color: #ff6ec7;">${visible}</span> of <span style="color: #ff6ec7;">${total}</span> shop
                </div>
            `;
            filterGroup.insertAdjacentHTML('beforebegin', countHTML);
        }
    } else {
        countDisplay.innerHTML = `Showing <span style="color: #ff6ec7;">${visible}</span> of <span style="color: #ff6ec7;">${total}</span> shop`;
    }
}

// Add fade animations
const fadeStyles = document.createElement('style');
fadeStyles.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.95); }
    }
`;
document.head.appendChild(fadeStyles);
// =============================================
// PROFESSIONAL E-COMMERCE SEARCH SYSTEM
// =============================================

// Global search state
let searchOverlayOpen = false;

// Toggle Search Overlay
function toggleSearch() {
    if (searchOverlayOpen) {
        closeSearch();
    } else {
        openSearch();
    }
}

// Open Search Overlay
function openSearch() {
    const searchHTML = `
        <div id="searchOverlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.98); z-index: 10000; overflow-y: auto; animation: fadeIn 0.3s;">
            <div style="max-width: 1200px; margin: 0 auto; padding: 50px 30px;">
                
                <!-- Search Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                    <h2 style="font-family: 'Fredoka', sans-serif; color: #ff6ec7; font-size: 36px; margin: 0;">Search shop</h2>
                    <button onclick="closeSearch()" style="background: linear-gradient(135deg, #ff6ec7 0%, #ffd93d 100%); border: none; width: 50px; height: 50px; border-radius: 50%; font-size: 30px; color: white; cursor: pointer; line-height: 1; box-shadow: 0 5px 15px rgba(255,110,199,0.3);">&times;</button>
                </div>

                <!-- Search Input -->
                <div style="position: relative; margin-bottom: 30px;">
                    <i class="fas fa-search" style="position: absolute; left: 25px; top: 50%; transform: translateY(-50%); color: #ff6ec7; font-size: 24px;"></i>
                    <input 
                        type="text" 
                        id="searchInput" 
                        placeholder="Search for dresses, pants, accessories..."
                        oninput="performSearch(this.value)"
                        style="width: 100%; padding: 22px 25px 22px 70px; border: 3px solid #ff6ec7; border-radius: 50px; font-size: 20px; font-family: 'Fredoka', sans-serif; outline: none; box-shadow: 0 8px 25px rgba(255,110,199,0.2);"
                    >
                </div>

                <!-- Quick Filters -->
                <div style="display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 40px;">
                    <button onclick="quickSearch('dresses')" style="padding: 14px 28px; background: #fff; border: 2px solid #ffe6f5; border-radius: 25px; font-family: 'Fredoka'; color: #666; cursor: pointer; font-size: 16px; font-weight: 600; transition: all 0.3s;" onmouseover="this.style.borderColor='#ff6ec7'; this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='#ffe6f5'; this.style.transform='translateY(0)'">Dresses</button>
                    <button onclick="quickSearch('pants')" style="padding: 14px 28px; background: #fff; border: 2px solid #ffe6f5; border-radius: 25px; font-family: 'Fredoka'; color: #666; cursor: pointer; font-size: 16px; font-weight: 600; transition: all 0.3s;" onmouseover="this.style.borderColor='#ff6ec7'; this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='#ffe6f5'; this.style.transform='translateY(0)'">Pants</button>
                    <button onclick="quickSearch('accessories')" style="padding: 14px 28px; background: #fff; border: 2px solid #ffe6f5; border-radius: 25px; font-family: 'Fredoka'; color: #666; cursor: pointer; font-size: 16px; font-weight: 600; transition: all 0.3s;" onmouseover="this.style.borderColor='#ff6ec7'; this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='#ffe6f5'; this.style.transform='translateY(0)'">Accessories</button>
                    <button onclick="quickSearch('sale')" style="padding: 14px 28px; background: linear-gradient(135deg, #ff6ec7 0%, #ffd93d 100%); border: none; border-radius: 25px; font-family: 'Fredoka'; color: white; cursor: pointer; font-size: 16px; font-weight: 700; box-shadow: 0 5px 15px rgba(255,110,199,0.3); transition: all 0.3s;" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">Sale Items</button>
                </div>

                <!-- Search Results -->
                <div id="searchResults">
                    <p style="text-align: center; color: #999; font-family: 'Fredoka'; padding: 80px 20px; font-size: 20px;">Start typing to search shop...</p>
                </div>

            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', searchHTML);
    searchOverlayOpen = true;
    
    // Focus search input
    setTimeout(() => {
        document.getElementById('searchInput').focus();
    }, 100);
}

// Close Search Overlay
function closeSearch() {
    const overlay = document.getElementById('searchOverlay');
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.3s';
        setTimeout(() => overlay.remove(), 300);
    }
    searchOverlayOpen = false;
}

// Quick Search
function quickSearch(term) {
    document.getElementById('searchInput').value = term;
    performSearch(term);
}

// Perform Search (REAL SEARCH)
function performSearch(query) {
    const resultsDiv = document.getElementById('searchResults');
    
    if (!query || query.length < 2) {
        resultsDiv.innerHTML = '<p style="text-align: center; color: #999; font-family: \'Fredoka\'; padding: 40px;">Start typing to search shop...</p>';
        return;
    }

    // Show loading
    resultsDiv.innerHTML = '<p style="text-align: center; color: #ff6ec7; font-family: \'Fredoka\'; padding: 40px;"><i class="fas fa-spinner fa-spin"></i> Searching...</p>';

    // Simulate search (you'll replace this with real product data)
    setTimeout(() => {
        const results = searchshop(query);
        displaySearchResults(results);
    }, 500);
}

// Search shop Function (THIS SEARCHES YOUR ACTUAL shop)
function searchshop(query) {
    // Get all product cards from the page
    const allshop = document.querySelectorAll('.product-card');
    const results = [];
    
    query = query.toLowerCase();
    
    allshop.forEach(card => {
        const name = card.querySelector('.product-name')?.textContent.toLowerCase() || '';
        const category = card.querySelector('.product-category')?.textContent.toLowerCase() || '';
        const price = card.querySelector('.product-price')?.textContent || '';
        const image = card.querySelector('.product-image')?.src || card.querySelector('img')?.src || '';
        
        // Check if query matches name or category
        if (name.includes(query) || category.includes(query)) {
            results.push({
                name: card.querySelector('.product-name')?.textContent || 'Product',
                price: price,
                image: image,
                card: card
            });
        }
    });
    
    return results;
}

// Display Search Results
function displaySearchResults(results) {
    const resultsDiv = document.getElementById('searchResults');
    
    if (results.length === 0) {
        resultsDiv.innerHTML = `
            <div style="text-align: center; padding: 40px; font-family: 'Fredoka';">
                <i class="fas fa-search" style="font-size: 48px; color: #ddd; margin-bottom: 15px;"></i>
                <p style="color: #999; font-size: 18px; margin: 0;">No shop found</p>
                <p style="color: #ccc; font-size: 14px; margin-top: 5px;">Try different keywords</p>
            </div>
        `;
        return;
    }
    
    let html = `<div style="font-family: 'Fredoka'; color: #666; font-size: 14px; margin-bottom: 15px; font-weight: 600;">${results.length} product(s) found</div>`;
    
    results.forEach(product => {
        html += `
            <div onclick="closeSearch(); window.location.href='#product'" style="display: flex; align-items: center; gap: 15px; padding: 15px; border: 2px solid #ffe6f5; border-radius: 12px; margin-bottom: 10px; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.borderColor='#ff6ec7'; this.style.transform='translateX(5px)'" onmouseout="this.style.borderColor='#ffe6f5'; this.style.transform='translateX(0)'">
                <img src="${product.image}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 5px 0; font-family: 'Fredoka'; color: #333; font-size: 16px;">${product.name}</h4>
                    <p style="margin: 0; color: #ff6ec7; font-weight: 700; font-size: 15px;">${product.price}</p>
                </div>
                <i class="fas fa-arrow-right" style="color: #ff6ec7; font-size: 18px;"></i>
            </div>
        `;
    });
    
    resultsDiv.innerHTML = html;
}

// Close on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && searchOverlayOpen) {
        closeSearch();
    }
});

// Add animations
const searchStyles = document.createElement('style');
searchStyles.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    @keyframes slideDown {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(searchStyles);