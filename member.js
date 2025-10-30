document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:8000/membersaccess")
    .then(res => res.json())
    .then(data => {
      const tableBody = document.getElementById("memberTableBody");
      tableBody.innerHTML = "";

      if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7">No members found.</td></tr>`;
        return;
      }

      data.forEach(member => {
        const row = `
          <tr>
            <td>${member.member_id}</td>
            <td>${member.firstName} ${member.lastName}</td>
            <td>${member.email}</td>
            <td>${member.phone}</td>
            <td>${member.membership_id || "N/A"}</td>
            <td>${member.enrollment_date ? member.enrollment_date.split("T")[0] : "N/A"}</td>
            <td>${member.expiry_date ? member.expiry_date.split("T")[0] : "N/A"}</td>
          </tr>
        `;
        tableBody.innerHTML += row;
      });
    })
    .catch(err => {
      console.error("Error loading members:", err);
      document.getElementById("memberTableBody").innerHTML =
        `<tr><td colspan="7">Error loading members.</td></tr>`;
    });
});
