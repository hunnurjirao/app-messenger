const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username: username }, (err1, user) => {

        if (user) {
            bcrypt.compare(password, user.password, (err2, same) => {

                if (same) {
                    req.session.userId = user._id

                    res.redirect('/messenger');
                }
                else {
                    // const validationErrors = Object.keys(err.errors).map(key => err.errors[key].message)
                    // req.session.validationErrors = "Invalid Username or Password";
                    res.redirect('/login')
                }
            })

        }
        else {
            res.redirect('/login')
        }
    })
}