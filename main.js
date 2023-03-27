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

const tickTime = 500; // in milliseconds.

// initialize ideology
var ideologyAmount = 0;
var bestIdeologyAmount = 0;
var ideologyCarryover = 0;
const ideologyWin = 1000000;

// initialize generators
var zines = 0;
var zinesBought = 0;
const zinesBasePrice = 10;
const zinesCoefficient = 1.16;

var bricks = 0;
var bricksBought = 0;
const bricksBasePrice = 150;
const bricksCoefficient = 1.12;

var activists = 0;
var activistsBought = 0;
const activistsBasePrice = 10000;
const activistsCoefficient = 1.24;

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
    updateIdeology(ideologyRate());
}

/*
    Setter function for ideology. All changes to ideology should be done through this function.

    Input: An amount to increase the player's ideology.
    Output: The player's ideology changing by an appropriate amount, and HTML being updated.
*/
function updateIdeology(n) {
    let increaseAmount = ideologyCarryover + n;
    ideologyCarryover = increaseAmount - Math.floor(increaseAmount);
    ideologyAmount += Math.floor(increaseAmount);
    if(ideologyAmount > bestIdeologyAmount){
        bestIdeologyAmount = ideologyAmount;
    }
    $("#ideologyAmountElement").html(ideologyAmount.toLocaleString("en-us"));
    $("#ideologyAmountElement").attr("title", "Highest Banked Ideology: " + bestIdeologyAmount.toLocaleString("en-us"));
}

/*
 _______  _______  _        _______  _______  _______ __________________ _______  _
(  ____ \(  ____ \( (    /|(  ____ \(  ____ )(  ___  )\__   __/\__   __/(  ___  )( (    /|
| (    \/| (    \/|  \  ( || (    \/| (    )|| (   ) |   ) (      ) (   | (   ) ||  \  ( |
| |      | (__    |   \ | || (__    | (____)|| (___) |   | |      | |   | |   | ||   \ | |
| | ____ |  __)   | (\ \) ||  __)   |     __)|  ___  |   | |      | |   | |   | || (\ \) |
| | \_  )| (      | | \   || (      | (\ (   | (   ) |   | |      | |   | |   | || | \   |
| (___) || (____/\| )  \  || (____/\| ) \ \__| )   ( |   | |   ___) (___| (___) || )  \  |
(_______)(_______/|/    )_)(_______/|/   \__/|/     \|   )_(   \_______/(_______)|/    )_)
*/

