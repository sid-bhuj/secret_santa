let participants = [];
let pairs = new Map(); // Use a Map to store persistent pairings

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

    const availableRecipients = [...participants];
    participants.forEach(giver => {
        // Filter out the giver to avoid self-assignment
        const eligibleRecipients = availableRecipients.filter(recipient => recipient !== giver);

        if (eligibleRecipients.length === 0) {
            alert("Pairing failed. Please reload and try again.");
            console.error("No eligible recipients available for:", giver);
            return;
        }

        // Randomly select a recipient
        const recipient = eligibleRecipients[Math.floor(Math.random() * eligibleRecipients.length)];

        // Assign the pair and remove the recipient from the available pool
        pairs.set(giver, recipient);
        availableRecipients.splice(availableRecipients.indexOf(recipient), 1);
    });

    console.log("Pairs generated successfully:", [...pairs.entries()]); // Debugging log
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

// Reveal the recipient for the selected participant
function revealSecretSanta() {
    const dropdown = document.getElementById("participant-dropdown");
    const selectedName = dropdown.value;

    if (!selectedName) {
        alert("Please select your name.");
        return;
    }

    console.log("Selected name:", selectedName); // Debugging log

    // Find the recipient for the selected participant
    const recipient = pairs.get(selectedName);

    if (recipient) {
        const result = document.getElementById("secret-santa-result");
        result.textContent = `🎉 You are Secret Santa for: ${recipient} 🎁`;

        console.log(`${selectedName} is Secret Santa for ${recipient}`); // Debugging log
    } else {
        alert("Error: Could not find a recipient for the selected participant.");
        console.log("No recipient found for:", selectedName); // Debugging log for missing recipient
    }
}

// Dark Mode Toggle
document.addEventListener("DOMContentLoaded", () => {
    // Enable dark mode by default
    document.body.classList.add("dark-mode");

    // Ensure the dark mode toggle reflects the default state
    const darkModeSwitch = document.getElementById("dark-mode-switch");
    darkModeSwitch.checked = true;

    // Attach event listener for the dark mode toggle
    darkModeSwitch.addEventListener("change", event => {
        console.log("Dark mode toggle:", event.target.checked); // Debug log
        document.body.classList.toggle("dark-mode", event.target.checked);
    });
});

// Attach the event listener to the reveal button
document.getElementById("reveal-btn").addEventListener("click", revealSecretSanta);
