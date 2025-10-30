
const params = new URLSearchParams(window.location.search);
const plan = params.get('plan');
const amount = params.get('amount');

if (plan) document.getElementById('plan_name').value = plan;
if (amount) document.getElementById('amount').value = amount;

// Update expiry date based on enrollment date input
const enrollmentInput = document.getElementById('enrollment_date');
const expiryInput = document.getElementById('expiry_date');

enrollmentInput.addEventListener('change', function() {
  const date = new Date(this.value);
  if (!isNaN(date)) {
    const expiry = new Date(date);
    expiry.setMonth(expiry.getMonth() + 1);
    const yyyy = expiry.getFullYear();
    const mm = String(expiry.getMonth() + 1).padStart(2, '0');
    const dd = String(expiry.getDate()).padStart(2, '0');
    expiryInput.value = `${yyyy}-${mm}-${dd}`;
  } else {
    expiryInput.value = '';
  }
});




document.getElementById("paymentForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    plan_name: document.getElementById("plan_name").value,
    amount: document.getElementById("amount").value,
    payment_method: document.getElementById("method").value,
    transaction_id: document.getElementById("transaction_id").value,
    enrollment_date: document.getElementById("enrollment_date").value,
    expiry_date: document.getElementById("expiry_date").value,
    status: "Completed"
  };

  const response = await fetch("http://localhost:8000/pay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // ✅ Important if using session
    body: JSON.stringify(formData)
  });

  const data = await response.json();
  if (response.ok) {
    alert(data.message);
    window.location.href = "memberdashboard.html";
  } else {
    alert(data.error || "Payment failed.");
  }
});
