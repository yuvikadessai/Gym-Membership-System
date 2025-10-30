// paydashboard.js

document.addEventListener("DOMContentLoaded", async () => {
  const paymentTableBody = document.getElementById("paymentTableBody");

  try {
    // Fetch data from backend
    const response = await fetch("http://localhost:8000/paymentdash");
    if (!response.ok) throw new Error("Failed to fetch payment data");

    const payments = await response.json();
    paymentTableBody.innerHTML = "";

    if (payments.length === 0) {
      paymentTableBody.innerHTML = `
        <tr>
          <td colspan="4">No payment records found.</td>
        </tr>`;
      return;
    }

    // Populate table rows
    payments.forEach(payment => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${payment.firstName} ${payment.lastName}</td>
        <td>${payment.planName || "No Plan"}</td>
        <td>₹${payment.amount || 0}</td>
        <td class="${payment.status === 'Paid' ? 'paid' : 'unpaid'}">
          ${payment.status}
        </td>
      `;

      paymentTableBody.appendChild(row);
    });

  } catch (err) {
    console.error("Error loading payments:", err);
    paymentTableBody.innerHTML = `
      <tr>
        <td colspan="4">Failed to load payment data.</td>
      </tr>`;
  }
});
