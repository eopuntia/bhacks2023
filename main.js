/*
          _______  _______ _________ _______  ______   _        _______  _______
|\     /|(  ___  )(  ____ )\__   __/(  ___  )(  ___ \ ( \      (  ____ \(  ____ \
| )   ( || (   ) || (    )|   ) (   | (   ) || (   ) )| (      | (    \/| (    \/
| |   | || (___) || (____)|   | |   | (___) || (__/ / | |      | (__    | (_____
( (   ) )|  ___  ||     __)   | |   |  ___  ||  __ (  | |      |  __)   (_____  )
 \ \_/ / | (   ) || (\ (      | |   | (   ) || (  \ \ | |      | (            ) |
  \   /  | )   ( || ) \ \_____) (___| )   ( || )___) )| (____/\| (____/\/\____) |
   \_/   |/     \||/   \__/\_______/|/     \||/ \___/ (_______/(_______/\_______)
*/

const tickTime = 300; // in milliseconds.

// initialize ideology
var ideologyAmount = 0;
var ideologyRate = 1;
var bestIdeologyAmount = 0;

// initialize generators
var zines = 0;
var zinesBought = 0;
const zinesBasePrice = 10;
const zinesCoefficient = 1.15;

var bricks = 0;
var bricksBought = 0;
const bricksBasePrice = 50;
const bricksCoefficient = 1.14;

var activists = 0;
var activistsBasePrice = 10;

var riots = 0;
var riotsHosted = 0;
const riotsBricksBasePrice = 10;
const riotsProtestBasePrice = 10;
var figureheads = 0;

// upgrade booleans
var upgWeLiveInASociety = false;

/*
_________ ______   _______  _______  _        _______  _______
\__   __/(  __  \ (  ____ \(  ___  )( \      (  ___  )(  ____ \|\     /|
   ) (   | (  \  )| (    \/| (   ) || (      | (   ) || (    \/( \   / )
   | |   | |   ) || (__    | |   | || |      | |   | || |       \ (_) /
   | |   | |   | ||  __)   | |   | || |      | |   | || | ____   \   /
   | |   | |   ) || (      | |   | || |      | |   | || | \_  )   ) (
___) (___| (__/  )| (____/\| (___) || (____/\| (___) || (___) |   | |
\_______/(______/ (_______/(_______)(_______/(_______)(_______)   \_/
*/

/*
    Input: The player's current generators and upgrades.
    Output: The amount to increase the player's ideology each tick.
*/
window.ideologyRate = function ideologyRate() {
    let amount = societalIdeologyRate();
    amount += zinesIdeologyRate();
    amount += bricksIdeologyRate();
    return amount;
}

function societalIdeologyRate() {
    let amount = 1;
    for (const i of upgrades) {
        if(i.type == "base" && i.bought == true){
            amount = i.effect(amount);
        }
    }
    return amount;
}

/*
    Input: Ideology per second from various generators.
    Output: A concatenated string containing information on how ideology is generated.
*/
function ideologyRateTooltip() {
    let tooltip = societalIdeologyRate() + " from Societal Unrest.";
    tooltip += "\n" + zinesIdeologyRate() + " from Zines.";
    tooltip += "\n" + bricksIdeologyRate() + " from Bricks.";
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
    if(ideologyAmount > bestIdeologyAmount){
        bestIdeologyAmount = ideologyAmount;
    }
    $("#ideologyAmountElement").html(ideologyAmount.toLocaleString("en-us"));
}

/*
  _____    _____    _____
 / ___ \  / ___ \  / ___ \
( (   ) )( (   ) )( (   ) )
 \/  / /  \/  / /  \/  / /
    ( (      ( (      ( (
    | |      | |      | |
    (_)      (_)      (_)
     _        _        _
    (_)      (_)      (_)
*/

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
 _______ _________ _        _______  _______
