const express = require('express')
const path = require('path')
const ejs = require('ejs')
const morgan = require('morgan');
const conn_flash = require('connect-flash') 
const Exp_session = require('express-session')
const MySQLStore = require('express-mysql-session')(Exp_session)
const passport = require('passport')

const { database } = require('./keys');

//initializations
const app = express();
require('./lib/passport')
require('./lib/prof')

//setings
app.set('port', process.env.PORT || 4000)
app.set('views', path.join(__dirname, 'views'))
app.engine('.ejs', ejs.renderFile)
app.set('view engine', 'ejs');

//middlewares
app.use(Exp_session({
    secret: 'SessionMysqlDemo',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}))
app.use(conn_flash())
app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())


//global variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success')
    app.locals.message = req.flash('message')
    app.locals.user = req.user
    next()
})

//routes
app.use(require('./routes/enter'))
app.use(require('./routes/authentication'))
app.use('/links', require('./routes/links'))
app.use('/profile', require('./routes/profile'))

//public
app.use(express.static(path.join(__dirname, 'public')))

//start server
app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'))
})