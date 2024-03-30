const desc = document.querySelector(".desc");
let btnStart = desc.querySelector(".start");
let gameBoard = document.querySelector(".cards-container");
let firstCard, secondCard;
let cards = [];
let matchedPairs = 0;

let score = 0;
let gameEnded = false;

let startingMinutes = 1;
let startingSeconds = startingMinutes * 60 + 30;
let time = document.querySelector(".time");

async function getCards() {
    const response = await fetch('./cards/cards_data.json');
    const jsonData = await response.json();
    cards = [...jsonData, ...jsonData];
}

function startTimer() {
    setInterval(() => {
        startingSeconds--;
        let minutes = Math.floor(startingSeconds / 60);
        let seconds = startingSeconds % 60;
        time.innerHTML = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        if (startingSeconds == 0) {
            clearInterval();
            if (!gameEnded) {
                gameEnded = true;
                alert("Time's up!");
                location.reload();
            }
        }
        if (matchedPairs == cards.length / 2) {
            clearInterval();
            if (!gameEnded) {
                gameEnded = true;
                let timeLeft = time.innerHTML.split(":");
                let minutes = parseInt(timeLeft[0]);
                let seconds = parseInt(timeLeft[1]);
                let timeLeftInSeconds = minutes * 60 + seconds;
                score += timeLeftInSeconds / 10;
                alert("You won! Your score is " + score + "!");
                location.reload();
            }
        }
    }, 1000);
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
            <div class="front">
                <div class="front-image">
                    <img src="./${c.url}" alt="${c.name}">
                </div>
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
    setTimeout(() => {
        cardImg.src = `./${getCard.url}`;
    }, 150);
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
            score += 5;
            console.log(score);
        } else {
            setTimeout(() => {
                firstCard.classList.remove("flip");
                secondCard.classList.remove("flip");
                setTimeout(() => {
                    firstCard.querySelector("img").src = "./cards/back.png";
                    secondCard.querySelector("img").src = "./cards/back.png";
                    resetBoard();
                    score -= 1;
                    console.log(score);
                }, 150);
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
        startTimer();
    });
});