document.getElementById("adminLoginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
  
    try {
      const res = await fetch("http://localhost:8000/adminLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert("✅ Login successful! Welcome " + data.name);
        window.location.href = "admindashboard.html"; // redirect after login
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      alert("⚠️ Something went wrong. Please try again later.");
      console.error(err);
    }
  });
  