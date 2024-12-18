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

    const givers = [...participants];
    const receivers = [...participants];

    do {
        pairs = [];
        const shuffled = receivers.sort(() => Math.random() - 0.5);
        for (let i = 0; i < givers.length; i++) {
            if (givers[i] !== shuffled[i]) {
                pairs.push({ giver: givers[i], receiver: shuffled[i] });
            }
        }
    } while (pairs.length !== givers.length);
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

// Reveal the Secret Santa for the selected participant
function revealSecretSanta() {
    const dropdown = document.getElementById("participant-dropdown");
    const selectedName = dropdown.value;

    if (!selectedName) {
        alert("Please select your name.");
        return;
    }

    const pair = pairs.find(p => p.giver === selectedName);
    if (pair) {
        const result = document.getElementById("secret-santa-result");
        result.textContent = `🎉 Your Secret Santa is: ${pair.receiver} 🎁`;

        // Disable the dropdown and button after revealing
        dropdown.disabled = true;
        document.querySelector("button[onclick='revealSecretSanta()']").disabled = true;

        // Optional: Clear result after a timeout for privacy
        setTimeout(() => {
            result.textContent = '';
        }, 10000);
    }
}
