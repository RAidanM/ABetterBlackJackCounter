//BLACKJACK VALUES
const shoe_decks = 3;


const shoe = {
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    'T': 0,
    'A': 0,
    'cards_left': 0
};

function resetDeck(decks) {
    for(let i = 2; i<10; i++){
        shoe[i] = decks * 4;
    }
    shoe['T'] = decks * 16;
    shoe['A'] = decks * 4;
    shoe['cards_left'] = 52 *decks;
}

function updateDisplay() {
    document.getElementById("output").textContent = JSON.stringify(shoe);
}

//int[] int[] inputs
function simulate(playerHand, dealerHand){
    const shoe_copy = structuredClone(shoe);
    let player_count = 0;
    let dealer_count = 0;
    for(const p of playerHand){
        if (p === 'T'){
            player_count+=10
        }
        else if (char === 'A'){
            simulate()
            player_count+=10
            
        }
    }

//repeat ALOT
    //grab random queue of cards equal to 60
    //give cards to player (with correct logic) until stand, bj, or bust
        //if stand, have dealer play until decision
    //give result: win, lose, push

}









document.querySelectorAll('button[data-counter]').forEach(button => {
    button.addEventListener('click', () => {
        if(button.dataset.counter != '?'){
            shoe[button.dataset.counter]--;
        }
        shoe['cards_left']--;
        updateDisplay();
    })
});







resetDeck(shoe_decks);
updateDisplay();