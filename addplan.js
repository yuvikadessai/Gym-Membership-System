/*document.getElementById("addPlanForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const type = document.getElementById("planName").value.trim();
    const duration = 1; // You can later make this dynamic if needed
    const price = document.getElementById("planPrice").value;
    const description = document.getElementById("planDesc").value.trim();
  
    if (!type || !price || !description) {
      alert("Please fill all fields!");
      return;
    }
  
    try {
      // ✅ Send plan data to backend
      const res = await fetch("http://localhost:8000/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, duration, price}),
      });
  
      const data = await res.json();
  
      if (data.success) {
        // ✅ Save description locally (key = plan type)
        const savedDescriptions = JSON.parse(localStorage.getItem("planDescriptions") || "{}");
        savedDescriptions[type] = description;
        localStorage.setItem("planDescriptions", JSON.stringify(savedDescriptions));
     
        alert("✅ Plan added successfully!");
        window.location.href = "adminsubscriptions.html";
      } else {
        alert("❌ Failed to add plan. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error adding plan. Check your backend connection.");
    }
  });
  */

  /*document.getElementById("addPlanForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const type = document.getElementById("planName").value.trim();
    const duration = 1; // can be dynamic later
    const price = document.getElementById("planPrice").value.trim();
    const description = document.getElementById("planDesc").value.trim();
  
    if (!type || !price || !description) {
      alert("⚠️ Please fill all fields!");
      return;
    }
  
    try {
      // ✅ Send plan data (without description) to backend
      const res = await fetch("http://localhost:8000/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, duration, price }),
      });
  
      const data = await res.json();
  
      if (data.success) {
        // ✅ Save description locally under plan type
        const savedDescriptions = JSON.parse(localStorage.getItem("planDescriptions") || "{}");
        savedDescriptions[type] = description;
        localStorage.setItem("planDescriptions", JSON.stringify(savedDescriptions));
  
        alert("✅ Plan added successfully!");
        window.location.href = "adminsubscriptions.html";
      } else {
        alert("❌ Failed to add plan. Please try again.");
      }
    } catch (err) {
      console.error("Add Plan Error:", err);
      alert("❌ Error adding plan. Check your backend connection.");
    }
  });
  */


 // ✅ Add New Plan
document.getElementById("addPlanForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const type = document.getElementById("planName").value.trim();
  const duration = 1; // or make dynamic
  const price = document.getElementById("planPrice").value;
  const description = document.getElementById("planDesc").value.trim();

  if (!type || !price || !description) {
    alert("Please fill all fields!");
    return;
  }

  try {
    const res = await fetch("http://localhost:8000/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, duration, price, description }),
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Plan added successfully!");
      window.location.href = "adminsubscriptions.html";
    } else {
      alert("❌ Failed to add plan. Please try again.");
    }
  } catch (err) {
    console.error(err);
    alert("❌ Error adding plan. Check your backend connection.");
  }
});

// ✅ Update Existing Plan
async function updatePlan(type) {
  const newType = prompt("Enter new plan name:", type);
  const newPrice = prompt("Enter new price:");
  const newDescription = prompt("Enter new description:");

  if (!newType || !newPrice || !newDescription) {
    alert("⚠️ All fields are required!");
    return;
  }

  try {
    const res = await fetch("http://localhost:8000/subscriptions/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        newType,
        price: newPrice,
        description: newDescription,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      location.reload();
    } else {
      alert(data.message || "Failed to update plan");
    }
  } catch (err) {
    console.error("Error updating plan:", err);
    alert("❌ Error updating plan. Check backend connection.");
  }
}
