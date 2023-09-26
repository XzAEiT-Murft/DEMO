const express = require('express')
const router = express.Router()
const { isLoggedIn, isNotLog } = require('../lib/auth')

router.get('/', (req, res) => {
    res.render('entrance')
})

module.exports = router