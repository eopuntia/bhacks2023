
// initialize variables
var currencyAmount = 0;
var currencyRate = 1;
var ideologyAmount = 0;
var ideologyTick = 1;


function currencyTick() {
    currencyAmount += currencyRate;
    $("#currencyAmountElement").html(currencyAmount);
}

window.setInterval(function(){
    ideologyTick();
},1000)