/ ___   )\__   __/( (    /|(  ____ \(  ____ \
\/   )  |   ) (   |  \  ( || (    \/| (    \/
    /   )   | |   |   \ | || (__    | (_____
   /   /    | |   | (\ \) ||  __)   (_____  )
  /   /     | |   | | \   || (            ) |
 /   (_/\___) (___| )  \  || (____/\/\____) |
(_______/\_______/|/    )_)(_______/\_______)
*/

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
    for (const i of upgrades) {
            if(i.type == "zine" && i.bought == true){
                amount = i.effect(amount);
            }
        }
    return amount;
}

/*
 ______   _______ _________ _______  _        _______
(  ___ \ (  ____ )\__   __/(  ____ \| \    /\(  ____ \
| (   ) )| (    )|   ) (   | (    \/|  \  / /| (    \/
| (__/ / | (____)|   | |   | |      |  (_/ / | (_____
|  __ (  |     __)   | |   | |      |   _ (  (_____  )
| (  \ \ | (\ (      | |   | |      |  ( \ \       ) |
| )___) )| ) \ \_____) (___| (____/\|  /  \ \/\____) |
|/ \___/ |/   \__/\_______/(_______/|_/    \/\_______)
*/

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
    Input: None
    Output: If the player has the appropriate amount of protests and bricks, they host a riot
*/
function riotBuy() {
    if(bricks >= riotsBricksPrice && protests >= riotsProtestPrice) {
        ideologyReset();
        zineReset();
        brickReset();
        activistReset();

        figureheads += figureheads*(riotsHosted + 1);
    }
}

/* 
    Input: None
    Output: Resets ideology
*/
function ideologyReset() {
    ideologyAmount = 0;
    ideologyRate = 1;
}

/* 
    Input: None
    Output: Resets zines
*/
function zineReset() {
    zines = 0;
    zinesBought = 0;
}

/* 
    Input: None
    Output: Resets bricks
*/
function brickReset() {
    bricks = 0;
    bricksBought = 0;
}

/* 
    Input: None
    Output: Resets activists
*/
function brickReset() {
    activists = 0;
    activistsBought = 0;            // lmao buying activists
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
    for (const i of upgrades) {
            if(i.type == "brick" && i.bought == true){
                amount = i.effect(amount);
            }
        }
    return amount;
}

/*
          _______  _______  _______  _______  ______   _______  _______
|\     /|(  ____ )(  ____ \(  ____ )(  ___  )(  __  \ (  ____ \(  ____ \
| )   ( || (    )|| (    \/| (    )|| (   ) || (  \  )| (    \/| (    \/
| |   | || (____)|| |      | (____)|| (___) || |   ) || (__    | (_____
| |   | ||  _____)| | ____ |     __)|  ___  || |   | ||  __)   (_____  )
| |   | || (      | | \_  )| (\ (   | (   ) || |   ) || (            ) |
| (___) || )      | (___) || ) \ \__| )   ( || (__/  )| (____/\/\____) |
(_______)|/       (_______)|/   \__/|/     \|(______/ (_______/\_______)
*/

var upgrades = [];

class Upgrade {
  constructor(name, description, price, minimum, type, effect) {
    this.name = name;
    this.description = description
    this.price = price;
    this.minimum = minimum;
    this.type = type;
    this.effect = effect;
    this.bought = false;
  }

  buy() {
        if(this.price <= ideologyAmount) {
                this.bought = true;
                updateIdeology(-1*this.price);
            }
  }
}

upgrades.push(new Upgrade("We Live in a Society","Gives 9 more Ideology per second from Societal Unrest.",100,30,"base",function(n){return n+9}));

function refreshTable(){
    for (let index = 0; index < upgrades.length; ++index) {
        $('<button/>', {
                    text: upgrades[i].name
                    id: 'btn_'+i,
                    click: function () { upgrades[i].buy(); }
                });
    }
}

/*
 _______           _
(  ____ )|\     /|( (    /|
| (    )|| )   ( ||  \  ( |
| (____)|| |   | ||   \ | |
|     __)| |   | || (\ \) |
| (\ (   | |   | || | \   |
| ) \ \__| (___) || )  \  |
|/   \__/(_______)|/    )_)
*/

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

