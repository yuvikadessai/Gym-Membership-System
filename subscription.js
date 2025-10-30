async function loadPlans() {
    const container = document.querySelector(".subscriptions-container");
    container.innerHTML = "<p>Loading...</p>";

    try {
      const res = await fetch("/api/admin/plans/all");
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
          <ul>
            <li><strong>Duration:</strong> ${plan.duration} months</li>
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