const desc = document.querySelector(".desc");
let btnStart = desc.querySelector(".start");
let gameBoard = document.querySelector(".cards-container");
let firstCard, secondCard;
let cards = [];
let matchedPairs = 0;

async function getCards() {
    const response = await fetch('./cards/cards_data.json');
    const jsonData = await response.json();
    cards = [...jsonData, ...jsonData];
}

function hideCards() {
    setTimeout(() => {
        cards.forEach((c) => {
            let cardImg = document.querySelector(`img[src="./${c.url}"]`);
            cardImg.src = "./cards/back.png";
        });
    }, 1000);
}

function createCardsAndShuffle() {
    for (let i = cards.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    for (let c of cards) {
        let card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("data-name", c.name);
        card.setAttribute("data-id", c.id);
        card.innerHTML = `
            <div class="image">
                <img src="./${c.url}" alt="${c.name}">
            </div>
            `;
        gameBoard.appendChild(card);
        card.addEventListener('click', flipCard);
    }
}

function flipCard() {
    if (secondCard || this.classList.contains("flip")) return;
    this.classList.add("flip");
    let cardId = this.getAttribute("data-id");
    let getCard = cards.find((c) => c.id == cardId);
    let cardImg = this.querySelector("img");
    cardImg.src = `./${getCard.url}`;
    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        checkMatch();
    }
}

function checkMatch() {
    if (firstCard && secondCard) {
        if (firstCard.getAttribute("data-id") === secondCard.getAttribute("data-id")) {
            firstCard.removeEventListener('click', flipCard);
            secondCard.removeEventListener('click', flipCard);
            resetBoard();
            matchedPairs++;
        } else {
            setTimeout(() => {
                firstCard.querySelector("img").src = "./cards/back.png";
                secondCard.querySelector("img").src = "./cards/back.png";
                firstCard.classList.remove("flip");
                secondCard.classList.remove("flip");
                resetBoard();
            }, 1000);
        }
    }
}

function resetBoard() {
    firstCard = null;
    secondCard = null;
}


btnStart.addEventListener('click', function () {
    btnStart.style.display = "none";
    getCards().then(() => {
        createCardsAndShuffle();
        hideCards();
    });
});