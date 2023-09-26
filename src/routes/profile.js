const express = require('express')
const router = express.Router()
const passport = require('passport')
const { isLoggedIn } = require('../lib/auth')
const pool = require('../database')

router.get('/edit_profile', isLoggedIn, (req, res) => {
    res.render('profile/edit_profile')
})

router.post('/edit_profile', isLoggedIn, async (req, res, next) => {
    passport.authenticate('local.edit_account', {
        successRedirect: '/profile',
        failureRedirect: '/profile/edit_profile',
        failureFlash: true
    })(req, res, next)
})

router.get('/delete_profile', isLoggedIn, async (req, res) => {
    const userId = req.user.id
    try {
        await pool.query('DELETE FROM links WHERE user_id = ?', [userId])
        await pool.query('DELETE FROM users WHERE id = ?', [userId])
        req.logout(function(err) {
            if (err) {
                console.error('Error al cerrar la sesión:', err)
                res.redirect('/profile')
            } else {
                res.redirect('/c_account')
            }
        })
    } catch (error) {
        res.redirect('/c_account');
    }
})

module.exports = router