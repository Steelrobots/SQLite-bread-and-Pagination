const express = require('express');
var bodyParser = require('body-parser')
const sqlite3 = require('sqlite3')
const path = require('path')

const app = express()
const port = 3000;

const _dirname = path.resolve()
const datapath = path.join(_dirname, 'db', 'data.db')
const db = new sqlite3.Database(datapath);


app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))

app.get('/', (req, res) => {
    const {name,height,weight,birthdate,married} = req.query
    db.all('SELECT * FROM data', (err, rows) => {
        res.render('index', { data: rows })
    })

})


app.get('/add', (req, res) => {
    res.render('form', { data: {} })
})

app.post('/add', (req, res) => {
    db.run('INSERT INTO data(name,height, weight, birthdate, married) values (?,?,?,?,?)', [req.body.name, req.body.height, req.body.weight, req.body.birthdate, req.body.married], (err) => {
        if (err) return res.send(err)
        res.redirect('/')
    })
})

app.get('/edit/:id', (req, res) => {
    const id = req.params.id
    db.get('SELECT * FROM data WHERE id = ?', [id], (err, data) => {
        res.render('form', { data })
    })
})
app.post('/edit/:id', (req, res) => {
    const id = req.params.id
    db.run('UPDATE data SET name=?, height=?, weight =?, birthdate =?, married=? WHERE id=?', [req.body.name, req.body.height, req.body.weight, req.body.birthdate, req.body.married, id], (err) => {
        if (err) return res.send(err)
        res.redirect('/')
    })
})



app.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM data WHERE id=?', [id], (err) => {
        if (err) return res.send(err)
        res.redirect('/')
    })

})


app.listen(port, () => {
    console.log(`Example app listening on port : ${port}`)
})