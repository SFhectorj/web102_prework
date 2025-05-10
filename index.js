/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import games from './games.js';
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for (let i = 0; i < games.length; i ++){

        const game = games[i]

        // create a new div element, which will become the game card
        const gameCard = document.createElement('div')

        // add the class game-card to the list
        gameCard.classList.add('game-card');

        // set the inner HTML using a template literal to display some info 
        // about each game
        gameCard.innerHTML = ` 
        <img src = "${game.img}" alt="Cover art for ${game.name}" class="game-img"/>
        <h3> ${game.name} </h3>
        <p><strong>Description:</strong> ${game.description || 'No description available.'}</p>
        <p><strong>Platform:</strong> ${game.platform || 'N/A'}</p>
        <p><strong>Release Year:</strong> ${game.release_year || 'N/A'}</p>
        `

        // append the game to the games-container
        gamesContainer.appendChild(gameCard)
    }

}

// call the function we just defined using the correct variable
addGamesToPage(GAMES_JSON)

// later, we'll call this function using a different list of games


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((accumulator, game) => {
    return accumulator + game.backers;
}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `${totalContributions.toLocaleString()}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const totalAmountRaised = GAMES_JSON.reduce((accumulator, game) => {
    return accumulator + game.pledged;
}, 0);
// set inner HTML using template literal
raisedCard.innerHTML = `$${totalAmountRaised.toLocaleString()}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");

const totalNumberOfGames = GAMES_JSON.length;

// set its inner HTML using a template literal
gamesCard.innerHTML = `${totalNumberOfGames}`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let gamesNotMetGoal = GAMES_JSON.filter ((game => {
        return game.pledged < game.goal;
    }));

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(gamesNotMetGoal);

}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    const gamesMetGoal = GAMES_JSON.filter(game => {
        return game.pledged >= game.goal;
    });

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(gamesMetGoal)
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON)

}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener('click', filterUnfundedOnly);
fundedBtn.addEventListener('click', filterFundedOnly);
allBtn.addEventListener('click', showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const totalAmountRaisedForSummary = GAMES_JSON.reduce((accumulator, game) => {
    return accumulator + game.pledged;
}, 0);

const totalNumberOfGamesForSummary = GAMES_JSON.length;

const unfundedGamesList = GAMES_JSON.filter(game => {
    return game.pledged < game.goal;
});

const numberOfUnfundedGames = unfundedGamesList.length;

// create a string that explains the number of unfunded games using the ternary operator
let fundingStatusString = "";

if (totalNumberOfGamesForSummary > 0) {
    fundingStatusString = (numberOfUnfundedGames === 0) ? "All games are currently funded!": `Right now, ${numberOfUnfundedGames} game${numberOfUnfundedGames === 1 ? "" : "s"} still need${numberOfUnfundedGames === 1 ? "s" : ""} your support to reach ${numberOfUnfundedGames === 1 ? "its" : "their"} funding goal${numberOfUnfundedGames === 1 ? "" : "s"}. Join us in bringing these visions to life!`;
} else {
    fundingStatusString = "We're seeking new game projects to fund, stay tuned!";
}

const companySummaryString = `To date, Sea Monster Crowdfunding has helped raise \$${totalAmountRaisedForSummary.toLocaleString()} for ${totalNumberOfGamesForSummary} amazing independent games. ${fundingStatusString}`;

// create a new DOM element containing the template string and append it to the description container
const additionalInfoParagraph = document.createElement("p");

additionalInfoParagraph.textContent = companySummaryString;

descriptionContainer.appendChild(additionalInfoParagraph);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [topGame, runnerUpGame, ...otherGames] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
if (topGame) {
    const topGameInfoElement = document.createElement("p");
    topGameInfoElement.textContent = `${topGame.name} - \$${topGame.pledged.toLocaleString()}`;
    firstGameContainer.appendChild(topGameInfoElement);
} else {
    const noGamesMessage = document.createElement("p");
    noGamesMessage.textContent = "No game data available.";
    firstGameContainer.appendChild(noGamesMessage);
}

// do the same for the runner up item
if (runnerUpGame) {
    const runnerUpGameInfoElement = document.createElement("p");

    runnerUpGameInfoElement.textContent = `${runnerUpGame.name} - \$${runnerUpGame.pledged.toLocaleString()}`;
    secondGameContainer.appendChild(runnerUpGameInfoElement);
} else if (topGame) {
    const noRunnerUpMessage = document.createElement("p");
    noRunnerUpMessage.textContent = "Only one game funded.";
    secondGameContainer.appendChild(noRunnerUpMessage);
}