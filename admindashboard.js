// Sample data (this will later come from your database)
const dashboardData = {
  totalMembers: 120,
  totalTrainers: 8,
  maleCount: 70,
  femaleCount: 50,
  activeMembers: 110,
  expiringSoon: 10
};

document.addEventListener("DOMContentLoaded", () => {
  // Populate data
  document.querySelector(".total-members").textContent = dashboardData.totalMembers;
  document.querySelector(".total-trainers").textContent = dashboardData.totalTrainers;
  document.querySelector(".male-count").textContent = dashboardData.maleCount;
  document.querySelector(".female-count").textContent = dashboardData.femaleCount;
  document.querySelector(".active-members").textContent = dashboardData.activeMembers;
  document.querySelector(".expiring-members").textContent = dashboardData.expiringSoon;

  // Calculate and render ratio bar
  const total = dashboardData.maleCount + dashboardData.femaleCount;
  const malePercent = (dashboardData.maleCount / total) * 100;
  const femalePercent = (dashboardData.femaleCount / total) * 100;

  document.querySelector(".male-bar").style.width = `${malePercent}%`;
  document.querySelector(".female-bar").style.width = `${femalePercent}%`;
});
