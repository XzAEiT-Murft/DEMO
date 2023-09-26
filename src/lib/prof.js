const passport = require('passport')
const Strategy = require('passport-local').Strategy
const pool = require('../database')
const ayudas = require('./helpers')

passport.use('local.edit_account', new Strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { fullname, email } = req.body
    const userId = req.user.id
    const existingUser = await pool.query('SELECT * FROM users WHERE (username = ? OR email = ?) AND id <> ?', [username, email, userId])
    if (existingUser.length > 0) {
        return done(null, false, req.flash('message', 'El nombre de usuario o el correo ingresado ya estan registrados por favor utiliza otros.'))
    }
    const updatedUser = {
        username,
        password,
        fullname,
        email
    }
    updatedUser.password = await ayudas.encryptP(password)
    const updateResult = await pool.query('UPDATE users SET username = ?, password = ?, fullname = ?, email = ? WHERE id = ?', [updatedUser.username, updatedUser.password, updatedUser.fullname, updatedUser.email, userId])
    if (updateResult.affectedRows > 0) {
        updatedUser.id = userId
        return done(null, updatedUser, req.flash('success', 'La cuenta se ha actualizado correctamente.'))
    } else {
        return done(null, false, req.flash('message', 'No se encontró un usuario para actualizar.'))
    }
}))