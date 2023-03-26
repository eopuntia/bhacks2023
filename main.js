
// initialize currency
var currencyAmount = 0;
var currencyRate = 1;

// increment currency
function currencyTick() {
    currencyAmount += currencyRate
    $("#currencyAmountElement").html(currencyAmount);
}

// initialize generators
var zines = 0;
var zines.price = 10;
var bricks = 0;
var bricks.price = 10;
var activists = 0;
var activists.price = 10;
var riots = 0;
var riots.price = 10;

// increment generators
function zinesTick() {
    zines += activists;
    $("#zinesAmountElement").html(zines);
}
function bricksTick() {
    bricks += riots;
    $("#bricksAmountElement").html(bricks);
}

// buy generators
function zinesBuy() {
    if(zines.price <= currencyAmount) {
        zines++;
        $("#zinesAmountElement").html(zines);
    }
}
function bricksBuy() {
    if(bricks.price <= currencyAmount) {
        bricks++;
        $("#bricksAmountElement").html(bricks);
    }
}


// increment time
window.setInterval(function(){
    currencyTick();
    zinesTick();
    bricksTick();
},1000)

