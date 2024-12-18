let participants = [];
let pairs = [];
let firstSelection = null; // Store the participant's first selection

// Load participants from a JSON file
fetch('./participants.json') // Ensure './' if in the same directory
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        participants = data.participants;
        updateDropdown();
    })
    .catch(error => console.error('Error loading participants:', error));


// Generate Secret Santa pairs
function generatePairs() {
    if (participants.length < 2) {
        alert("At least two participants are required.");
        return;
    }

    const givers = [...participants]; // Copy of participants
    const receivers = [...participants]; // Copy of participants

    pairs = []; // Clear any existing pairs

    // Shuffle the receivers list to create random matches
    do {
        const shuffledReceivers = receivers.sort(() => Math.random() - 0.5);
        pairs = givers.map((giver, index) => {
            return { giver: giver, receiver: shuffledReceivers[index] };
        });
    } while (pairs.some(pair => pair.giver === pair.receiver)); // Ensure no one is their own Secret Santa
}


// Update the dropdown with participant names
function updateDropdown() {
    const dropdown = document.getElementById("participant-dropdown");
    dropdown.innerHTML = '<option value="" disabled selected>Select your name</option>';
    participants.forEach(participant => {
        const option = document.createElement("option");
        option.value = participant;
        option.textContent = participant;
        dropdown.appendChild(option);
    });

    // Add an event listener to track the first selection
    dropdown.addEventListener("change", (event) => {
        handleSelection(event.target.value);
    });
}

// Handle dropdown selection to prevent cheating
function handleSelection(selectedName) {
    const dropdown = document.getElementById("participant-dropdown");

    if (firstSelection === null) {
        // Store the first valid selection
        firstSelection = selectedName;
    } else if (selectedName !== firstSelection) {
        // Revert to the first selection and show "No cheating!" message
        dropdown.value = firstSelection;
        alert("No cheating!");
    }
}

function revealSecretSanta() {
    const dropdown = document.getElementById("participant-dropdown");
    const selectedName = dropdown.value;

    if (!selectedName) {
        alert("Please select your name.");
        return;
    }

    // Find the pair for the selected participant
    const pair = pairs.find(p => p.giver === selectedName);

    if (pair) {
        const result = document.getElementById("secret-santa-result");
        result.textContent = `🎉 Your Secret Santa is: ${pair.receiver} 🎁`;

        // Optional: Disable dropdown and button after revealing
        dropdown.disabled = true;
        document.querySelector("button[onclick='revealSecretSanta()']").disabled = true;

        // Optional: Clear the result after a timeout
        setTimeout(() => {
            result.textContent = '';
        }, 10000);
    } else {
        alert("Error: Could not find a Secret Santa for the selected participant.");
    }
}

