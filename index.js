/* =========================================
   1. GLOBAL VARIABLES & PRICE SETUP
   ========================================= */

// Item IDs as they appear in your HTML
const itemIds = [
    "beerAmount", "ginAmount", "cocktailAmount", "shotAmount", 
    "waterAmount", "nutsAmount", "pCornAmount", "picklesAmount", 
    "foodAmount", "friesAmount"
];

// Default Turkish Lira Prices
const defaultPrices = {
    beerAmount: 150, ginAmount: 350, cocktailAmount: 400, 
    shotAmount: 100, waterAmount: 40, nutsAmount: 60, 
    pCornAmount: 80, picklesAmount: 50, foodAmount: 450, friesAmount: 150
};

// Load existing prices or use defaults
let itemPrices = JSON.parse(localStorage.getItem('itemPrices')) || defaultPrices;

/* =========================================
   2. CORE FUNCTIONS (Quantity & Storage)
   ========================================= */

function appendToDrink(drinkElement) {
    let newNum = parseInt(drinkElement.textContent) || 0;
    newNum++;
    drinkElement.textContent = newNum;
    localStorage.setItem(drinkElement.id, newNum);
    // Math is updated automatically via the MutationObserver at the bottom
}

function deductFromDrink(drinkElement) {
    let currentNum = parseInt(drinkElement.textContent) || 0;
    if (currentNum > 0) {
        let newNum = currentNum - 1;
        drinkElement.textContent = newNum;
        localStorage.setItem(drinkElement.id, newNum);
    }
}

function StartFunc() {
    // Load counts from LocalStorage
    itemIds.forEach(id => {
        const savedVal = localStorage.getItem(id);
        const element = document.getElementById(id);
        if (element) {
            element.textContent = savedVal !== null ? savedVal : "0";
        }
    });

    // If first time ever, initialize storage
    if (localStorage.getItem("beerAmount") === null) {
        itemIds.forEach(id => localStorage.setItem(id, "0"));
    }
    
    calculateTotal();
}

function ClearStorage() {
    const currentTheme = localStorage.getItem('theme');
    localStorage.clear();
    
    // Put theme and prices back
    if (currentTheme) localStorage.setItem('theme', currentTheme);
    localStorage.setItem('itemPrices', JSON.stringify(itemPrices));

    // Update UI instantly without refresh
    itemIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = "0";
            el.classList.remove('active-count');
        }
    });
    calculateTotal();
}

/* =========================================
   3. CALCULATION & PRICE SETTINGS
   ========================================= */

function calculateTotal() {
    let total = 0;
    itemIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            const quantity = parseInt(element.textContent) || 0;
            const price = itemPrices[id] || 0;
            total += quantity * price;
        }
    });

    const totalDisplay = document.getElementById("totalPrice");
    if (totalDisplay) {
        totalDisplay.textContent = total.toLocaleString('tr-TR', { minimumFractionDigits: 2 });
    }
}

function setupPriceInputs() {
    const grid = document.getElementById('settingsGrid');
    if (!grid) return;
    grid.innerHTML = ''; 
    
    itemIds.forEach(id => {
        const name = id.replace('Amount', '').toUpperCase();
        const price = itemPrices[id] || 0;
        
        const div = document.createElement('div');
        div.className = "price-item";
        div.innerHTML = `
            <label>${name}</label>
            <input type="number" value="${price}" onchange="updatePrice('${id}', this.value)">
        `;
        grid.appendChild(div);
    });
}

function updatePrice(id, newPrice) {
    itemPrices[id] = parseFloat(newPrice) || 0;
    localStorage.setItem('itemPrices', JSON.stringify(itemPrices));
    calculateTotal();
}

/* =========================================
   4. THEME & MODAL LOGIC (Wait for DOM)
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initial Start
    StartFunc();

    // 2. Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    if (localStorage.getItem('theme') === 'cyberpunk') {
        document.body.classList.add('cyberpunk');
        themeToggle.innerText = 'SWITCH TO CLASSIC MODE';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('cyberpunk');
        if (document.body.classList.contains('cyberpunk')) {
            themeToggle.innerText = 'SWITCH TO CLASSIC MODE';
            localStorage.setItem('theme', 'cyberpunk');
        } else {
            themeToggle.innerText = 'SWITCH TO CYBERPUNK MODE';
            localStorage.setItem('theme', 'classic');
        }
    });

    // 3. Modal Controls
    const modal = document.getElementById("settingsModal");
    const openBtn = document.getElementById("openSettings");
    const closeBtn = document.getElementById("closeSettings");

    if (openBtn) {
        openBtn.onclick = () => {
            setupPriceInputs();
            modal.style.display = "block";
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => modal.style.display = "none";
    }

    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = "none";
    };

    // 4. Automatic Color & Total Observer
    // Watches for text changes so you don't have to manually call functions everywhere
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            const el = mutation.target;
            const count = parseInt(el.textContent) || 0;
            
            // Handle color highlight
            if (count > 0) el.classList.add('active-count');
            else el.classList.remove('active-count');
            
            // Handle math update
            calculateTotal();
        });
    });

    document.querySelectorAll('.amount').forEach((amountEl) => {
        observer.observe(amountEl, { childList: true });
    });
});
