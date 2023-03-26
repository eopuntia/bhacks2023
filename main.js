
let currencyAmount = 0;
let currencyRate = 1;

function currencyTick() {
    currencyAmount += currencyRate;
    $("#currencyAmountElement").html(currencyAmount);
}

window.setInterval(function(){
    ideologyTick();
},1000)
