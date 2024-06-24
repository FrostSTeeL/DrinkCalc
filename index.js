var beerAmount = document.getElementById("beerAmount");
var ginAmount = document.getElementById("ginAmount");
var shotAmount = document.getElementById("shotAmount");
var waterAmount = document.getElementById("waterAmount");
var nutsAmount = document.getElementById("nutsAmount");
var picklesAmount = document.getElementById("picklesAmount");

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
        shotAmount.textContent = localStorage.getItem("shotAmount")
        waterAmount.textContent = localStorage.getItem("waterAmount")
        nutsAmount.textContent = localStorage.getItem("nutsAmount")
        picklesAmount.textContent = localStorage.getItem("picklesAmount")
    } else {
        localStorage.setItem("beerAmount", "0");
        localStorage.setItem("ginAmount", "0")
        localStorage.setItem("shotAmount", "0")
        localStorage.setItem("waterAmount", "0")
        localStorage.setItem("nutsAmount", "0")
        localStorage.setItem("piclesAmount", "0")
    }
}

function ClearStorage() {
    localStorage.clear();
    location.reload();
}



