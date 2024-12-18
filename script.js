let participants = [];

function addParticipant() {
    const nameInput = document.getElementById("name");
    const name = nameInput.value.trim();
    if (name && !participants.includes(name)) {
        participants.push(name);
        displayParticipants();
        nameInput.value = '';
    }
}

function displayParticipants() {
    const participantList = document.getElementById("participants");
    participantList.innerHTML = '';
    participants.forEach(participant => {
        const li = document.createElement("li");
        li.textContent = participant;
        participantList.appendChild(li);
    });
}

function generatePairs() {
    if (participants.length < 2) {
        alert("At least two participants are required.");
        return;
    }

    const givers = [...participants];
    const receivers = [...participants];
    let pairs = [];

    do {
        pairs = [];
        const shuffled = receivers.sort(() => Math.random() - 0.5);
        for (let i = 0; i < givers.length; i++) {
            if (givers[i] !== shuffled[i]) {
                pairs.push([givers[i], shuffled[i]]);
            }
        }
    } while (pairs.length !== givers.length);

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "<h2>Secret Santa Pairings</h2>";
    pairs.forEach(pair => {
        const p = document.createElement("p");
        p.textContent = `${pair[0]} -> ${pair[1]}`;
        resultsDiv.appendChild(p);
    });
}
