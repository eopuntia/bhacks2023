
let currencyAmount = 0;

function currencyTick() {
    currencyAmount++;
    $("#currencyAmountElement").html(currencyAmount);
}

window.setInterval(function(){
    ideologyTick();
},1000)
