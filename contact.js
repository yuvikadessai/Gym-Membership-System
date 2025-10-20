document.querySelector(".contact-form").addEventListener("submit", async function(e) {
    e.preventDefault(); // prevent normal form submission

    const form = e.target;
    const full_name = form.full_name.value.trim();
    const email = form.email.value.trim();
    const phone_no = form.phone_no.value.trim();
    const message = form.message.value.trim();

    try {
        const res = await fetch("http://localhost:8000/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ full_name, email, phone_no, message })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Something went wrong!");
        } else {
            alert("✅ Message sent successfully!");
            window.location.href = "plans.html"; // redirect after clicking OK
        }
    } catch (err) {
        console.error(err);
        alert("Server error. Please try again later.");
    }
});

