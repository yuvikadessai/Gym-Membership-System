document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("memberContainer");

  // Fetch all members
  fetch("http://localhost:8000/assigntrainers")
    .then(res => res.json())
    .then(members => {
      container.innerHTML = members.map(member => `
        <div class="member-card">
          <h3>${member.firstName}</h3>
          <p><b>Gender:</b> ${member.gender}</p>
          <p><b>Plan:</b> ${member.plan}</p>
          <p><b>Duration:</b> ${member.duration}</p>
          <p><b>Payment Status:</b> ${member.payment_status}</p>
          <p><b>Assigned Trainer:</b> ${member.trainer}</p>

          <label for="trainer-${member.member_id}">Assign Trainer:</label>
          <input type="text" id="trainer-${member.member_id}" placeholder="Enter trainer name">
          <button onclick="assignTrainer('${member.member_id}')">Assign</button>
        </div>
      `).join("");
    })
    .catch(err => console.error("Error fetching members:", err));
});

function assignTrainer(memberId) {
  const trainerName = document.getElementById(`trainer-${memberId}`).value.trim();
  if (!trainerName) return alert("Please enter trainer name");

  fetch("http://localhost:8000/assigntrainers/assign-trainer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ member_id: memberId, trainer_name: trainerName })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      window.location.reload();
    })
    .catch(err => console.error("Error assigning trainer:", err));
}
