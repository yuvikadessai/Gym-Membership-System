async function loadDashboard() {
  try {
    const response = await fetch("http://localhost:8000/dashboard", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401) {
        alert("Please log in first!");
        window.location.href = "login.html";
        return;
      }
      throw new Error("Failed to load dashboard");
    }

    const data = await response.json();
    console.log("Dashboard data:", data);

    // 🧍 Member Info
    document.querySelector(".member-name").textContent = data.name || "Member";

    // 💪 Membership Details
    const membership = data.active_subscription;
    const membershipType = membership?.membership_type || "No Active Plan";
    const validTill = membership?.expiry_date
      ? new Date(membership.expiry_date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Not Available";
    const membershipStatus = membership?.status || "Inactive";

    document.querySelector(".membership-type").textContent = membershipType;
    document.querySelector(".membership-expiry").textContent = validTill;
    const statusElement = document.querySelector(".membership-status");
    statusElement.textContent = membershipStatus;
    statusElement.style.color = membershipStatus === "Active" ? "green" : "red";

    // 🏋️ Workout Plan
    document.querySelector(".workout-goal").textContent =
      membershipType !== "No Active Plan" ? "Fitness & Strength" : "Not Set";
    document.querySelector(".workout-schedule").textContent =
      membershipType !== "No Active Plan" ? "5 Days / Week" : "No Plan";

    // 💰 Payment Status
    const lastPayment = data.subscriptions?.[0];
    document.querySelector(".payment-amount").textContent = lastPayment
      ? `₹${lastPayment.amount_paid}`
      : "No Payment";
    document.querySelector(".payment-date").textContent = lastPayment?.payment_date
      ? new Date(lastPayment.payment_date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "N/A";
    document.querySelector(".payment-status").textContent =
      lastPayment?.status || "No Payment";

    // 🧑‍🏫 Trainer Details
    document.querySelector(".trainer-name").textContent =
      membershipType !== "No Active Plan" ? "Assigned Soon" : "No Trainer";
    document.querySelector(".trainer-slot").textContent =
      membershipType !== "No Active Plan" ? "TBD" : "N/A";

  } catch (error) {
    console.error("Error loading dashboard:", error);
    alert("Failed to load dashboard. Please try again.");
  }
}

window.addEventListener("DOMContentLoaded", loadDashboard);
