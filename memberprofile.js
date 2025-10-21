window.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:8000/details", {
        method: "GET",
        credentials: "include" // important for sessions
    })
    .then(res => res.json())
    .then(data => {
        if(data.error){
            alert(data.error);
            return;
        }

        const user = data;
        document.getElementById("fullName").value = `${user.firstName} ${user.lastName}`;
        document.getElementById("email").value = user.email;
        document.getElementById("phone").value = user.phone;

        document.getElementById("dob").value = user.dob;
        const [year, month, day] = user.dob.split("-");
        document.getElementById("dob").innerText= `${year}-${month}-${day}`;

        document.getElementById("gender").value = user.gender;
        document.getElementById("address").value = user.address;
    })
    .catch(err => console.log(err));


    const form = document.querySelector(".profile-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent page reload

    // Collect updated values
    const updatedUser = {
      fullName: document.getElementById("fullName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      dob: document.getElementById("dob").value,
      gender: document.getElementById("gender").value,
      address: document.getElementById("address").value
    };

    // Split fullName into firstName and lastName
    const nameParts = updatedUser.fullName.trim().split(" ");
    updatedUser.firstName = nameParts[0] || "";
    updatedUser.lastName = nameParts.slice(1).join(" ") || "";

    // Send POST request to update backend
    fetch("http://localhost:8000/update-profile", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedUser)
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
      } else {
        alert("Profile updated successfully!");
      }
    })
    .catch(err => console.error(err));
  });

   });
