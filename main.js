
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
var bricksBought = 0;
const bricksBasePrice = 50;
const bricksCoefficient = 1.14;

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
    amount += zinesIdeologyRate();
    amount += bricksIdeologyRate();
    return amount;
}

/*
    Input: Ideology per second from various generators.
    Output: A concatenated string containing information on how ideology is generated.
*/
function ideologyRateTooltip() {
    let tooltip = "1 from Societal Unrest.";
    tooltip += ("\n" + zinesIdeologyRate() + " from Zines.");
    tooltip += ("\n" + bricksIdeologyRate() + " from Bricks.");
    return tooltip;
}

/*
    Input: The current ideology per second, and a tooltip containing information on how ideology is generated.
    Output: Appropriately updated HTML.
*/
function ideologyRateDisplay() {
    $("#ideologyRateElement").html(ideologyRate());
    $("#ideologyRateElement").attr("title", ideologyRateTooltip());
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
    $("#ideologyAmountElement").html(ideologyAmount.toLocaleString("en-us"));
}

// increment generators
function zinesTick() {
    zines += activists;
    $("#zinesAmountElement").html(zines.toLocaleString("en-us"));
}
function bricksTick() {
    bricks += riots;
    $("#bricksAmountElement").html(bricks.toLocaleString("en-us"));
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
        $("#buyZineButtonPrice").html(zinesPrice().toLocaleString("en-us"));
    }
}

/*
    Setter function for zines. All changes to a player's number of zines should be done through this function.

    Input: An amount to increase the player's zines, and whether the zines were bought (true) or generated (false).
    Output: The player's zines changing by an appropriate amount, and HTML being updated.
*/
function updateZines(n,bought) {
    zines += n;
    if(bought){
        zinesBought += n;
    }
    $("#zinesAmountElement").html(zines.toLocaleString("en-us"));
    $("#zinesBoughtElement").html(zinesBought.toLocaleString("en-us"));
    ideologyRateDisplay();
}

/*
    Input: The total number of zines.
    Output: How much all zines contribute to ideology per second in aggregate.
*/
function zinesIdeologyRate() {
    amount = 1*zines;
    return amount;
}

/*
    Input: The base price of a brick, the coefficient for bricks, and the number of bricks bought.
    Output: The current price of a brick.
*/
function bricksPrice(){
    let amount = bricksBasePrice;
    amount *= bricksCoefficient**bricksBought;
    return Math.round(amount);
}

/*
    Input: None.
    Output: If the player has the appropriate amount of ideology, they buy a brick.
*/
function bricksBuy() {
    let lockedPrice = bricksPrice(); // Ensure the price for calculations doesn't change in the middle of processing.

    if(lockedPrice <= ideologyAmount) {
        updateBricks(1,true)
        updateIdeology(-1*lockedPrice)
        $("#buyBrickButtonPrice").html(bricksPrice().toLocaleString("en-us"));
    }
}

/*
    Setter function for bricks. All changes to a player's number of bricks should be done through this function.

    Input: An amount to increase the player's bricks, and whether the bricks were bought (true) or generated (false).
    Output: The player's bricks changing by an appropriate amount, and HTML being updated.
*/
function updateBricks(n,bought) {
    bricks += n;
    if(bought){
        bricksBought += n;
    }
    $("#bricksAmountElement").html(bricks.toLocaleString("en-us"));
    $("#bricksBoughtElement").html(bricksBought.toLocaleString("en-us"));
    ideologyRateDisplay();
}

/*
    Input: The total number of zines.
    Output: How much all zines contribute to ideology per second in aggregate.
*/
function bricksIdeologyRate() {
    amount = 4*bricks;
    return amount;
}

/*
    Input: All DOM elements of the page being loaded.
    Output: Appropriate listeners being added to all buttons on the page.
*/
$(document).ready(function() {
    $("#buyZineButton").click(function(){zinesBuy()});
    $("#buyBrickButton").click(function(){bricksBuy()});
    ideologyRateDisplay();
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

