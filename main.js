
const tickTime = 300; // in milliseconds.

// initialize ideology
var ideologyAmount = 0;
var ideologyRate = 1;

// initialize generators
var zines = 0;
var zinesBought = 0;
const zinesBasePrice = 10;
const zinesCoefficient = 1.07;

var bricks = 0;
var bricksBasePrice = 40;

var activists = 0;
var activistsBasePrice = 10;

var riots = 0;
var riotsBasePrice = 10;

/*
    Input: The player's current generators and upgrades.
    Output: The amount to increase the player's ideology each tick.
*/
window.ideologyRate = function ideologyRate() {
    let amount = 1;
    amount += zines;
    amount += bricks*2;
    return amount;
}

/*
    Input: None.
    Output: The player's ideology incrementing by an appropriate amount for a single tick.
*/
function ideologyTick() {
    updateIdeology(ideologyRate())
}

/*
    Setter function for ideology. All changes to ideology should be done through this function.

    Input: An amount to increase the player's ideology.
    Output: The player's ideology changing by an appropriate amount, and HTML being updated.
*/
function updateIdeology(n) {
    ideologyAmount += n;
    $("#ideologyAmountElement").html(ideologyAmount);
}

// increment generators
function zinesTick() {
    zines += activists;
    $("#zinesAmountElement").html(zines);
}
function bricksTick() {
    bricks += riots;
    $("#bricksAmountElement").html(bricks);
}

/*
    Input: The base price of a zine, the coefficient for zines, and the number of zines bought.
    Output: The current price of a zine.
*/
function zinesPrice(){
    let amount = zinesBasePrice;
    amount *= zinesCoefficient**zinesBought;
    return Math.round(amount);
}

/*
    Input: None.
    Output: If the player has the appropriate amount of ideology, they buy a zine.
*/
function zinesBuy() {
    let lockedPrice = zinesPrice(); // Ensure the price for calculations doesn't change in the middle of processing.

    if(lockedPrice <= ideologyAmount) {
        updateZines(1,true)
        updateIdeology(-1*lockedPrice)
    }
}

/*
    Setter function for zines. All changes to a player's number of zines should be done through this function.

    Input: An amount to increase the player's zines, and whether the zines were bought (true) or generated (false).
    Output: The player's ideology changing by an appropriate amount, and HTML being updated.
*/
function updateZines(n,bought) {
    zines += n;
    if(bought){
        zinesBought += n;
    }
    $("#zinesAmountElement").html(zines);
    $("#zinesBoughtElement").html(zinesBought);
}

/*
    Input: None.
    Output: If the player has the appropriate amount of ideology, they buy a brick.
*/
function bricksBuy() {
    if(bricksPrice <= ideologyAmount) {
        bricks++;
        updateIdeology(-1*bricksPrice)
        $("#bricksAmountElement").html(bricks);
    }
}

/*
    Input: All DOM elements of the page being loaded.
    Output: Appropriate listeners being added to all buttons on the page.
*/
$(document).ready(function() {
    $("#buyZineButton").click(function(){zinesBuy()});
    $("#buyBrickButton").click(function(){bricksBuy()});
});

/*
    Input: How long a tick is.
    Output: All tick functions being called during each tick.
*/
window.setInterval(function(){
    ideologyTick();
    zinesTick();
    bricksTick();
},tickTime)

