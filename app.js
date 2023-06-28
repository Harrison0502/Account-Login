const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const User=require('./models/user')
const bodyParser = require('body-parser')
const port = 3000
require('./config/mongoose')
// setting template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))

// setting routes
app.get('/', (req, res) => {
  res.render('index', { User })
})

app.post('/', (req, res) => {
  const email=req.body.email
  const password=req.body.password
  User.findOne({ email })
    .then(user => {
      if (user) {
        if (user.password === password) {
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

// starts the express server and listening for connections.
app.listen(port, () => {
  console.log(`Express app listening on port ${port}.`)
})