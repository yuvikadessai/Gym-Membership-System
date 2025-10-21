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
        document.getElementById("fullName").value = data.firstName + " " + data.lastName;
        document.getElementById("email").value = data.email;
        document.getElementById("phone").value = data.phone;
        document.getElementById("dob").value = data.dob;
        document.getElementById("gender").value = data.gender;
        document.getElementById("address").value = data.address;
    })
    .catch(err => console.log(err));
});
