const router = require('express').Router()
const bycrpt = require('bcrypt')
const { rawListeners } = require('../models/User')
const User = require('../models/User')

//Register
router.post('/register', async (req, res) => {
    try {
        const salt = await bycrpt.genSalt(10)
        const hashedPass = await bycrpt.hash(req.body.password, salt)
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass
        });

        const user = await newUser.save()
        res.status(200).json(user)
    } catch(err) {
        res.status(500).json(err)
    }
})
//Log in
router.post('/login', async (req, res) => {
    try{
        const user = await User.findOne({username: req.body.username})
        !user && res.status(400).json('Wrong login details')

        const validated = await bycrpt.compare(req.body.password, user.password)
        !validated && res.status(400).json('Wrong login details')

        const {password, ...others} = user._doc

        res.status(200).json(others)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router