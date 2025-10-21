const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");

const routerLogin = require("./routesLogin");
const routerRegister = require("./routesRegister");
const routerContact = require("./routesContact"); 
const routerPayment = require("./routesPayment");


dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
    {
        origin:"http://localhost:8000",
        credentials:true
    }
));

//sessions
app.use(
    session({
        secret:process.env.SECRET_KEY,
        resave:false,
        saveUninitialized:false,
        cookie:{secure:false}
    })
);

// Mount routers
app.use("/login", routerLogin);
app.use("/register", routerRegister);
app.use("/contact", routerContact)
app.use("/", routerPayment); ;

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
