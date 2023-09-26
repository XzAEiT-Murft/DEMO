const passport = require('passport')
const Strategy = require('passport-local').Strategy
const pool = require('../database')
const ayudas = require('./helpers')

passport.use('local.l_ogin', new Strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username])
    if (rows.length > 0) {
        const user = rows[0]
        const val_pas = await ayudas.matchP(password, user.password)
        if(val_pas) {
            done(null, user, req.flash('success', 'bienvenido' + user.username))
        } else {
            done(null, false, req.flash('message','Tu contraseña es incorrecta por favor intentalo de nuevo'))
        }
    } else {
        return done(null, false, req.flash('message', 'El usuario ingresado no existe por favor intentalo de nuevo'))
    }
}))

passport.use('local.c_account', new Strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, username, password, done) => {
    const { fullname, email } = req.body
    const rowsus = await pool.query('SELECT * FROM users WHERE username = ?', [username])
    const rowsem = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    if (rowsus.length > 0) {
        return done(null, false, req.flash('message', 'El nombre de usuario ingresado ya está registrado'))
    }
    if (rowsem.length > 0) {
        return done(null, false, req.flash('message', 'El email ingresado ya está registrado'))
    }
    const newUser = {
        username,
        password,
        fullname,
        email
    }
    newUser.password = await ayudas.encryptP(password)
    const resultado = await pool.query('INSERT INTO users SET ?', [newUser])
    newUser.id = resultado.insertId;
    done(null, newUser, req.flash('success', 'La cuenta se ha creado correctamente. Por favor, inicia sesión.'))
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id])
    done(null, rows[0])
})