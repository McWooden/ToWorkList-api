import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import bodyParser from 'body-parser'
app.use(bodyParser.json())
import cookieParser from 'cookie-parser'
app.use(cookieParser())
import cors from 'cors'
app.use(cors())
const port = process.env.PORT || 3001



import './mongoose.js'
import { connectDB } from './mongoose.js'
import book from './book.js'
import user from './user.js'

// app
app.get('/', (req, res) => {
    res.send('<h1>sepertinya antum sedang kehilangan arah</h1><a href="https://mcwooden.netlify.app/">kembali ke aplikasi</a>')
})
app.use('/book', book)
app.use('/user', user)













































// Mulai server
connectDB().then(() => {
    app.listen(port, () => {
        console.log("listening for requests")
    })
})