var beerAmount = document.getElementById("beerAmount");
var ginAmount = document.getElementById("ginAmount");
var cocktailAmount = document.getElementById("cocktailAmount");
var shotAmount = document.getElementById("shotAmount");
var waterAmount = document.getElementById("waterAmount");
var nutsAmount = document.getElementById("nutsAmount");
var pCornAmount = document.getElementById("pCornAmount");
var picklesAmount = document.getElementById("picklesAmount");
var foodAmount = document.getElementById("foodAmount");
var friesAmount = document.getElementById("friesAmount");

const canVibrate = window.navigator.vibrate;

function appendToDrink(drinkName) {
    var newNum = parseInt(drinkName.textContent) + 1;
    drinkName.textContent = newNum;
    localStorage.setItem(drinkName.id, newNum);
}

function deductFromDrink(drinkName) {
    if (parseInt(drinkName.textContent) > 0) {
        var newNum = parseInt(drinkName.textContent) - 1;
        drinkName.textContent = newNum;
        localStorage.setItem(drinkName.id, newNum);
    } else {
        drinkName.textContent = 0;
    }
}

function StartFunc() {
    if (localStorage.getItem("beerAmount") != null) {
        beerAmount.textContent = localStorage.getItem("beerAmount")
        ginAmount.textContent = localStorage.getItem("ginAmount")
        cocktailAmount.textContent = localStorage.getItem("cocktailAmount")
        shotAmount.textContent = localStorage.getItem("shotAmount")
        waterAmount.textContent = localStorage.getItem("waterAmount")
        nutsAmount.textContent = localStorage.getItem("nutsAmount")
        pCornAmount.textContent = localStorage.getItem("pCornAmount")
        picklesAmount.textContent = localStorage.getItem("picklesAmount")
        foodAmount.textContent = localStorage.getItem("foodAmount")
        friesAmount.textContent = localStorage.getItem("friesAmount")
    } else {
        localStorage.setItem("beerAmount", "0");
        localStorage.setItem("ginAmount", "0");
        localStorage.setItem("cocktailAmount", "0");
        localStorage.setItem("shotAmount", "0");
        localStorage.setItem("waterAmount", "0");
        localStorage.setItem("nutsAmount", "0");
        localStorage.setItem("pCornAmount", "0");
        localStorage.setItem("picklesAmount", "0");
        localStorage.setItem("foodAmount", "0");
        localStorage.setItem("friesAmount", "0");
        location.reload();
    }
}

function ClearStorage() {
// 1. Memorize the current theme
    const currentTheme = localStorage.getItem('theme');
    
    // 2. Clear everything (resets drink counts)
    localStorage.clear();
    
    // 3. Put the theme back immediately!
    if (currentTheme) {
        localStorage.setItem('theme', currentTheme);
    }
    
    // 4. Reload the page (or whatever your code currently does to reset the UI)
    location.reload();
}

const themeToggle = document.getElementById('themeToggle');

// Check if the user already chose Cyberpunk in a previous visit
if (localStorage.getItem('theme') === 'cyberpunk') {
    document.body.classList.add('cyberpunk');
    themeToggle.innerText = 'SWITCH TO CLASSIC MODE';
} else {
    // Set default text for classic mode
    themeToggle.innerText = 'SWITCH TO CYBERPUNK MODE';
}

// Listen for the button click
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('cyberpunk');
    
    // Update the button text and save to localStorage
    if (document.body.classList.contains('cyberpunk')) {
        themeToggle.innerText = 'SWITCH TO CLASSIC MODE';
        localStorage.setItem('theme', 'cyberpunk');
    } else {
        themeToggle.innerText = 'SWITCH TO CYBERPUNK MODE';
        localStorage.setItem('theme', 'classic');
    }
});

// This observer handles the color switching automatically
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        const el = mutation.target;
        const count = parseInt(el.textContent);
        
        if (count > 0) {
            el.classList.add('active-count');
        } else {
            el.classList.remove('active-count');
        }
    });
});

// Start watching every drink/food amount
document.querySelectorAll('.amount').forEach((amountEl) => {
    // Run once on load to catch existing numbers from localStorage
    if (parseInt(amountEl.textContent) > 0) amountEl.classList.add('active-count');
    
    // Watch for future changes
    observer.observe(amountEl, { childList: true });
});
