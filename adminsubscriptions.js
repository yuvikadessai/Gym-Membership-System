async function loadPlans() {
  const container = document.getElementById("planContainer");
  container.innerHTML = "<p>Loading plans...</p>";

  try {
    const res = await fetch("http://localhost:8000/subscriptions");
    const plans = await res.json();

    if (!plans.length) {
      container.innerHTML = "<p>No plans added yet.</p>";
      return;
    }

    container.innerHTML = "";
    plans.forEach((plan) => {
      const card = document.createElement("div");
      card.classList.add("plan-card");

      card.innerHTML = `
        <h3>${plan.type}</h3>
        <p><strong>Description:</strong> ${plan.description || "No description provided"}</p>
        <p><strong>Price:</strong> ₹${plan.price}/month</p>
        <p><strong>Duration:</strong> ${plan.duration} month(s)</p>
        <div class="plan-actions">
          <button onclick="updatePlan('${plan.type}', '${plan.description}', ${plan.price})">✏️ Update</button>
          <button class="delete-btn" onclick="deletePlan('${plan.membership_id}')">🗑️ Delete</button>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading plans:", error);
    container.innerHTML = "<p>❌ Failed to load plans.</p>";
  }
}

// ✅ Update Plan
async function updatePlan(oldType, oldDesc, oldPrice) {
  const newType = prompt("Enter new plan name:", oldType);
  const newPrice = prompt("Enter new price:", oldPrice);
  const newDescription = prompt("Enter new description:", oldDesc);

  if (!newType || !newPrice || !newDescription) {
    alert("⚠️ All fields are required!");
    return;
  }

  try {
    const res = await fetch("http://localhost:8000/subscriptions/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        oldType,
        newType,
        price: newPrice,
        description: newDescription,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      loadPlans(); // refresh
    } else {
      alert(data.message || "❌ Failed to update plan.");
    }
  } catch (error) {
    console.error("Error updating plan:", error);
    alert("❌ Error updating plan. Check backend connection.");
  }
}

// 🗑️ Delete Plan
async function deletePlan(membership_id) {
  if (!confirm("Are you sure you want to delete this plan?")) return;

  try {
    const res = await fetch(`http://localhost:8000/subscriptions/${membership_id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (res.ok && data.success) {
      alert(data.message);
      loadPlans(); // Refresh list
    } else {
      alert(data.message || "❌ Failed to delete plan.");
    }
  } catch (error) {
    console.error("Error deleting plan:", error);
    alert("❌ Error deleting plan. Check backend connection.");
  }
}

document.addEventListener("DOMContentLoaded", loadPlans);
