document.getElementById("adminRegisterForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
  
    try {
      const response = await fetch("http://localhost:8000/adminRegister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // ✅ Show popup alert for success
        alert("✅ Registration successful! You can now log in.");
        
        // Redirect to login page
        window.location.href = "adminlogin.html";
      } else {
        // ⚠️ Show popup for any validation or backend errors
        alert(`⚠️ ${data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Server error. Please try again later.");
    }
  });
  