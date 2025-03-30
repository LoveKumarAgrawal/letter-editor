require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require('express-session')
const authRoute = require("./routes/authRoutes");
const letterRoute = require("./routes/letterRoutes");
require("./passport");


const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(session({
   secret: `${process.env.SESSION_SECRET}`,
   resave: false,
   saveUninitialized: true,
   cookie: { secure: true, httpOnly: true }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(
	cors({
		origin: process.env.CLIENT_URL,
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);

app.get("/", (req, res) => {
	res.send("hello")
})

app.use("/auth", authRoute);
app.use("/letter", letterRoute)

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listenting on port ${port}...`));