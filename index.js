/* =========================================
   1. DİL VE ÇEVİRİ AYARLARI
   ========================================= */
const translations = {
    tr: {
        total: "TOPLAM", editPrices: "FİYATLARI DÜZENLE", clearList: "LİSTEYİ TEMİZLE",
        switchTheme: "TEMAYI DEĞİŞTİR", modalTitle: "BİRİM FİYATLAR (₺)", saveClose: "KAYDET VE KAPAT",
        confirmTitle: "EMİN MİSİNİZ?", confirmDesc: "Tüm liste ve tutar sıfırlanacak.",
        confirmYes: "EVET, SIFIRLA", confirmNo: "İPTAL",
        items: { beer: "BİRA", gin: "CİN", cocktail: "KOKTEYL", shot: "SHOT", water: "SU", nuts: "ÇEREZ", pCorn: "PATLAMIŞ MISIR", pickles: "TURŞU", food: "YEMEK", fries: "PATATES" }
    },
    en: {
        total: "TOTAL", editPrices: "EDIT PRICES", clearList: "CLEAR LIST",
        switchTheme: "SWITCH THEME", modalTitle: "UNIT PRICES (₺)", saveClose: "SAVE & CLOSE",
        confirmTitle: "ARE YOU SURE?", confirmDesc: "All records and total will be reset.",
        confirmYes: "YES, RESET", confirmNo: "CANCEL",
        items: { beer: "BEER", gin: "GIN", cocktail: "COCKTAIL", shot: "SHOT", water: "WATER", nuts: "NUTS", pCorn: "POPCORN", pickles: "PICKLES", food: "FOOD", fries: "FRIES" }
    }
};

const userLang = navigator.language.startsWith('tr') ? 'tr' : 'en';
const lang = translations[userLang];

/* =========================================
   2. VERİ YÖNETİMİ
   ========================================= */
const itemIds = ["beerAmount", "ginAmount", "cocktailAmount", "shotAmount", "waterAmount", "nutsAmount", "pCornAmount", "picklesAmount", "foodAmount", "friesAmount"];
const defaultPrices = { beerAmount: 150, ginAmount: 350, cocktailAmount: 400, shotAmount: 100, waterAmount: 40, nutsAmount: 60, pCornAmount: 80, picklesAmount: 50, foodAmount: 450, friesAmount: 150 };

let itemPrices = JSON.parse(localStorage.getItem('itemPrices')) || defaultPrices;

function appendToDrink(el) {
    let n = (parseInt(el.textContent) || 0) + 1;
    el.textContent = n;
    localStorage.setItem(el.id, n);
}

function deductFromDrink(el) {
    let n = parseInt(el.textContent) || 0;
    if (n > 0) {
        n--;
        el.textContent = n;
        localStorage.setItem(el.id, n);
    }
}

function calculateTotal() {
    let total = 0;
    itemIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) total += (parseInt(el.textContent) || 0) * (itemPrices[id] || 0);
    });
    const display = document.getElementById("totalPrice");
    if (display) {
        const formatter = new Intl.NumberFormat(userLang === 'tr' ? 'tr-TR' : 'en-US', {
            style: 'currency', currency: 'TRY', minimumFractionDigits: 2
        });
        display.textContent = formatter.format(total).replace("TRY", "₺");
    }
}

/* =========================================
   3. ARAYÜZ VE MODAL KONTROLÜ
   ========================================= */
function applyTranslations() {
    document.querySelector('.total-label').textContent = lang.total;
    document.getElementById('openSettings').textContent = lang.editPrices;
    document.getElementById('clearButton').textContent = lang.clearList;
    document.getElementById('closeSettings').textContent = lang.saveClose;
    document.getElementById('clearTitle').textContent = lang.confirmTitle;
    document.getElementById('clearText').textContent = lang.confirmDesc;
    document.getElementById('confirmClear').textContent = lang.confirmYes;
    document.getElementById('cancelClear').textContent = lang.confirmNo;
    document.querySelector('#settingsModal h3').textContent = lang.modalTitle;

    Object.keys(lang.items).forEach(key => {
        const el = document.getElementById(key + "Name");
        if (el) el.textContent = lang.items[key];
    });
}

function setupPriceInputs() {
    const grid = document.getElementById('settingsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    itemIds.forEach(id => {
        const labelKey = id.replace('Amount', '');
        const div = document.createElement('div');
        div.className = "price-item";
        div.innerHTML = `<label>${lang.items[labelKey] || labelKey}</label>
                         <input type="number" value="${itemPrices[id]}" onchange="updatePrice('${id}', this.value)">`;
        grid.appendChild(div);
    });
}

function updatePrice(id, val) {
    itemPrices[id] = parseFloat(val) || 0;
    localStorage.setItem('itemPrices', JSON.stringify(itemPrices));
    calculateTotal();
}

/* =========================================
   4. BAŞLATICI
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {
    applyTranslations();

    // Kayıtlı miktarları yükle
    itemIds.forEach(id => {
        const el = document.getElementById(id);
        const saved = localStorage.getItem(id);
        if (el) el.textContent = saved !== null ? saved : "0";
    });

    if (localStorage.getItem('theme') === 'cyberpunk') document.body.classList.add('cyberpunk');

    const themeToggle = document.getElementById('themeToggle');
    themeToggle.textContent = lang.switchTheme;
    themeToggle.onclick = () => {
        document.body.classList.toggle('cyberpunk');
        localStorage.setItem('theme', document.body.classList.contains('cyberpunk') ? 'cyberpunk' : 'classic');
    };

    // Modallar
    const priceModal = document.getElementById("settingsModal");
    const clearModal = document.getElementById("clearModal");

    document.getElementById("openSettings").onclick = () => { setupPriceInputs(); priceModal.style.display = "block"; };
    document.getElementById("closeSettings").onclick = () => priceModal.style.display = "none";
    
    document.getElementById("clearButton").onclick = () => clearModal.style.display = "block";
    document.getElementById("cancelClear").onclick = () => clearModal.style.display = "none";
    
    document.getElementById("confirmClear").onclick = () => {
        itemIds.forEach(id => { 
            const el = document.getElementById(id); 
            if(el) { el.textContent = "0"; localStorage.setItem(id, "0"); }
        });
        calculateTotal();
        clearModal.style.display = "none";
    };

    // Sayı değiştiğinde toplamı otomatik hesapla ve rengi ayarla
    const obs = new MutationObserver((mutations) => {
        mutations.forEach(m => {
            const count = parseInt(m.target.textContent) || 0;
            if (count > 0) m.target.classList.add('active-count');
            else m.target.classList.remove('active-count');
            calculateTotal();
        });
    });

    document.querySelectorAll('.amount').forEach(el => {
        obs.observe(el, { childList: true });
        // İlk yükleme rengi
        if (parseInt(el.textContent) > 0) el.classList.add('active-count');
    });

    calculateTotal();
});
