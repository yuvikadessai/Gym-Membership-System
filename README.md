# 🏋️ Gym Membership System

A **modern Gym Membership System** built using **HTML, CSS, JavaScript, Node.js, and Express.js**.  
Supports **Admin** and **Member** roles with dashboards, subscription management, payments, and trainer assignments.

---

## 🚀 Features

### 💻 Member Dashboard
- 🔑 **Login & Logout:** Secure member authentication.
- 📂 **Sidebar Navigation:** Access subscription plans, profile, and feedback.
- 🏷 **Subscription Plans:** Browse and join gym plans.
- 📝 **Profile Details:** View personal and membership info.
- 💳 **Payment Integration:** Email confirmation on successful payment.
- 💬 **Feedback:** Submit feedback via contact form to admin.

### 🛠 Admin Dashboard
- 🔐 **Admin Login:** Secure admin access.
- 👥 **Member Management:** View all members and their details.
- 🏋️ **Trainer Management:** Assign trainers to members.
- 💰 **Payment Management:** Track payments and statuses.
- 📄 **Plan Management:** Add, edit, or remove subscription plans.
- 📧 **Email Notifications:**  
  - Receive member feedback via email.  
  - Send payment confirmation emails to members.

---

## 🗂 Database Structure

The system uses a **relational database** with these tables:

| Table Name     | Description                                              |
|----------------|----------------------------------------------------------|
| **members**    | Member info, login credentials, assigned trainer.       |
| **trainers**   | Trainer details and availability.                       |
| **payment**    | Member payments and status.                              |
| **membership** | Details of subscription plans.                           |
| **admin**      | Admin credentials and profile info.                     |
| **contact**    | Feedback submitted by members.                           |

---

## 🛠 Technologies Used
- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Node.js, Express.js  
- **Database:** MySQL  
- **Libraries/Tools:** Nodemailer (emails), Chart.js (analytics)

---


