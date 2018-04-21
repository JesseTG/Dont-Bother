"use strict";

document.body.style.border = "5px solid blue";

// Select the node that will be observed for mutations
let timeline = window.document.getElementById("stream-items-id");

timeline.style.outline = "5px solid pink";

function getMutatedNodes(mutationsList) {
    let nodes = [];
    for (let mutation of mutationsList) {
        Array.prototype.push.apply(nodes, mutation.addedNodes);
    }

    return nodes;
}

function getTweets(nodes) {
    let tweets = [];
    for (let node of nodes) {
        tweets.push(node.getElementsByClassName("tweet")[0]); // Assume just one of these in a tweet DOM
    }

    return tweets;
}

function getUsersAddedToTimeline(tweets) {
    let ids = new Set();
    for (let tweet of tweets) {
        const dataset = tweet.dataset;

        if (dataset.userId !== undefined) {
            ids.add(dataset.userId);
        }
    }

    return ids;
}

let guesses = new Map();

function updateBotGuesses(ids) {
    for (let id of ids) {
        if (!guesses.has(id)) {
            guesses.set(id, Math.random());
        }
        // TODO: Actual server requests
    }
}

function applyBotGuesses(tweets) {
    for (let tweet of tweets) {
        const dataset = tweet.dataset;
        const userId = dataset.userId;
        const guess = guesses.get(userId);

        if (guess > 0.75) {
            console.log("%s (id %s) might be a bot!", dataset.screenName, userId);

            tweet.classList.add("bot");
        }
    }
    // input: map of guess objects to classes
    // does: change the css style selector
}

// Create an observer instance linked to the callback function
let observer = new MutationObserver(function (mutationsList) {
    console.groupCollapsed();
    let nodes = getMutatedNodes(mutationsList);
    console.log(nodes);

    let tweets = getTweets(nodes);
    console.log(tweets);

    let ids = getUsersAddedToTimeline(tweets);
    console.log(ids);

    updateBotGuesses(ids);

    applyBotGuesses(tweets);
    console.groupEnd();
});

// Start observing the target node for configured mutations
observer.observe(timeline, {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: false,
    attributeOldValue: false,
    characterDataOldValue: false
});

console.log("Observing");

