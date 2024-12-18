let participants = [];
let pairs = new Map(); // Use a Map to store and persist pairings

// Load participants from a JSON file
fetch('./participants.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        participants = data.participants;
        updateDropdown();
        generatePairs();
        console.log("Generated pairs:", [...pairs.entries()]); // Debugging log to verify pairs
    })
    .catch(error => {
        console.error('Error loading participants:', error);
        document.getElementById("error-message").textContent = "Failed to load participants. Please check the participants.json file.";
        document.getElementById("error-message").style.display = "block";
    });

// Generate unique Secret Santa pairs
function generatePairs() {
    if (participants.length < 2) {
        alert("At least two participants are required.");
        return;
    }

    const shuffledReceivers = [...participants];
    let attempts = 0;
    const maxAttempts = 100;

    // Retry until valid pairs are created
    do {
        attempts++;
        shuffledReceivers.sort(() => Math.random() - 0.5);
    } while (
        attempts < maxAttempts &&
        participants.some((giver, index) => giver ==
