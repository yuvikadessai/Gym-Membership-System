document.querySelector(".register-form").addEventListener("submit", async function(e) {
    e.preventDefault(); // Stop the default form submission
  
    const form = e.target;
  
    // Collect form data into an object
    const formData = {
      firstname: form.firstname.value.trim(),
      lastname: form.lastname.value.trim(),
      dob: form.dob.value,
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      gender: form.gender.value.trim().toLowerCase(),
      password: form.password.value.trim(),
      address: form.address.value.trim()
    };
  
    // ✅ Validation
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!emailPattern.test(formData.email)) return alert("Please enter a valid email address.");
  
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(formData.phone)) return alert("Phone number must be 10 digits.");
  
    if (formData.password.length < 6) return alert("Password must be at least 6 characters long.");
  
    if (!["male", "female", "other"].includes(formData.gender))
      return alert("Gender must be Male, Female, or Other.");
  
    // ✅ Send data to backend
    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
  
      const result = await response.text();
      alert(result); // Show backend response
  
      if (response.ok) {
        window.location.href = "login.html"; // Redirect on success
      }
    } catch (err) {
      console.error(err);
      alert("Server error! Please try again.");
    }
  });
