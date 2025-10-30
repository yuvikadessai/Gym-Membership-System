document.addEventListener("DOMContentLoaded", async () => {
  const trainerList = document.getElementById("trainersTableBody");

  try {
    const res = await fetch("http://localhost:8000/trainers");

    if (!res.ok) throw new Error("Failed to fetch trainers");

    const trainers = await res.json();
    trainerList.innerHTML = "";

    if (trainers.length === 0) {
      trainerList.innerHTML = `<tr><td colspan="4">No trainers found.</td></tr>`;
      return;
    }

    trainers.forEach(trainer => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${trainer.name}</td>
        <td>${trainer.experience}</td>
        <td>${trainer.phone}</td>
        <td>${trainer.specialisation}</td>
      `;
      trainerList.appendChild(row);
    });
  } catch (err) {
    console.error("Error loading trainers:", err);
    trainerList.innerHTML = `<tr><td colspan="4">Failed to load trainer data.</td></tr>`;
  }
});
