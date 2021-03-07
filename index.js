require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const socket = require("socket.io");
const User = require('./models/User');
const flash = require('connect-flash');

// const validateMiddleware = require('./middleware/validate');
const storeUserController = require('./controllers/storeUser');
const storeLoginController = require('./controllers/storeLogin');
const authMiddleware = require('./middleware/authMiddleware');
const redirectMiddleware = require('./middleware/redirect');

const uri = "mongodb+srv://hunnurjirao:rajahunnur666@cluster0.ubnum.mongodb.net/App_database"
const port = process.env.PORT || 3600

mongoose.connect(uri || 'mongodb://localhost/App_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("Database Connection Successful!");
}).catch((err) => {
    console.log("Database Connection Failed");
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(expressSession({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 5 }
}))
app.use(flash());


global.loggedIn = null;
global.username = "";
app.use("*", async (req, res, next) => {
    loggedIn = req.session.userId;
    if (loggedIn) {
        const userdata = await User.findOne({ _id: loggedIn }, (err, user) => {
            if (err) {
                res.redirect('/');
            }
        })
        username = userdata.username;
    }
    next()
});

const server = app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})



app.get('/', (req, res) => {
    res.render('index')
})
app.get('/register', redirectMiddleware, (req, res) => {

    var username = ""
    var password = ""
    const data = req.flash('data')[0];
    if (typeof data != "undefined") {
        username = data.username
        password = data.password
    }

    res.render('register', {
        // errors: req.session.validationErrors
        errors: req.flash('validationErrors'),
        username: username,
        password: password

    })
})
app.get('/login', redirectMiddleware, (req, res) => {

    res.render('login')
})

app.get('/messenger', authMiddleware, (req, res) => {
    if (req.session.userId) {
        res.render('messenger')
    } else {
        res.redirect('/login')
    }

})

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        // req.session.sid = null;
        res.redirect('/')
    })

})





app.post('/user/register', redirectMiddleware, storeUserController);
app.post('/users/login', redirectMiddleware, storeLoginController);



var io = socket(server);

io.on("connection", (socket) => {
    console.log("Socket connection successful!", socket.id)


    socket.on("chat", (data) => {
        io.sockets.emit("chat", data);
    });


    socket.on("typing", (data) => {
        socket.broadcast.emit("typing", data);
    });
});

app.use((req, res) =>
    res.render('404page')
);