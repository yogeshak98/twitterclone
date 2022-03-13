const bodyParser = require("body-parser")
const config = require('config');
const database = require('./database')
const express = require("express");
const middleware = require('./middleware')
const path = require('path')
const session = require('express-session')

const app = express();
const port = config.get("server.port");
const host = config.get("server.host");

const server = app.listen(port, host, (err) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    console.log(`Server is running on ${host}:${server.address().port}`)
})

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, "public")))

app.use(session({
    secret: config.get("session.secret"),
    resave: true,
    saveUninitialized: false
}))

// Routes
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');

app.use("/login", loginRoute);
app.use("/register", registerRoute);

app.get("/", middleware.requireLogin, (req, res, next) => {
    var payload = {
        pageTitle: "Home"
    }

    res.status(200).render("home", payload);
})

const exitHandler = () => {
    console.log('Shutting down server.')
    process.exit()
}


process.on('exit', exitHandler)
process.on('SIGINT', exitHandler)
process.on('SIGTERM', exitHandler)
