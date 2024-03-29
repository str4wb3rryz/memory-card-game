const desc = document.querySelector(".desc");
let btnStart = desc.querySelector(".start");
let gameBoard = document.querySelector(".cards-container");
let cards = [];

fetch('./cards/cards_data.json')
    .then((res) => res.json())
    .then((json) => {
        cards = [...json, ...json];
    });

btnStart.addEventListener('click', function () {
    btnStart.style.display = "none";
    createCardsAndShuffle();
});

function createCardsAndShuffle() {
    for (let i = cards.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    for (let c of cards) {
        let card = document.createElement("div");
        card.setAttribute("data-id", c.id);
        card.classList.add("card");
        card.innerHTML = `
        <div class="image">
            <img src="./${c.url}" alt="${c.name}">
        </div>
        `;
        gameBoard.appendChild(card);
    }
}

