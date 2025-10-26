// Fetch and display member dashboard data
async function loadDashboard() {
    try {
      const response = await fetch("http://localhost:8000/dashboard", {
        method: "GET",
        credentials: "include" // Important for session
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
  
      // Update member name
      document.querySelector("header h1 span").textContent = data.name;
  
      // Update Membership Details card
      const membershipCard = document.querySelectorAll(".card")[0];
      const membershipType = data.membership.type || "No Active Plan";
      const validTill = data.membership.exp_date 
        ? new Date(data.membership.exp_date).toLocaleDateString('en-IN', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
          })
        : "Not Available";
      
      membershipCard.innerHTML = `
        <h3>Membership Details</h3>
        <p><strong>Type:</strong> ${membershipType}</p>
        <p><strong>Valid Till:</strong> ${validTill}</p>
        <p><strong>Status:</strong> <span style="color: ${data.membership.status === 'Active' ? 'green' : 'red'}">${data.membership.status}</span></p>
      `;
  
      // Update Workout Plan card (you can customize this)
      const workoutCard = document.querySelectorAll(".card")[1];
      workoutCard.innerHTML = `
        <h3>Workout Plan</h3>
        <p><strong>Goal:</strong> ${data.membership.type ? 'Fitness & Strength' : 'Not Set'}</p>
        <p><strong>Schedule:</strong> ${data.membership.type ? '5 Days / Week' : 'No Plan'}</p>
      `;
  
      // Update Payment Status card
      const paymentCard = document.querySelectorAll(".card")[2];
      const lastPaymentAmount = data.payment.last_amount 
        ? `₹${data.payment.last_amount}` 
        : "No Payment";
      const lastPaymentDate = data.payment.last_date 
        ? new Date(data.payment.last_date).toLocaleDateString('en-IN', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
          })
        : "N/A";
      
      paymentCard.innerHTML = `
        <h3>Payment Status</h3>
        <p><strong>Last Payment:</strong> ${lastPaymentAmount} ${data.payment.last_date ? 'on ' + lastPaymentDate : ''}</p>
        <p><strong>Status:</strong> ${data.payment.status || 'No Payment'}</p>
      `;
  
      // Update Trainer Details card (placeholder - add trainer data if available)
      const trainerCard = document.querySelectorAll(".card")[3];
      trainerCard.innerHTML = `
        <h3>Trainer Details</h3>
        <p><strong>Name:</strong> ${data.membership.type ? 'Assigned Soon' : 'No Trainer'}</p>
        <p><strong>Slot:</strong> ${data.membership.type ? 'TBD' : 'N/A'}</p>
      `;
  
    } catch (error) {
      console.error("Error loading dashboard:", error);
      alert("Failed to load dashboard. Please try again.");
    }
  }
  
  // Load dashboard when page loads
  window.addEventListener('DOMContentLoaded', loadDashboard);