//BLACKJACK VALUES
const shoe_decks = 3;
const total_simulations = 10000000;

class Deck {
    wholeDecks
    cards_taken = 0
    cards_remaining = 0
    shoe = {
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
    }

    constructor(whoelDecks){
        this.wholeDecks = whoelDecks;
        this.resetDeck();
    }

    clone(){
        const clone = new Deck(this.wholeDecks);
        clone.shoe = structuredClone(this.shoe);
        clone.cards_taken = this.cards_taken;
        clone.cards_remaining = this.cards_remaining;
        return clone;
    }
    
    resetDeck() {
        for(let i = 2; i<10; i++){
            this.shoe[i] = this.wholeDecks * 4;
        }
        this.shoe[10] = this.wholeDecks * 16;
        this.shoe[11] = this.wholeDecks * 4;
        this.cards_remaining = 52 * this.wholeDecks;
        this.cards_taken = 0;
    }

    removeCard(cardValue){
        if(cardValue!=='?') { 
            this.shoe[cardValue]--;
           // console.log("Card removed: "+cardValue); 
        }
        this.cards_remaining--;
        this.cards_taken++;
    }

    removeRandomCard(){
        const card_list = Object.values(this.shoe);
        let randomCardIndex = Math.floor( Math.random()*this.cards_remaining )+1;
        
        for( let i in card_list){
            randomCardIndex -= card_list[i];
            if(randomCardIndex<=0){
                i-='0'-2;
                this.removeCard(i);
                return i;
            }
        }
    }






}

function updateDisplay() {
    document.getElementById("output").textContent = JSON.stringify(maindeck);
}

function formatCard(card){
    if (card==='T'){ return 10; }
    else if (card==='A'){ return 11; }
    return card;
}

function formatHand(hand){
    for (const h in hand){
        if (hand[h]==='T'){ hand[h] = 10; }
        else if (hand[h]==='A'){ hand[h] = 11; }
    }
    return hand;
}

//int[] int[] inputs A->11 until bust then into 1
function simulate(playerHand, dealerHand, simulations){
    const copied_deck = maindeck.clone();

    let player_count = 0;
    let dealer_count = 0;
    for(const p of playerHand){
        copied_deck.removeCard(p);
        player_count+=(p - '0');
    }
    for(const d of dealerHand){
        copied_deck.removeCard(d);
        dealer_count+=(d - '0');
    }

    //HIT EV

    let total_value_hit = 0;
    for(let i=0; i < (simulations/2); i++){
        const simulation_deck = copied_deck.clone();
        let simu_player_count = player_count;
        let simu_dealer_count = dealer_count;
        const simu_playerHand = structuredClone(playerHand);
        const simu_dealerHand = structuredClone(dealerHand);

        let end_sim = false;

        //player
        let hit = true;
        while(!end_sim && hit){
            const pulled_card = simulation_deck.removeRandomCard();
            simu_playerHand[simu_playerHand.length]= pulled_card;
            simu_player_count+=simu_playerHand[simu_playerHand.length-1];

            if(simu_player_count>21){
                if(simu_playerHand.indexOf(11)!==-1){
                    simu_playerHand[simu_playerHand.indexOf(11)]=1;
                    simu_player_count-=10;
                }
                else {
                    //console.log("Player Bust");
                    total_value_hit += -1;
                    end_sim=true;
                }
            }
            else if(simu_player_count===21){
                //console.log("Player Blackjack!");
                total_value_hit += 1.5;
                end_sim=true;
            }
            else if(simu_player_count<21){
                if( Math.floor(Math.random()*2) === 0 ){
                    hit = false;
                }
            }
            else { console.log("something went very wrong"); end_sim=true;}
        }

        // //dealer
        while(!end_sim){
            simu_dealerHand[simu_dealerHand.length]=simulation_deck.removeRandomCard();
            simu_dealer_count+=simu_dealerHand[simu_dealerHand.length-1];

            if(simu_dealer_count>21){
                if(simu_dealerHand.indexOf(11)!==-1){
                    simu_dealerHand[simu_dealerHand.indexOf(11)]=1;
                    simu_dealer_count-=10;
                }
                else {
                    //console.log("Dealer busts");
                    total_value_hit += 1;
                    end_sim=true;
                }
            }
            else if(simu_dealer_count === 21){
                //console.log("Dealer Blackjack");
                total_value_hit += -1;
                end_sim=true;
            }
            else if(simu_dealer_count>=17){
                if(simu_dealer_count===simu_player_count){
                    //console.log("Push");
                    total_value_hit += 0;
                    end_sim=true;
                }
                else if(simu_dealer_count<simu_player_count){
                    //console.log("Player beats Dealer");
                    total_value_hit += 1;
                    end_sim=true;
                }
                else if(simu_dealer_count>simu_player_count){
                    //console.log("Dealer beats Player");
                    total_value_hit += -1;
                    end_sim=true;
                }
            }
        }
    }

    const hit_ev = total_value_hit / (simulations/2);

    //STAND EV

    let total_value_stand = 0;
    for(let i=0; i < (simulations/2); i++){
        const simulation_deck = copied_deck.clone();
        let simu_player_count = player_count;
        let simu_dealer_count = dealer_count;
        const simu_dealerHand = structuredClone(dealerHand);

        let end_sim = false;

        //dealer
        while(!end_sim){
            simu_dealerHand[simu_dealerHand.length]=simulation_deck.removeRandomCard();
            simu_dealer_count+=simu_dealerHand[simu_dealerHand.length-1];

            if(simu_dealer_count>21){
                if(simu_dealerHand.indexOf(11)!==-1){
                    simu_dealerHand[simu_dealerHand.indexOf(11)]=1;
                    simu_dealer_count-=10;
                }
                else {
                    //console.log("Dealer busts");
                    total_value_stand += 1;
                    end_sim=true;
                }
            }
            else if(simu_dealer_count === 21){
                //console.log("Dealer Blackjack");
                total_value_stand += -1;
                end_sim=true;
            }
            else if(simu_dealer_count>=17){
                if(simu_dealer_count===simu_player_count){
                    //console.log("Push");
                    total_value_stand += 0;
                    end_sim=true;
                }
                else if(simu_dealer_count<simu_player_count){
                    //console.log("Player beats Dealer");
                    total_value_stand += 1;
                    end_sim=true;
                }
                else if(simu_dealer_count>simu_player_count){
                    //console.log("Dealer beats Player");
                    total_value_stand += -1;
                    end_sim=true;
                }
            }
        }
    }

    const stand_ev = total_value_stand / (simulations/2);

    
    console.log("Stand EV: "+stand_ev);
    console.log("Hit EV: "+hit_ev);


}



document.getElementById('simulate').addEventListener('click', () => {
    const playerHand = document.getElementById('playerHand').value;
    const dealerHand = document.getElementById('dealerHand').value;

    simulate(
        formatHand(playerHand.split('')),
        formatHand(dealerHand.split('')),
        total_simulations
    );

});




document.querySelectorAll('button[data-counter]').forEach(button => {
    button.addEventListener('click', () => {
        maindeck.removeCard(formatCard(button.dataset.counter))
        console.log("Removed from button");
        updateDisplay();
    })
});


const maindeck = new Deck(3);
updateDisplay();