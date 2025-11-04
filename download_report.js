    async function downloadCompleteReportExcel() {
    try {
      // ✅ Show loading notification
      showNotification("Generating Excel report...", "info");

      // ✅ Fetch the data from backend
      const response = await fetch("http://localhost:8000/downloadreport/all-members", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch report data");
      }

      const members = await response.json();
      if (members.length === 0) {
        showNotification("No members found to generate report", "error");
        return;
      }

      // ✅ Format data for Excel
      const excelData = members.map(member => ({
        "ID": member.member_id,
        "Name": member.name,
        "Gender": member.gender,
        "DOB": member.dob || "N/A",
        "Plan Name": member.plan_name,
        "Enrollment Date": member.enrollment_date,
        "Expiry Date": member.expiry_date,
        "Plan Status": member.plan_status,
        "Payment Status": member.payment_status,
        "Payment Date": member.payment_date || "N/A"
      }));

      // ✅ Create worksheet & workbook
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Members Report");

      // ✅ File name with current date
      const fileName = `FitHub_Members_Report_${new Date().toISOString().split("T")[0]}.xlsx`;

      // ✅ Download Excel file
      XLSX.writeFile(workbook, fileName);

      // ✅ Success Notification
      showNotification("✅ Excel report downloaded successfully!", "success");

    } catch (error) {
      console.error("Error generating Excel:", error);
      showNotification("❌ Failed to generate Excel report.", "error");
    }
  }

  // ✅ Notification Function
  function showNotification(message, type) {
    let notificationBox = document.getElementById("notificationBox");

    if (!notificationBox) {
      notificationBox = document.createElement("div");
      notificationBox.id = "notificationBox";
      document.body.appendChild(notificationBox);
    }

    notificationBox.innerText = message;

    // Styling based on type
    notificationBox.style.position = "fixed";
    notificationBox.style.top = "30px";
    notificationBox.style.right = "30px";
    notificationBox.style.padding = "20px 20px";
    notificationBox.style.borderRadius = "10px";
    notificationBox.style.color = "#fff";
    notificationBox.style.fontSize = "14px";
    notificationBox.style.zIndex = "9999";

    if (type === "success") {
      notificationBox.style.backgroundColor = "#28a745"; // Green
    } else if (type === "error") {
      notificationBox.style.backgroundColor = "#dc3545"; // Red
    } else {
      notificationBox.style.backgroundColor = "#007bff"; // Blue (info)
    }

    // Auto remove after 3 seconds
    setTimeout(() => {
      notificationBox.remove();
    }, 3000);
  }

