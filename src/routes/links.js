const express = require('express')
const router = express.Router()
const helpers = require('../lib/ejs')
const { isLoggedIn } = require('../lib/auth')

const pool = require('../database')

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add')
})

router.post('/add', isLoggedIn, async (req, res) => {
    const {title, url, description } = req.body
    const SaveNewLink = {
        title,
        url,
        description,
        user_id: req.user.id
    }
    await pool.query('INSERT INTO links set ?', [SaveNewLink])
    req.flash('success', 'El link a sido guarado correctamente')
    res.redirect('/links')
})

router.get('/', isLoggedIn, async (req, res) => {
    const lis_links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id])
    res.render('links/list', { lis_links, helpers })
})

router.get('/delete/:id', isLoggedIn, async (req, res) =>{
    const { id } = req.params
    await pool.query('DELETE FROM links WHERE ID = ?', [id])
    req.flash('success', 'El link se a eliminado correctamente')
    res.redirect('/links')
})

router.get('/edit/:id', isLoggedIn, async (req, res) =>{
    const { id } = req.params
    const edit_links = await pool.query('SELECT * FROM links WHERE ID = ?', [id])
    res.render('links/edit', { edit_links })
})

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params
    const {title, url, description } = req.body
    const NewLink = {
        title,
        url,
        description
    }
    await pool.query('UPDATE links set ? WHERE ID = ?', [NewLink, id])
    req.flash('success', 'El link a sido editado correctamente')
    res.redirect('/links')
})


module.exports = router