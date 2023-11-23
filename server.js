const express = require("express");
var bodyParser = require('body-parser')
const sqlite3 = require('sqlite3')
const path = require('path');


const app = express()
const port = 3000;

const _dirname = path.resolve()
const datapath = path.join(_dirname, 'db', 'data.db')
const db = new sqlite3.Database(datapath);


app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use(bodyParser.json());

app.get('/', (req, res) => {
    const { page = 1, name, height, weight, strBirth, endBirth, Operator, married } = req.query
    const queries = []
    const params = []
    const paramscount = []
    const limit = 5
    const offset = (page - 1) * 5

    if (name) {
        queries.push(`name LIKE '%' || ? || '%'`);
        params.push(name)
        paramscount.push(name)
    }
    if (height) {
        queries.push(`height = ?`);
        params.push(height)
        paramscount.push(height)
    }
    if (weight) {
        queries.push(`weight = ? `);
        params.push(weight)
        paramscount.push(weight)
    }
    if (strBirth && endBirth) {
        queries.push(`birthdate BETWEEN ? AND ?`);
        params.push(strBirth, endBirth)
        paramscount.push(strBirth, endBirth)

    } else if (strBirth) {
        queries.push(`birthdate >= ?`);
        params.push(strBirth)
        paramscount.push(strBirth)
    } else if (endBirth) {
        queries.push(`birthdate <= ?`);
        params.push(endBirth)
        paramscount.push(endBirth)
    }
    if (married) {
        queries.push(`married = ?`);
        params.push(married)
        paramscount.push(married)
    }
    let sqlcount = 'SELECT COUNT (*) as total FROM data';
    let sql = 'SELECT * FROM data'
    if (queries.length > 0) {
        sql += ` WHERE ${queries.join(`${Operator} `)}`
        sqlcount += ` WHERE ${queries.join(`${Operator} `)}`
    }
    // console.log(sql, params)
    sql += ' LIMIT ? OFFSET ?';
    params.push(limit, offset)

    db.get(sqlcount, paramscount, (err, data) => {
        if (err) res.send(err)
        else {
            const total = data.total;
            const pages = Math.ceil(total / limit);
            db.all(sql, params, (err, data) => {
                if (err) res.render(err)
                else res.render('index', { data, query: req.query, pages, offset, page, url: req.url })
            
            })
        }
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
        // console.log(`ini edit`, {data})
        if (err) return res.send(err)
        else
            res.render('update', { data })
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