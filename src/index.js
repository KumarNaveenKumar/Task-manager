const app = require('./app')

// Storing port in const
const port = process.env.PORT

// Starting the server
app.listen(port, () => {console.log('Server is up on port: ', port)})