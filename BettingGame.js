$(function() {

    //$("betButton").mouseenter(function() {
    //    $("betButton").fadeTo("slow",1);
    //});
    //
    //$("betButton").mouseleave(function() {
    //    $("betButton").fadeTo("slow",0.5);
    //});

    //  MODEL/CONSTANTS
    var INITIALMONEY = 100;
    var MINBET = 5;
    var MAXBET = 10;
    var MINGUESS = 1;
    var MAXGUESS = 10;
    var LOSSCONDITION = 0;

    var gameStore = {
        money: INITIALMONEY
    };

    function getMoney(){
        return gameStore.money;
    }

    function setMoney(value) {
        gameStore.money = value;
    }

    // FORM HELPERS
    function getBetValue(){
        return parseInt($("#betNum").val(), 10);
    }

    function getGuessValue(){
        return parseInt($("#guessNum").val(), 10);
    }

    // RENDER
    function renderAlert(message){
        $("#alerts div").text(message);
    }
    //maybe change html rendering to text rendering too to prevent bobby droptable?
    function renderCurrentMoney(money) {
        $("#currentMoney").html("<div>You currently have $" + money + "</div>");
    }

    // VALIDATORS
    function hasEnoughMoney(betNum, money){
        return (betNum <= money);
    }

    function withinBetRange(betNum) {
        return (betNum < MINBET || betNum > MAXBET);
    }

    function withinGuessRange(guess) {
        return (guess < MINGUESS || guess > MAXGUESS);
    }

    function verifyWin(guess,winningNum) {
        return (guess === winningNum);
    }

    function verifyEven(guess,winningNum) {
        return (guess === winningNum + 1 || guess === winningNum - 1);
    }

    function verifyBet(betNum) {
        var money = getMoney();
        var message;
        var validBet = false;

        if (!hasEnoughMoney(betNum, money)) {
            message = "You don't have enough money! Please bet " + money + " or lower!";
        } else if (withinBetRange(betNum)) {
            message = "Please place your bet between " + MINBET + " and " + MAXBET;
        } else {
            message = "You bet " + betNum + "dollars";
            validBet = true;
        }
        renderAlert(message);
        return validBet;
    }

    function verifyGuess(guess) {
        var message;

        if (withinGuessRange(guess)) {
            message = "Please guess a number between " + MINGUESS + " and " + MAXGUESS;
            renderAlert(message);
            return false;
        } else {
            return true;
        }
    }

    function genWinningNum() {
        return Math.floor(Math.random() * (MAXGUESS - MINGUESS + 1)) + MINGUESS;
    }

    function gameOver(money) {
        return money <= LOSSCONDITION;
    }

    function processWin(money, bet) {
        money += bet;
        var message = "You won! You gained  " + bet + " dollars and you now have " + money;
        setMoney(money);
        renderCurrentMoney(money);
        renderAlert(message);
    }

    function processEven(money, winningNum) {
        var message = "You were close! The correct number was " + winningNum + ". You didn't gain anything and you still have " + money + "dollars remaining";
        renderAlert(message);
    }

    function processLoss(money, bet, winningNum) {
        money -= bet;
        setMoney(money);
        renderCurrentMoney(money);
        var message = "Not even close! The correct number was " + winningNum + ".";
        if (gameOver(money)) {
            message += " Game Over!";
        } else {
            message += " You lost " + bet + " dollars and now have " + money + "dollars remaining.";
        }
        renderAlert(message);
    }

    function gamble(money, guess, bet) {
        var winningNum = genWinningNum();

        if (verifyWin(guess,winningNum)) {
            processWin(money,bet);
        } else if (verifyEven(guess,winningNum)) {
            processEven(money, winningNum);
        } else {
            processLoss(money,bet, winningNum);
        }
    }

    $("#betButton").on("click", function(){
        var money = getMoney();
        var bet = getBetValue();
        var guess = getGuessValue();
        renderCurrentMoney(money);

        if (verifyBet(bet) && verifyGuess(guess)){
            gamble(money,guess,bet);
        }
    });

    $("#restartButton").on("click", function() {
        setMoney(INITIALMONEY);
        renderCurrentMoney(INITIALMONEY);
        //maybe better to display current money value instead of INITIALMONEY?
        var message = "Your current balance has been reset to $" + INITIALMONEY;
        renderAlert(message);
    });

});