function zinesTick() {
    zines += activists;
    $("#zinesAmountElement").html(zines.toLocaleString("en-us"));
    ideologyRateDisplay();
}
function bricksTick() {
    bricks += riots;
    $("#bricksAmountElement").html(bricks.toLocaleString("en-us"));
    ideologyRateDisplay();
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
    amount = 0.1*zines;
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
    Input: The total number of bricks.
    Output: How much all bricks contribute to ideology per second in aggregate.
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
 _______  _______ __________________         _________ _______ _________ _______
(  ___  )(  ____ \\__   __/\__   __/|\     /|\__   __/(  ____ \\__   __/(  ____ \
| (   ) || (    \/   ) (      ) (   | )   ( |   ) (   | (    \/   ) (   | (    \/
| (___) || |         | |      | |   | |   | |   | |   | (_____    | |   | (_____
|  ___  || |         | |      | |   ( (   ) )   | |   (_____  )   | |   (_____  )
| (   ) || |         | |      | |    \ \_/ /    | |         ) |   | |         ) |
| )   ( || (____/\   | |   ___) (___  \   /  ___) (___/\____) |   | |   /\____) |
|/     \|(_______/   )_(   \_______/   \_/   \_______/\_______)   )_(   \_______)
*/

/*
    Input: The base price of an activist, the coefficient for activists, and the number of activists bought.
    Output: The current price of an activist.
*/
function activistsPrice(){
    let amount = activistsBasePrice;
    amount *= activistsCoefficient**activistsBought;
    return Math.round(amount);
}

/*
    Input: None.
    Output: If the player has the appropriate amount of ideology, they buy an activist.
*/
function activistsBuy() {
    let lockedPrice = activistsPrice(); // Ensure the price for calculations doesn't change in the middle of processing.

    if(lockedPrice <= ideologyAmount) {
        updateActivists(1,true)
        updateIdeology(-1*lockedPrice)
        $("#buyActivistButtonPrice").html(activistsPrice().toLocaleString("en-us"));
    }
}

/*
    Setter function for activists. All changes to a player's number of activists should be done through this function.

    Input: An amount to increase the player's activists, and whether the activists were bought (true) or generated (false).
    Output: The player's activists changing by an appropriate amount, and HTML being updated.
*/
function updateActivists(n,bought) {
    activists += n;
    if(bought){
        activistsBought += n;
    }
    $("#activistsAmountElement").html(activists.toLocaleString("en-us"));
    ideologyRateDisplay();
}

/*
 _______ _________ _______ _________ _______
(  ____ )\__   __/(  ___  )\__   __/(  ____ \
| (    )|   ) (   | (   ) |   ) (   | (    \/
| (____)|   | |   | |   | |   | |   | (_____
|     __)   | |   | |   | |   | |   (_____  )
| (\ (      | |   | |   | |   | |         ) |
| ) \ \_____) (___| (___) |   | |   /\____) |
|/   \__/\_______/(_______)   )_(   \_______)
/*

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
    this.description = "Cost: " + price.toLocaleString("en-us") + " Ideology. " + description
    this.price = price;
    this.minimum = minimum;
    this.type = type;
    this.effect = effect;
    this.bought = false;
    this.visible = false;
    }

    buy(i) {
        if(this.price <= ideologyAmount) {
            this.bought = true;
            updateIdeology(-1*this.price);
            ideologyRateDisplay();
            ideologyRateTooltip();
            $("#btn_" + i).remove();
        }
    }
}

upgrades.push(new Upgrade("We Live in a Society","Gain 2 more Ideology per second from Societal Unrest.",200,100,"base",function(n){return n+2}));
upgrades.push(new Upgrade("Rise Up","Gain 3 more Ideology per second from Societal Unrest.",600,300,"base",function(n){return n+3}));
upgrades.push(new Upgrade("Vive la Révolution","Gain 4 more Ideology per second from Societal Unrest.",2000,1000,"base",function(n){return n+4}));

upgrades.push(new Upgrade("Secure Bindings","+20% Ideology from Zines.",15,15,"zine",function(n){return n*1.2}));
upgrades.push(new Upgrade("Glossy Colors","+20% Ideology from Zines.",30,25,"zine",function(n){return n*1.2}));
upgrades.push(new Upgrade("Stain-Resistant Ink","+20% Ideology from Zines.",100,50,"zine",function(n){return n*1.2}));
upgrades.push(new Upgrade("Advanced Graphic Design","+20% Ideology from Zines.",800,120,"zine",function(n){return n*1.2}));
upgrades.push(new Upgrade("Local Distributors","+25% Ideology from Zines.",6400,1000,"zine",function(n){return n*1.25}));

upgrades.push(new Upgrade("Impassioned Authorship","+100% Ideology from Zines while setting a new record for banked Ideology.",2000,2000,"zine",function(n){return ideologyAmount == bestIdeologyAmount ? n*2 : n}));
upgrades.push(new Upgrade("Peaceful Politics","+100% Ideology from Zines while you have more Zines than Bricks.",2000,2000,"zine",function(n){return zines > bricks ? n*2 : n}));
upgrades.push(new Upgrade("Will of the People","+100% Ideology from Zines while you have an even number of Zines.",2000,2000,"zine",function(n){return zines%2 == 0 ? n*2 : n}));

upgrades.push(new Upgrade("Political Strategy","+100% Ideology from Zines while you have more Zines than Ideology.",20000,20000,"zine",function(n){return zines > ideologyAmount ? n*2 : n}));
upgrades.push(new Upgrade("Unyielding Determination","+100% Ideology from Zines while the number of Zines you have ends in 0.",20000,20000,"zine",function(n){return zines%10 == 0 ? n*2 : n}));

upgrades.push(new Upgrade("Bigger Bricks","+30% Ideology from Bricks.",1000,600,"brick",function(n){return n*1.3}));
upgrades.push(new Upgrade("Throwing Arm","+30% Ideology from Bricks.",3000,900,"brick",function(n){return n*1.3}));
upgrades.push(new Upgrade("Local Manufacturers","+35% Ideology from Bricks.",6000,4000,"brick",function(n){return n*1.35}));
upgrades.push(new Upgrade("Targeted Protest","+30% Ideology from Bricks.",9000,5000,"brick",function(n){return n*1.3}));
upgrades.push(new Upgrade("Even Bigger Bricks","+30% Ideology from Bricks.",12000,8000,"brick",function(n){return n*1.3}));

upgrades.push(new Upgrade("Trained Writers","+1% Ideology from Zines for each Activist.",20000,10000,"zine",function(n){return n*(1+activists*0.01)}));
upgrades.push(new Upgrade("Trained Protestors","+1% Ideology from Bricks for each Activist.",30000,15000,"brick",function(n){return n*(1+activists*0.01)}));

upgrades.push(new Upgrade("Cross-Promotion","+1% Ideology from Zines for each Zine.",10000,10000,"zine",function(n){return n*(1+zines*0.01)}));

upgrades.push(new Upgrade("Publicization","+1% Ideology from Zines for each Brick.",40000,40000,"zine",function(n){return n*(1+bricks*0.01)}));
upgrades.push(new Upgrade("Enraged Radicalization","+1% Ideology from Bricks for each Zine.",40000,40000,"brick",function(n){return n*(1+zines*0.01)}));

function refreshTable(){
    for (let i = 0; i < upgrades.length; ++i) {
        if(upgrades[i].minimum < bestIdeologyAmount && upgrades[i].bought == false && upgrades[i].visible == false){
            upgrades[i].visible = true;
            $('<button/>', {
                text: upgrades[i].name,
                id: 'btn_'+i,
                title: upgrades[i].description,
                click: function () { upgrades[i].buy(i); }
                }).appendTo("#upgradeSection");
            $("#upgradeSection").show()
        }
    }
    if ($("#upgradeSection").is(":empty")){
      $("#upgradeSection").hide()
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
    $("#buyActivistButton").click(function(){activistsBuy()});
    ideologyRateDisplay();
    refreshTable();
    $(document).tooltip({show: {delay: 150}})
    $("#endgame").hide();
    $("#upgradeSection").hide()
});

/*
    Input: How long a tick is.
    Output: All tick functions being called during each tick.
*/
window.setInterval(function(){
    ideologyTick();
    zinesTick();
    bricksTick();
    refreshTable();
    checkWin();
},tickTime)

/*  
 _______  _        ______     _______  _______  _______  _______ 
(  ____ \( (    /|(  __  \   (  ____ \(  ___  )(       )(  ____ \
| (    \/|  \  ( || (  \  )  | (    \/| (   ) || () () || (    \/
| (__    |   \ | || |   ) |  | |      | (___) || || || || (__    
|  __)   | (\ \) || |   | |  | | ____ |  ___  || |(_)| ||  __)   
| (      | | \   || |   ) |  | | \_  )| (   ) || |   | || (      
| (____/\| )  \  || (__/  )  | (___) || )   ( || )   ( || (____/\
(_______/|/    )_)(______/   (_______)|/     \||/     \|(_______/
                                                    
*/

function checkWin(){
    if(ideologyAmount >= ideologyWin) {
        $("#game").fadeOut(2000, "linear", function() {
            $("#endgame").fadeIn(2000, "linear");
        });
        //$.when(myEvent()).done($("#endgame").fadeIn(3000, "linear"));
        //$("#endgame").fadeIn(3000, "linear");
        
    }
}
