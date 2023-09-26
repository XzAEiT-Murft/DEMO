const express = require('express')
const router = express.Router()
const passport = require('passport')
const { isLoggedIn, isNotLog } = require('../lib/auth')

router.get('/c_account', isNotLog, (req, res) => {
    res.render('authentication/c_acount')
})

router.post('/c_account', isNotLog, (req, res, next) => { 
    passport.authenticate('local.c_account', {
        successRedirect: '/profile',
        failureRedirect: '/c_account',
        failureFlash: true
    })(req, res, next)
})
router.get('/login', isNotLog, (req, res) => {
    res.render('authentication/login')
})

router.post('/login', isNotLog, (req, res, next) => {
        passport.authenticate('local.l_ogin', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile')
})

router.get('/close_session', isLoggedIn, (req, res) => {
    req.logout(function(err) {
        if (err) {
            console.error('Error al cerrar la sesión:', err)
            res.redirect('/profile')
        } else {
            res.redirect('/login')
        }
    })
})

module.exports = router