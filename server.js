const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");

// Import all routers
const routerLogin = require("./routesLogin");
const routerRegister = require("./routesRegister");
const routerContact = require("./routesContact"); 
const routerPayment = require("./routesPayment");
const routerMember = require("./routesMember");
const routerMemberprofile = require("./routesMemberprofile");
const routerDashboard = require("./routesDashboard");
const routerAdminRegister = require("./routesAdminRegister");
const routerAdminLogin = require("./routesAdminLogin");
const routerAccessMembers = require("./routesAccessMembers");
const routerPaymentDashboard = require("./routesPaymentDashboard");
const routerTrainers = require("./routesTrainers");
const routerAssignTrainers = require("./routesAssignTrainers");
const routerSubscriptions = require("./routesSubscriptions");
const routerTrainerProfile = require("./routesTrainerProfile");
const routerAdminDashboard = require("./routesAdminDashboard");
const routerDownloadReport = require("./routesDownloadReport");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = ["http://localhost:5501"];
app.use(cors({
    origin: function(origin, callback){
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            var msg = 'CORS policy: This origin is not allowed';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

// Sessions
app.use(
    session({
        secret: process.env.SECRET_KEY || "your-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 3600000,
            secure: false,
            httpOnly: true,
            sameSite: "lax"
        }
    })
);

// Mount routers
app.use("/login", routerLogin);
app.use("/register", routerRegister);
app.use("/contact", routerContact);
app.use("/pay", routerPayment);
app.use("/details", routerMember);
app.use("/update-profile", routerMemberprofile);
app.use("/dashboard", routerDashboard);
app.use("/adminRegister", routerAdminRegister);
app.use("/adminLogin", routerAdminLogin);
app.use("/membersaccess", routerAccessMembers);
app.use("/paymentdash", routerPaymentDashboard);
app.use("/trainers", routerTrainers);
app.use("/assigntrainers", routerAssignTrainers);
app.use("/subscriptions", routerSubscriptions);
app.use("/trainerdetails", routerTrainerProfile);
app.use("/adminDash", routerAdminDashboard);
app.use("/downloadreport", routerDownloadReport);

console.log("✅ All routes mounted");

// Test route to verify server is working
app.get("/test", (req, res) => {
    res.json({ message: "Server is working!" });
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📍 Test the trainers endpoint: http://localhost:${PORT}/trainers`);
});