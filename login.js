document.querySelector(".login-form").addEventListener("submit", async function(e) {
    e.preventDefault(); // prevent default form submission

    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    try {
        const res = await fetch("http://localhost:8000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Login failed");
        } else {
            // ✅ Login successful, redirect to plans.html
            window.location.href = "memberprofile.html";
        }
    } catch (err) {
        console.error(err);
        alert("Server error, try again later");
    }
});