// reportGenerator.js - Complete Members Report PDF Generator
// Add to your HTML: <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
// Add to your HTML: <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"></script>

async function downloadCompleteReport() {
    try {
      const { jsPDF } = window.jspdf;
      
      // Show loading
      showNotification("Generating report...", "info");
      
      // Fetch all members data
      const response = await fetch("http://localhost:8000/downloadreport/all-members", {
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch report data");
      }
      
      const members = await response.json();
      
      if (members.length === 0) {
        showNotification("No members found to generate report", "error");
        return;
      }
      
      // Create PDF
      const doc = new jsPDF('landscape'); // Landscape for wide table
      
      // === HEADER ===
      doc.setFillColor(168, 255, 152); // Green
      doc.rect(0, 0, 297, 35, 'F');
      
      doc.setTextColor(32, 35, 42);
      doc.setFontSize(22);
      doc.setFont(undefined, 'bold');
      doc.text("FitHub Gym Management System", 148.5, 15, { align: 'center' });
      
      doc.setFontSize(14);
      doc.text("Complete Members Report", 148.5, 25, { align: 'center' });
      
      // === REPORT INFO ===
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 45);
      doc.text(`Total Members: ${members.length}`, 15, 52);
      
      // Count statistics
      const activePlans = members.filter(m => m.plan_status === 'Active').length;
      const inactivePlans = members.filter(m => m.plan_status === 'Inactive').length;
      const expiringPlans = members.filter(m => m.plan_status === 'Expiring Soon').length;
      const paidMembers = members.filter(m => m.payment_status === 'Completed').length;
      const unpaidMembers = members.filter(m => m.payment_status === 'Not Paid').length;
      
      doc.text(`Active Plans: ${activePlans} | Inactive: ${inactivePlans} | Expiring: ${expiringPlans}`, 120, 45);
      doc.text(`Paid: ${paidMembers} | Unpaid: ${unpaidMembers}`, 120, 52);
      
      // === TABLE DATA ===
      const tableData = members.map(member => [
        member.member_id,
        member.name,
        member.gender,
        member.dob || 'N/A',
        member.plan_name,
        member.enrollment_date,
        member.expiry_date,
        member.plan_status,
        member.payment_status,
        member.payment_date || 'N/A'
      ]);
      
      // === AUTO TABLE ===
      doc.autoTable({
        startY: 60,
        head: [[
          'ID',
          'Name',
          'Gender',
          'DOB',
          'Plan',
          'Enrollment',
          'Expiry',
          'Plan Status',
          'Payment',
          'Payment Date'
        ]],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [168, 255, 152],
          textColor: [32, 35, 42],
          fontStyle: 'bold',
          fontSize: 9
        },
        bodyStyles: {
          fontSize: 8
        },
        columnStyles: {
          0: { cellWidth: 15 },  // ID
          1: { cellWidth: 35 },  // Name
          2: { cellWidth: 20 },  // Gender
          3: { cellWidth: 25 },  // DOB
          4: { cellWidth: 35 },  // Plan
          5: { cellWidth: 28 },  // Enrollment
          6: { cellWidth: 28 },  // Expiry
          7: { cellWidth: 28 },  // Plan Status
          8: { cellWidth: 25 },  // Payment
          9: { cellWidth: 28 }   // Payment Date
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        didParseCell: function(data) {
          // Color code plan status
          if (data.column.index === 7 && data.section === 'body') {
            const status = data.cell.raw;
            if (status === 'Active') {
              data.cell.styles.textColor = [16, 185, 129]; // Green
              data.cell.styles.fontStyle = 'bold';
            } else if (status === 'Expiring Soon') {
              data.cell.styles.textColor = [251, 191, 36]; // Yellow
              data.cell.styles.fontStyle = 'bold';
            } else if (status === 'Inactive') {
              data.cell.styles.textColor = [239, 68, 68]; // Red
              data.cell.styles.fontStyle = 'bold';
            }
          }
          
          // Color code payment status
          if (data.column.index === 8 && data.section === 'body') {
            const status = data.cell.raw;
            if (status === 'Completed') {
              data.cell.styles.textColor = [16, 185, 129]; // Green
              data.cell.styles.fontStyle = 'bold';
            } else if (status === 'Not Paid') {
              data.cell.styles.textColor = [239, 68, 68]; // Red
              data.cell.styles.fontStyle = 'bold';
            } else if (status === 'Pending') {
              data.cell.styles.textColor = [251, 191, 36]; // Yellow
              data.cell.styles.fontStyle = 'bold';
            }
          }
        }
      });
      
      // === FOOTER ===
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Page ${i} of ${pageCount}`,
          148.5,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
        doc.text(
          '© FitHub Gym Management System',
          15,
          doc.internal.pageSize.height - 10
        );
      }
      
      // === SAVE PDF ===
      const fileName = `FitHub_Members_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      showNotification("Report downloaded successfully!", "success");
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      showNotification("Failed to generate report. Please try again.", "error");
    }
  }
  
  // Notification helper
  function showNotification(message, type) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      padding: 15px 25px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      font-weight: 600;
      border-left: 4px solid ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.3s';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }