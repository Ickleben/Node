const fs = require('fs')
const express = require('express');
const expressHbs = require('express-handlebars');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'pages')));

app.set('view engine', '.hbs');
app.engine('.hbs', expressHbs({
    defaultLayout: false
}));
app.set('views', path.join(__dirname, 'pages'));

app.get('/register', (req, res) => {
    res.render('register');
});
app.post('/register', (req, res) => {
if (req.body.password =='' || req.body.nickname== ''){
    res.redirect('/err');
    return
}
    fs.readFile(path.join(__dirname, 'users.txt'), "utf8", (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(JSON.parse(data.toString()))
        const dataUsers = JSON.parse(data.toString());
        const filtr = dataUsers.find(user => user.email === req.body.email);

        if (!filtr) {
            dataUsers.push(req.body)
            console.log(dataUsers)
            fs.writeFile(path.join(__dirname, 'users.txt'), JSON.stringify(dataUsers), err1 => {
                if (err) {
                    console.log(err);
                    return;
                }
            });

            res.redirect('/users');
            return;
        }
        res.redirect('/error')
    })
})
app.get('/login', (req, res) => {
    res.render('login');


});
app.post('/login', (req, res) => {
    fs.readFile(path.join(__dirname, 'users.txt'), "utf8", (err, data) => {

        if (err) {
            console.log(err);
            return;
        }
        const dataUsers = JSON.parse(data.toString());
        const {email, password} = req.body
        const check = dataUsers.findIndex(value => value.email === email && value.password === password)
        console.log(check)
        if (check===-1) {
            res.redirect('/register');
            return;
        }else {res.redirect(`/users/${check}`)}

    });
});
app.get('/users/:idUser',(req, res) => {
    const {idUser} =req.params
    console.log(idUser)
    fs.readFile(path.join(__dirname, 'users.txt'), "utf8", (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        const dataUser =JSON.parse(data.toString());

        console.log(dataUser[idUser])

        res.render('user',{user: dataUser[idUser]})
    })
})
app.get('/users',(req, res) => {
    fs.readFile(path.join(__dirname, 'users.txt'), "utf8", (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        const dataAllUsers=JSON.parse(data.toString())
        res.render('users',{users:dataAllUsers})
    })
})
app.get('/error',(req, res) => {
    res.render('error')
})
app.get('/err',(req, res) => {
    res.render('err')
})
app.get('/home', (req, res) => {
    res.render('home')

});
// app.post('/home',(req, res) => {
//     console.log(req.body);
// if (req.body.select =='users'){
//     res.redirect('/users')
// }else if (req.body.select =='register'){  це так вже
//     res.redirect('/register')
// }
// res.redirect('/login')
//
// })
app.listen(5000, () => {
    console.log('App listen 5000');
})
