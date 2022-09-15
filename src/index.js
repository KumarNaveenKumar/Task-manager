const express = require('express')
require('./db/mongoose')
// require('./db/mongoose')();
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

// start Express server
const app = express()
// Storing port in const
const port = process.env.PORT

// To parse the incoming json data from POST request
app.use(express.json())
// Using Routes
app.get('/help', (req, res) => {res.send('Help Me')})
app.use(userRouter)
app.use(taskRouter)
// Starting the server
app.listen(port, () => {console.log('Server is up on port: ', port)})