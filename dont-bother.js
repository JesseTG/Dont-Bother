document.body.style.border = "5px solid blue";

// Select the node that will be observed for mutations
let timeline = window.document.getElementById("stream-items-id");

timeline.style.outline = "5px solid pink";

function getUsersAddedToTimeline(mutationsList) {
    // TODO: Switch to Map<id, screenName>
    let names = new Set();
    for (let mutation of mutationsList) {
        for (let node of mutation.addedNodes) {
            let tweet = node.getElementsByClassName("tweet")[0]; // ASSUME: Just one of these in a tweet DOM
            const dataset = tweet.dataset;

            if (dataset.screenName !== undefined) {
                names.add(dataset.screenName);
            }

            if (dataset.retweeter !== undefined) {
                names.add(dataset.retweeter);
            }
        }
    }

    return names;
}

// Create an observer instance linked to the callback function
let observer = new MutationObserver(function (mutationsList) {
    let names = getUsersAddedToTimeline(mutationsList);

    console.log(names);
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

