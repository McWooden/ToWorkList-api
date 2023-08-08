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
import { connectDB } from './mongoose.js'
import cors from 'cors'
app.use(cors())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})
import book from './book.js'
import user from './user.js'
import source from './source.js'
import chat from './chat.js'
import notes from './note.js'
import image from './image.js'
import search from './search.js'
import mail from './mail.js'

// app
app.get('/', (req, res) => {
    res.send('<h1>sepertinya antum sedang kehilangan arah</h1><a href="https://mcwooden.netlify.app/">kembali ke aplikasi</a>')
})
app.use('/book', book)
app.use('/user', user)
app.use('/source', source)
app.use('/notes', notes)
app.use('/chat', chat)
app.use('/image', image)
app.use('/search', search)
app.use('/mail', mail)













































// Mulai server
connectDB().then(() => {
    app.listen(port, () => {
        console.log("listening for requests", port)
    })
})