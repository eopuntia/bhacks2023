
// initialize variables
var currencyAmount = 0;
var currencyRate = 1;


function currencyTick() {
    currencyAmount += currencyRate
    $("#currencyAmountElement").html(currencyAmount);
}

window.setInterval(function(){
    currencyTick();
},1000)

