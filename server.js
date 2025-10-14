const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const routerLogin = require("./routesLogin");
const routerRegister = require("./routesRegister");
const routerContact = require("./routesContact"); 
const session = require("express-session")

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 24 * 60 * 60 * 1000}
}))

// Mount routers
app.use("/login", routerLogin);
app.use("/register", routerRegister);
app.use("/contact", routerContact);

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
