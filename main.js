
// initialize ideology
var ideologyAmount = 0;
var ideologyRate = 1;

// increment ideology

window.ideologyRate = function ideologyRate() {
    let amount = 1;
    amount += zines;
    amount += bricks*2;
    return amount;
}

function ideologyTick() {
    updateIdeology(ideologyRate())
}

function updateIdeology(n) {
    ideologyAmount += n;
    $("#ideologyAmountElement").html(ideologyAmount);
}

// initialize generators
var zines = 0;
var zinesPrice = 10;
var bricks = 0;
var bricksPrice = 40;
var activists = 0;
var activistsPrice = 10;
var riots = 0;
var riotsPrice = 10;

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
    if(zinesPrice <= ideologyAmount) {
        zines++;
        updateIdeology(-1*zinesPrice)
        $("#zinesAmountElement").html(zines);
    }
}
function bricksBuy() {
    if(bricksPrice <= ideologyAmount) {
        bricks++;
        updateIdeology(-1*bricksPrice)
        $("#bricksAmountElement").html(bricks);
    }
}

// button listeners
$(document).ready(function() {
    $("#buyZineButton").click(function(){zinesBuy()});
    $("#buyBrickButton").click(function(){bricksBuy()});
});

// increment time
window.setInterval(function(){
    ideologyTick();
    zinesTick();
    bricksTick();
},1000)

