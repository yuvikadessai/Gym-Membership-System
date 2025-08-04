const ctx = document.getElementById('attendanceChart').getContext('2d');
new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Present', 'Absent'],
    datasets: [{
      label: 'Attendance',
      data: [18, 2],
      backgroundColor: ['#43A047', '#C62828']
    }]
  }
});
