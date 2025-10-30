// Example Plan Data
let plans = [
  { name: "Strength Training", price: 1200, members: 12, description: "Build strength with guided workouts." },
  { name: "Cardio & HIIT", price: 1000, members: 18, description: "Boost stamina with high-intensity training." },
  { name: "Yoga & Flexibility", price: 900, members: 10, description: "Improve posture, flexibility, and peace." },
  { name: "CrossFit Program", price: 1800, members: 6, description: "Challenge yourself with CrossFit workouts." },
  { name: "Zumba & Dance Fitness", price: 800, members: 9, description: "Fun, dance-based fitness sessions." }
];

document.addEventListener("DOMContentLoaded", loadPlans);

function loadPlans() {
  const container = document.getElementById("planContainer");
  container.innerHTML = "";

  plans.forEach((plan, index) => {
    const card = document.createElement("div");
    card.classList.add("plan-card");

    card.innerHTML = `
      <h3>${plan.name}</h3>
      <p><strong>Description:</strong> ${plan.description}</p>
      <p><strong>Price:</strong> ₹${plan.price}/month</p>
      <p><strong>Members Subscribed:</strong> ${plan.members}</p>
      <button onclick="updatePlan(${index})">✏️ Update Plan</button>
    `;

    container.appendChild(card);
  });
}

function updatePlan(index) {
  const plan = plans[index];
  const newName = prompt("Update Plan Name:", plan.name);
  const newPrice = prompt("Update Price (₹):", plan.price);
  const newDesc = prompt("Update Description:", plan.description);

  if (newName && newPrice && newDesc) {
    plans[index] = { ...plan, name: newName, price: parseInt(newPrice), description: newDesc };
    alert("Plan updated successfully!");
    localStorage.setItem("gymPlans", JSON.stringify(plans)); // Save for frontend use
    loadPlans();
  }
}

// Load from local storage if available
window.onload = () => {
  const savedPlans = localStorage.getItem("gymPlans");
  if (savedPlans) plans = JSON.parse(savedPlans);
  loadPlans();
};
