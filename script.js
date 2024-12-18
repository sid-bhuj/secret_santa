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
        updateDropdown();
        generatePairs();
        console.log("Generated pairs:", pairs); // Debugging log to verify pairs
    })
    .catch(error => {
        console.error('Error loading participants:', error);
        document.getElementById("error-message").textContent = "Failed to load participants. Please check the participants.json file.";
        document.getElementById("error-message").style.display = "block";
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

    pairs = participants.map((giver, index) => {
        return { giver, receiver: shuffledReceivers[index] };
    });

    console.log("Pairs generated successfully:", pairs); // Debugging log
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
    console.log("Dropdown populated with participants:", participants); // Debugging log
}

// Handle dropdown selection to prevent cheating
function handleSelection(selectedName) {
    const dropdown = document.getElementById("participant-dropdown");

    if (firstSelection === null) {
        firstSelection = selectedName;
    } else if (selectedName !== firstSelection) {
        dropdown.value = firstSelection;
        alert("No cheating!");
    }
}

// Reveal the Secret Santa for the selected participant
function revealSecretSanta() {
    if (pairs.length === 0) {
        alert("Secret Santa pairs are missing. Regenerating...");
        generatePairs();
    }

    const dropdown = document.getElementById("participant-dropdown");
    const selectedName = dropdown.value;

    if (!selectedName) {
        alert("Please select your name.");
        return;
    }

    console.log("Selected name:", selectedName); // Debugging log to verify selection

    const pair = pairs.find(p => p.giver === selectedName);

    if (pair) {
        const result = document.getElementById("secret-santa-result");
        result.textContent = `🎉 Your Secret Santa is: ${pair.receiver} 🎁`;

        dropdown.disabled = true;
        document.getElementById("reveal-btn").disabled = true;

        console.log("Secret Santa revealed:", pair.receiver); // Debugging log to verify receiver
    } else {
        alert("Error: Could not find a Secret Santa for the selected participant.");
        console.log("No pair found for:", selectedName); // Debugging log for missing pair
    }
}

// Dark Mode Toggle
document.getElementById("dark-mode-switch").addEventListener("change", event => {
    console.log("Dark mode toggle:", event.target.checked); // Debug log
    const elementsToToggle = document.querySelectorAll("button, select");
    
    document.body.classList.toggle("dark-mode", event.target.checked);
    elementsToToggle.forEach(el => el.classList.toggle("dark-mode", event.target.checked));
});

// Attach the event listener to the reveal button
document.getElementById("reveal-btn").addEventListener("click", revealSecretSanta);
