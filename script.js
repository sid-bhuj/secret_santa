let participants = [];
let pairs = [];
let firstSelection = null; // Store the participant's first selection

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
        updateDropdown(); // Populate dropdown with participant names
        generatePairs(); // Generate Secret Santa pairs
    })
    .catch(error => {
        console.error('Error loading participants:', error);
        alert("Failed to load participants. Please check the participants.json file.");
    });

// Generate Secret Santa pairs
function generatePairs() {
    if (participants.length < 2) {
        alert("At least two participants are required.");
        return;
    }

    const shuffledReceivers = [...participants];
    let attempts = 0;
    const maxAttempts = 100;

    // Try generating pairs until valid or max attempts reached
    do {
        attempts++;
        shuffledReceivers.sort(() => Math.random() - 0.5);
    } while (
        attempts < maxAttempts &&
        participants.some((giver, index) => giver === shuffledReceivers[index])
    );

    if (attempts >= maxAttempts) {
        alert("Failed to generate valid pairs after multiple attempts. Try again.");
        return;
    }

    // Map participants to their Secret Santa pair
    pairs = participants.map((giver, index) => {
        return { giver, receiver: shuffledReceivers[index] };
    });
}

// Update the dropdown with participant names
function updateDropdown() {
    const dropdown = document.getElementById("participant-dropdown");
    dropdown.innerHTML = '<option
