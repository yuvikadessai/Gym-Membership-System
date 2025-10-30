// Sample member data
const members = [
  {
    id: 1,
    name: "Rohan Sharma",
    gender: "Male",
    plan: "Gold",
    duration: "6 Months",
    paymentStatus: "Paid",
    trainer: "Rahul Singh"
  },
  {
    id: 2,
    name: "Priya Mehta",
    gender: "Female",
    plan: "Silver",
    duration: "3 Months",
    paymentStatus: "Pending",
    trainer: "Sneha Kapoor"
  },
  {
    id: 3,
    name: "Amit Verma",
    gender: "Male",
    plan: "Gold",
    duration: "1 Year",
    paymentStatus: "Paid",
    trainer: "Karan Mehra"
  },
  {
    id: 4,
    name: "Neha Patil",
    gender: "Female",
    plan: "Premium",
    duration: "1 Year",
    paymentStatus: "Paid",
    trainer: "Aditi Rao"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("memberContainer");

  members.forEach(member => {
    const card = document.createElement("div");
    card.classList.add("member-card");

    card.innerHTML = `
      <h3>${member.name}</h3>
      <div class="member-details">
        <p><strong>Gender:</strong> <span>${member.gender}</span></p>
        <p><strong>Plan:</strong> <span>${member.plan}</span></p>
        <p><strong>Duration:</strong> <span>${member.duration}</span></p>
        <p><strong>Payment Status:</strong> <span>${member.paymentStatus}</span></p>
      </div>
      <div class="trainer-info">
        <strong>Assigned Trainer:</strong> <span>${member.trainer || "Not Assigned"}</span>
      </div>
      <div class="action-buttons">
        <button onclick="addTrainer(${member.id})">Add Trainer</button>
        <button onclick="updateTrainer(${member.id})">Update Trainer</button>
        <button onclick="removeTrainer(${member.id})">Remove Trainer</button>
      </div>
    `;

    container.appendChild(card);
  });
});

// Action Functions
function addTrainer(id) {
  const trainerName = prompt("Enter trainer name to assign:");
  if (trainerName) {
    const member = members.find(m => m.id === id);
    member.trainer = trainerName;
    alert(`${trainerName} assigned to ${member.name}`);
    reloadCards();
  }
}

function updateTrainer(id) {
  const member = members.find(m => m.id === id);
  const newTrainer = prompt(`Update trainer for ${member.name}:`, member.trainer);
  if (newTrainer) {
    member.trainer = newTrainer;
    alert(`Trainer updated to ${newTrainer} for ${member.name}`);
    reloadCards();
  }
}

function removeTrainer(id) {
  const member = members.find(m => m.id === id);
  if (confirm(`Remove trainer from ${member.name}?`)) {
    member.trainer = "Not Assigned";
    alert(`Trainer removed from ${member.name}`);
    reloadCards();
  }
}

// Refresh cards dynamically
function reloadCards() {
  const container = document.getElementById("memberContainer");
  container.innerHTML = "";
  members.forEach(member => {
    const card = document.createElement("div");
    card.classList.add("member-card");

    card.innerHTML = `
      <h3>${member.name}</h3>
      <div class="member-details">
        <p><strong>Gender:</strong> <span>${member.gender}</span></p>
        <p><strong>Plan:</strong> <span>${member.plan}</span></p>
        <p><strong>Duration:</strong> <span>${member.duration}</span></p>
        <p><strong>Payment Status:</strong> <span>${member.paymentStatus}</span></p>
      </div>
      <div class="trainer-info">
        <strong>Assigned Trainer:</strong> <span>${member.trainer}</span>
      </div>
      <div class="action-buttons">
        <button onclick="addTrainer(${member.id})">Add Trainer</button>
        <button onclick="updateTrainer(${member.id})">Update Trainer</button>
        <button onclick="removeTrainer(${member.id})">Remove Trainer</button>
      </div>
    `;
    container.appendChild(card);
  });
}
