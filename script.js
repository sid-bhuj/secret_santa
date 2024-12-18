let participants = [];
let pairs = [];

// Add a participant
function addParticipant() {
    const nameInput = document.getElementById("name");
    const name = nameInput.value.trim();
    if (name && !participants.includes(name)) {
        participants.push(name);
        displayParticipants();
        updateDropdown();
        nameInput.value = '';
    }
}

// Display the list of participants
function displayParticipants() {
    const participantList = document.getElementById("participants");
    participantList.innerHTML = '';
    participants.forEach(participant => {
        const li = document.createElement("li");
        li.textContent = participant;
        participantList.appendChild(li);
    });
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
}

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

// Reveal Secret Santa for the selected participant
function revealSecretSanta() {
    if (pairs.length === 0) {
        generatePairs();
    }

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
    }
}
