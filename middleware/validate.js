module.exports = (req, res, next) => {
    if (req.files == null || req.body.username == null ||
        req.body.email == null || req.body.password == null ||
        req.body.confirmPassowrd == null) {
        return res.redirect('/register')
    }
    next()
}