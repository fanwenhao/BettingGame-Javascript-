$(function() {

    //$("betButton").mouseenter(function() {
    //    $("betButton").fadeTo("slow",1);
    //});
    //
    //$("betButton").mouseleave(function() {
    //    $("betButton").fadeTo("slow",0.5);
    //});

    //MODEL
    var gameStore = {
        money: 100
    };

    function getMoney(){
        return gameStore.money;
    }

    function setMoney(value) {
        gameStore.money = value;
    }


    var initialMoney = 100;
    //var currentMoney = initialMoney;
    var minBet = 5;
    var maxBet = 10;
    var minGuess = 1;
    var maxGuess = 10;
    //var userBet = $("#betNum");
    //var userGuess = $("#guessNum");



    // FORM HELPERS
    function getBetValue(){
        return parseInt($("#betNum").val());
    }

    function getGuessValue(){
        return parseInt($("#guessNum").val());
    }

    // RENDER
    function renderAlert(message){
        $("#alerts").html("<div>"+ message + "</div>");
    }

    function renderCurrentMoney(money) {
        $("#currentMoney").html("<div>You currently have $" + money + "</div>");
    }

    // VALIDATORS
    function hasEnoughMoney(betNum, money){
        return (betNum <= money);
    }

    function withinBetRange(betNum){
        return (betNum < minBet || betNum > maxBet);
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

        if (!hasEnoughMoney(betNum, money)) {
            message = "You don't have enough money! Please bet " + money + " or lower!";
            renderAlert(message);
            return false;
        } else if (withinBetRange(betNum)) {
            message = "Please place your bet between " + minBet + " and " + maxBet;
            renderAlert(message);
            return false;
        } else {
            message = "You bet " + betNum + "dollars";
        }
        renderAlert(message);
        return true;
    }

    function verifyGuess(guess) {
        var message;

        if (guess < minGuess || guess > maxGuess) {
            message = "Please guess a number between " + minGuess + " and " + maxGuess;
            renderAlert(message);
            return false;
        } else {
            return true;
        }
    }

    function genWinningNum() {
        return Math.floor(Math.random() * (maxGuess - minGuess + 1)) + minGuess;
    }

    function gamble(money, guess, bet) {
        var winningNum = genWinningNum();
        var message;

        if (verifyWin(guess,winningNum)) {
            money += bet;
            message = "You won! You gained  " + bet + " dollars and you now have " + money;
            setMoney(money);
            renderCurrentMoney(money);
            renderAlert(message);
        } else if (verifyEven(guess,winningNum)) {
            message = "You were close! The correct number was " + winningNum + ". You didn't gain anything and you still have " + money + "dollars remaining";
            renderAlert(message);
        } else {
            money -= bet;
            setMoney(money);
            renderCurrentMoney(money);
            if (money <= 0) {
                message = "Not even close! The correct number was " + winningNum + ". Game Over!";
                renderAlert(message);
            } else {
                message = "Not even close! The correct number was " + winningNum + ". You lost " + bet + " dollars and now have " + money + "dollars remaining.";
                renderAlert(message);
            }
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
//TODO encapsulate the initial money
    $("#restartButton").on("click", function() {
        setMoney(initialMoney);
        var message = "Your current balance has been reset to $" + initialMoney;
        renderAlert(message);
    });

});
