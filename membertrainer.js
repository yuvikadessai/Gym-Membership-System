
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:8000/trainerdetails", {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    if (data.message === "No trainer assigned for this plan") {
      document.querySelector(".trainer-photo img").src = "logo.png";
      document.querySelector(".trainer-photo h2").textContent = "No Trainer Assigned";
      document.querySelector(".trainer-role").textContent = "Please contact the admin for trainer allocation.";
      document.querySelector(".trainer-info").innerHTML = "";
      return;
    }

    // If trainer assigned, populate details
    document.querySelector(".trainer-photo h2").textContent = data.name;
    document.querySelector(".trainer-role").textContent = data.specialisation || "Trainer";

    const infoHTML = `
      <div class="info-group"><label>Experience:</label><p>${data.experience || "-"} Years</p></div>
      <div class="info-group"><label>Specialization:</label><p>${data.specialisation || "-"}</p></div>
      <div class="info-group"><label>Contact:</label><p>Email: ${data.email || "-"}<br>Phone: ${data.phone || "-"}</p></div>
    `;
    document.querySelector(".trainer-info").innerHTML = infoHTML;

  } catch (err) {
    console.error("Error fetching trainer details:", err);
    alert("Failed to load trainer details.");
  }
});

