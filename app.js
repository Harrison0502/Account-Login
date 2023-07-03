const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session');
const app = express()
const User=require('./models/user')
const bodyParser = require('body-parser')
const port = 3000
require('./config/mongoose')
// setting template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: false,
}));
// setting routes
app.get('/', (req, res) => {
  if (req.session.userId) {
    res.render('login', { login: true, name: req.session.firstName })
  } else {
    res.render('index')
  }
})

app.post('/', (req, res) => {
  const email=req.body.email
  const password=req.body.password
  User.findOne({ email })
    .then(user => {
      if (user) {
        if (user.password === password) {
          //若登入成功，將使用者的ID(資料庫內建)和名字 存儲到 session
          req.session.userId = user._id
          req.session.firstName = user.firstName
          const name = user.firstName
          res.render('login', {name})
        } else {
          res.render('index', { passwordWrong : true , email , password})
        }
      } else {
        res.render('index', { userWrong: true, email , password })
      }
    })
    .catch(error => {
      res.send('Error'); 
    });
     
})

app.get('/logout', (req, res) => {
  // 清除相關的 session 資料
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    // 清除相關的 cookie
    res.clearCookie('username')
    res.redirect('/')
  });
});

// starts the express server and listening for connections.
app.listen(port, () => {
  console.log(`Express app listening on port ${port}.`)
})