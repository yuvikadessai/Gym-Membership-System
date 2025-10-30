

// admindashboard.js - Dynamic Admin Dashboard with Charts

document.addEventListener("DOMContentLoaded", async () => {
  try {
    console.log("Fetching dashboard data...");
    
    const res = await fetch("http://localhost:8000/admindash");
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log("Dashboard data received:", data);

    // --- Total Registrations ---
    if (data.total_members !== undefined) {
      document.querySelector(".total-registrations").textContent = data.total_members;
    } else {
      document.querySelector(".total-registrations").textContent = "0";
    }

    // --- Gender Data ---
    const male = data.gender?.find(g => g.gender === "Male")?.count || 0;
    const female = data.gender?.find(g => g.gender === "Female")?.count || 0;

    // --- Monthly Members Joined (Bar Chart) ---
    const months = data.monthly?.map(m => m.month) || [];
    const memberCounts = data.monthly?.map(m => m.count) || [];

    if (months.length > 0) {
      new Chart(document.getElementById("membersChart"), {
        type: "bar",
        data: {
          labels: months,
          datasets: [{
            label: "Members Joined",
            data: memberCounts,
            backgroundColor: "rgba(102, 126, 234, 0.8)",
            borderColor: "rgba(102, 126, 234, 1)",
            borderWidth: 2,
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            }
          },
          scales: {
            y: { 
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    } else {
      console.warn("No monthly data available");
    }

    // --- Gender Ratio (Pie Chart) ---
    if (male > 0 || female > 0) {
      new Chart(document.getElementById("genderChart"), {
        type: "pie",
        data: {
          labels: ["Male", "Female"],
          datasets: [{
            data: [male, female],
            backgroundColor: ["#667eea", "#764ba2"],
            borderWidth: 2,
            borderColor: "#fff"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    } else {
      console.warn("No gender data available");
    }

    // --- Payment Status (Pie Chart) ---
    console.log("Payment data:", data.payments);
    
    if (data.payments && data.payments.length > 0) {
      // Extract payment statuses - should now be: Completed, Pending, Not Paid
      const paymentLabels = data.payments.map(p => p.status || 'Not Paid');
      const paymentCounts = data.payments.map(p => p.count || 0);
      
      console.log("Payment labels:", paymentLabels);
      console.log("Payment counts:", paymentCounts);
      
      // Color mapping
      const paymentColors = {
        'Completed': '#10b981',  // Green
        'Pending': '#f59e0b',    // Orange
        'Not Paid': '#ef4444'    // Red
      };
      
      const backgroundColors = paymentLabels.map(label => 
        paymentColors[label] || '#6b7280'
      );
    
      const totalPayments = paymentCounts.reduce((a, b) => a + b, 0);
    
      if (totalPayments > 0) {
        new Chart(document.getElementById("paymentChart"), {
          type: "pie",
          data: {
            labels: paymentLabels,
            datasets: [{
              data: paymentCounts,
              backgroundColor: backgroundColors,
              borderWidth: 2,
              borderColor: "#fff"
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom'
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.parsed || 0;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              }
            }
          }
        });
      } else {
        const ctx = document.getElementById("paymentChart");
        ctx.parentElement.innerHTML = '<p style="text-align:center;padding:40px;color:#999;">No payment data available</p>';
      }
    } else {
      console.warn("No payment data available. Payment data structure:", data.payments);
      // Show empty chart with message
      const ctx = document.getElementById("paymentChart");
      ctx.parentElement.innerHTML = '<p style="text-align:center;padding:40px;color:#999;">No payment data available</p>';
    }

    // --- Membership Status (Pie Chart) ---
    console.log("Membership status data:", data.membership_status);
    
    if (data.membership_status && typeof data.membership_status === 'object') {
      const activePlans = data.membership_status.active || 0;
      const inactivePlans = data.membership_status.inactive || 0;
      const expiringPlans = data.membership_status.expiring || 0;
      
      const totalMemberships = activePlans + inactivePlans + expiringPlans;

      if (totalMemberships > 0) {
        new Chart(document.getElementById("membershipChart"), {
          type: "pie",
          data: {
            labels: ["Active", "Inactive", "Expiring Soon"],
            datasets: [{
              data: [activePlans, inactivePlans, expiringPlans],
              backgroundColor: ["#10b981", "#6b7280", "#f59e0b"],
              borderWidth: 2,
              borderColor: "#fff"
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }
        });
      } else {
        const ctx = document.getElementById("membershipChart");
        ctx.parentElement.innerHTML = '<p style="text-align:center;padding:40px;color:#999;">No active memberships. Please add expiry dates to member records.</p>';
      }
    } else {
      console.warn("No membership status data available. Data structure:", data.membership_status);
      // Show empty chart with message
      const ctx = document.getElementById("membershipChart");
      ctx.parentElement.innerHTML = '<p style="text-align:center;padding:40px;color:#999;">No membership status data available</p>';
    }

    console.log("✅ Dashboard loaded successfully!");

  } catch (err) {
    console.error("❌ Error loading dashboard:", err);
    
    // Show error message to user
    const mainContent = document.querySelector(".main-content");
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.innerHTML = `
      <h3>⚠️ Failed to load dashboard data</h3>
      <p>Error: ${err.message}</p>
      <p>Please check:</p>
      <ul>
        <li>Server is running on port 8000</li>
        <li>Database is connected</li>
        <li>Route /admindash exists</li>
      </ul>
    `;
    errorDiv.style.cssText = `
      background: #fee;
      border: 2px solid #fcc;
      color: #c33;
      padding: 20px;
      border-radius: 10px;
      margin: 20px 0;
    `;
    mainContent.insertBefore(errorDiv, mainContent.firstChild);
  }
}); 





