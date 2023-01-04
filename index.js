import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import bodyParser from 'body-parser'
app.use(bodyParser.json())
import cookieParser from 'cookie-parser'
app.use(cookieParser())
const port = process.env.PORT || 3001



import './mongoose.js'
import book from './book.js'
import user from './user.js'

// app
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})
app.get('/', (req, res) => {
    res.send('<h1>sepertinya antum sedang kehilangan arah</h1><a href="https://mcwooden.netlify.app/">kembali ke aplikasi</a>')
})
app.use('/book', book)
app.use('/user', user)













































// Mulai server
app.listen(process.env.PORT, () => {
    console.log(`Server berjalan di port ${process.env.PORT}`)
})
