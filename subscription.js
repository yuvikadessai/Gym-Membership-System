/*async function loadPlans() {
  const container = document.querySelector(".plan-grid");
  container.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch("http://localhost:8000/subscriptions");
    const plans = await res.json();

    const savedDescriptions = JSON.parse(localStorage.getItem("planDescriptions") || "{}");

    if (!plans.length) {
      container.innerHTML = "<p>No plans available yet.</p>";
      return;
    }

    container.innerHTML = "";
    plans.forEach(plan => {
      const div = document.createElement("div");
      div.classList.add("plan-card");

      // ✅ Add dynamic description from localStorage
      const desc = savedDescriptions[plan.type] || "Description not available.";
      
      div.innerHTML = `
        <h3>${plan.type}</h3>
        <p>${desc}</p>
        <ul>
          <li><strong>Duration:</strong> ${plan.duration}</li>
          <li><strong>Price:</strong> ₹${plan.price}</li>
        </ul>
        <button onclick="window.location.href='payment.html?plan=${encodeURIComponent(plan.type)}&amount=${plan.price}'">
          Join Now
        </button>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    console.error("Error loading plans:", error);
    container.innerHTML = "<p>❌ Failed to load plans. Try again later.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadPlans); 

*/

async function loadPlans() {
  const container = document.querySelector(".plan-grid");
  container.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch("http://localhost:8000/subscriptions");
    const plans = await res.json();

    if (!plans.length) {
      container.innerHTML = "<p>No plans available yet.</p>";
      return;
    }

    container.innerHTML = "";
    plans.forEach(plan => {
      const div = document.createElement("div");
      div.classList.add("plan-card");

      div.innerHTML = `
        <h3>${plan.type}</h3>
        <p>${plan.description}</p>
        <ul>
          <li><strong>Duration:</strong> ${plan.duration}</li>
          <li><strong>Price:</strong> ₹${plan.price}</li>
        </ul>
        <button onclick="window.location.href='payment.html?plan=${encodeURIComponent(plan.type)}&amount=${plan.price}'">
          Join Now
        </button>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    console.error("Error loading plans:", error);
    container.innerHTML = "<p>❌ Failed to load plans. Try again later.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadPlans);
