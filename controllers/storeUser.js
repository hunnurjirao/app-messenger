const User = require('../models/User')

module.exports = async (req, res) => {

    if (req.body.password === req.body.confirmPassword) {
        await User.create(req.body, (err, user) => {
            if (err) {
                const validationErrors = Object.keys(err.errors).map(key => err.errors[key].message)
                // req.session.validationErrors = validationErrors;
                req.flash('validationErrors', validationErrors)
                req.flash('data', req.body)

                return res.redirect('/register')
            } else {
                req.session.userId = user._id
                res.redirect('/messenger');
            }

        })

    } else {
        res.status(404).send("Password not matching!!!")
    }
}