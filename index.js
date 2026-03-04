/* =========================================
   1. TEMEL DEĞİŞKENLER VE BAŞLATMA
   ========================================= */
const prices = JSON.parse(localStorage.getItem('drinkPrices')) || {
    beerAmount: 0, ginAmount: 0, cocktailAmount: 0, shotAmount: 0,
    waterAmount: 0, nutsAmount: 0, pCornAmount: 0, picklesAmount: 0,
    foodAmount: 0, friesAmount: 0
};

const counts = JSON.parse(localStorage.getItem('drinkCounts')) || {
    beerAmount: 0, ginAmount: 0, cocktailAmount: 0, shotAmount: 0,
    waterAmount: 0, nutsAmount: 0, pCornAmount: 0, picklesAmount: 0,
    foodAmount: 0, friesAmount: 0
};

window.onload = () => {
    // Önce sıralamayı geri yükle
    restoreOrder();
    
    // Sonra değerleri bas
    Object.keys(counts).forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.innerText = counts[id];
            updateCountStyle(el, counts[id]);
        }
    });
    updateTotal();
};

/* =========================================
   2. SIRALAMA KAYIT SİSTEMİ (KALICILIK)
   ========================================= */
function saveOrder() {
    const items = [...document.querySelectorAll('.itemContainer')];
    // Her bir container içindeki miktarın ID'sini referans alarak sırayı kaydet
    const orderIds = items.map(item => item.querySelector('.amount').id);
    localStorage.setItem('drinkOrder', JSON.stringify(orderIds));
}

function restoreOrder() {
    const savedOrder = JSON.parse(localStorage.getItem('drinkOrder'));
    if (!savedOrder) return;

    const mainContainer = document.getElementById('mainContainer');
    const clearBtn = document.getElementById('clearButton');

    savedOrder.forEach(id => {
        const amountEl = document.getElementById(id);
        if (amountEl) {
            const container = amountEl.closest('.itemContainer');
            // Butonların hemen üstüne sırayla ekleyerek düzeni kur
            mainContainer.insertBefore(container, clearBtn);
        }
    });
}

/* =========================================
   3. HESAPLAMA MANTIĞI
   ========================================= */
function appendToDrink(element) {
    const id = element.id;
    counts[id]++;
    element.innerText = counts[id];
    updateCountStyle(element, counts[id]);
    saveData();
    updateTotal();
}

function deductFromDrink(element) {
    const id = element.id;
    if (counts[id] > 0) {
        counts[id]--;
        element.innerText = counts[id];
        updateCountStyle(element, counts[id]);
        saveData();
        updateTotal();
    }
}

function updateCountStyle(element, count) {
    if (count > 0) element.classList.add('active-count');
    else element.classList.remove('active-count');
}

function updateTotal() {
    let total = 0;
    Object.keys(counts).forEach(id => {
        total += counts[id] * (prices[id] || 0);
    });
    document.getElementById('totalPrice').innerText = total.toFixed(2);
}

function saveData() {
    localStorage.setItem('drinkCounts', JSON.stringify(counts));
}

/* =========================================
   4. SÜRÜKLE-BIRAK (HYBRID MOTOR)
   ========================================= */
const mainContainer = document.getElementById('mainContainer');
let draggingElement = null;

const startDrag = (target) => {
    draggingElement = target.closest('.itemContainer');
    if (draggingElement) draggingElement.classList.add('dragging');
};

const endDrag = () => {
    if (draggingElement) {
        draggingElement.classList.remove('dragging');
        draggingElement = null;
        saveOrder(); // Yerleştiği anda sırayı kaydet
    }
};

mainContainer.addEventListener('dragstart', (e) => startDrag(e.target));
mainContainer.addEventListener('dragend', endDrag);

mainContainer.addEventListener('touchstart', (e) => {
    if (e.target.tagName !== 'BUTTON') startDrag(e.target);
}, { passive: true });

mainContainer.addEventListener('touchend', endDrag);

const handleMove = (y) => {
    if (!draggingElement) return;
    const afterElement = getDragAfterElement(mainContainer, y);
    const limit = document.getElementById('clearButton');

    if (afterElement == null) mainContainer.insertBefore(draggingElement, limit);
    else if (afterElement !== limit && !afterElement.classList.contains('modal')) {
        mainContainer.insertBefore(draggingElement, afterElement);
    }
};

mainContainer.addEventListener('dragover', (e) => { e.preventDefault(); handleMove(e.clientY); });
mainContainer.addEventListener('touchmove', (e) => {
    if (!draggingElement) return;
    e.preventDefault();
    handleMove(e.touches[0].clientY);
}, { passive: false });

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.itemContainer:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
        else return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

/* =========================================
   5. DİĞER FONKSİYONLAR (TEMA/MODAL)
   ========================================= */
document.getElementById('themeToggle').onclick = () => document.body.classList.toggle('cyberpunk');
document.getElementById('clearButton').onclick = () => document.getElementById('clearModal').style.display = 'block';
document.getElementById('cancelClear').onclick = () => document.getElementById('clearModal').style.display = 'none';

document.getElementById('confirmClear').onclick = () => {
    Object.keys(counts).forEach(id => {
        counts[id] = 0;
        const el = document.getElementById(id);
        if(el) { el.innerText = '0'; el.classList.remove('active-count'); }
    });
    saveData();
    updateTotal();
    document.getElementById('clearModal').style.display = 'none';
};
