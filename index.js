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
    // Sıralama sistemini şimdilik kapattık, ama fonksiyon aşağıda duruyor
    // restoreOrder(); 
    
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
   2. HESAPLAMA MANTIĞI
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
   3. SÜRÜKLE-BIRAK SİSTEMİ (ŞU AN PASİF)
   ========================================= 
   NOT: Kaydırma (scroll) sorunu yaşamaman için 
   event listener'lar devre dışı bırakıldı.
   Açmak istersen yorum satırlarını kaldırabilirsin.
*/

const mainContainer = document.getElementById('mainContainer');
let draggingElement = null;

// SÜRÜKLEME FONKSİYONLARI (Kullanıma Hazır)
function saveOrder() {
    const items = [...document.querySelectorAll('.itemContainer')];
    const orderIds = items.map(item => item.querySelector('.amount').id);
    localStorage.setItem('drinkOrder', JSON.stringify(orderIds));
}

function restoreOrder() {
    const savedOrder = JSON.parse(localStorage.getItem('drinkOrder'));
    if (!savedOrder) return;
    const clearBtn = document.getElementById('clearButton');
    savedOrder.forEach(id => {
        const amountEl = document.getElementById(id);
        if (amountEl) {
            const container = amountEl.closest('.itemContainer');
            mainContainer.insertBefore(container, clearBtn);
        }
    });
}

const getDragAfterElement = (container, y) => {
    const draggableElements = [...container.querySelectorAll('.itemContainer:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
        else return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
};

/* --- Event Listenerlar (PASİFİZE EDİLDİ) ---
mainContainer.addEventListener('dragstart', (e) => {
    draggingElement = e.target.closest('.itemContainer');
    draggingElement.classList.add('dragging');
});

mainContainer.addEventListener('dragend', () => {
    if (draggingElement) {
        draggingElement.classList.remove('dragging');
        draggingElement = null;
        saveOrder();
    }
});

mainContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(mainContainer, e.clientY);
    const limit = document.getElementById('clearButton');
    if (afterElement == null) mainContainer.insertBefore(draggingElement, limit);
    else if (afterElement !== limit) mainContainer.insertBefore(draggingElement, afterElement);
});
-------------------------------------------- */

/* =========================================
   4. TEMA VE MODAL KONTROLLERİ
   ========================================= */
document.getElementById('themeToggle').onclick = () => {
    document.body.classList.toggle('cyberpunk');
};

document.getElementById('clearButton').onclick = () => {
    document.getElementById('clearModal').style.display = 'block';
};

document.getElementById('cancelClear').onclick = () => {
    document.getElementById('clearModal').style.display = 'none';
};

document.getElementById('confirmClear').onclick = () => {
    Object.keys(counts).forEach(id => {
        counts[id] = 0;
        const el = document.getElementById(id);
        if(el) {
            el.innerText = '0';
            el.classList.remove('active-count');
        }
    });
    saveData();
    updateTotal();
    document.getElementById('clearModal').style.display = 'none';
};
