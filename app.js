const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const port = 3000
// setting template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
// setting routes
app.get('/', (req, res) => {
  res.render('index')
})
// starts the express server and listening for connections.
app.listen(port, () => {
  console.log(`Express app listening on port ${port}.`)
})