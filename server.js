const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");

const routerLogin = require("./routesLogin");
const routerRegister = require("./routesRegister");
const routerContact = require("./routesContact"); 
const routerPayment = require("./routesPayment");
const routerMember = require("./routesMember");
const routerMemberprofile = require("./routesMemberprofile");
const routerDashboard = require("./routesDashboard");
const routerAdminRegister = require("./routesAdminRegister");
const routerAdminLogin = require("./routesAdminLogin");


dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = ["http://localhost:5501"];
app.use(cors({
    origin: function(origin, callback){
        // allow requests with no origin (like Postman)
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            var msg = 'CORS policy: This origin is not allowed';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));



//"http://127.0.0.1:5501",
//sessions
app.use(
    session({
        secret:process.env.SECRET_KEY,
        resave:false,
        saveUninitialized:false,
        cookie:{
            maxAge: 3600000,
            secure:false,
            httpOnly: true,
            sameSite: "lax"
        }
    })
);

// Mount routers
app.use("/login", routerLogin);
app.use("/register", routerRegister);
app.use("/contact", routerContact)
app.use("/pay", routerPayment);
app.use("/details", routerMember);
app.use("/update-profile",routerMemberprofile);
app.use("/dashboard", routerDashboard);
app.use("/adminRegister", routerAdminRegister);
app.use("/adminLogin", routerAdminLogin);


const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
