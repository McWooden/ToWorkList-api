import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import bodyParser from 'body-parser'
app.use(bodyParser.json())
import cookieParser from 'cookie-parser'
app.use(cookieParser())
const port = process.env.PORT || 3001

import helmet from 'helmet'

app.use(helmet())

import './source/database/mongoose.js'
import { connectDB } from './source/database/mongoose.js'
import cors from 'cors'
app.use(cors())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})
import book from './source/book/book.js'
import user from './source/user/user.js'
import source from './source/book/source.js'
import chat from './source/book/todo-chat.js'
import todoNotes from './source/book/todo-note.js'
import note from './source/book/note.js'
import image from './source/book/image.js'
import search from './source/other/search.js'
import mail from './source/mail/mail.js'
import order from './source/other/order.js'
import dailyTask from './source/dailyTask/dailyTask.js'

// app
app.get('/', (req, res) => {
    res.send('<h1>sepertinya antum sedang kehilangan arah</h1><a href="https://mcwooden.netlify.app/">kembali ke aplikasi</a>')
})
app.use('/book', book)
app.use('/user', user)
app.use('/source', source)
app.use('/notes', note)
app.use('/todo-notes', todoNotes)
app.use('/chat', chat)
app.use('/image', image)
app.use('/search', search)
app.use('/mail', mail)
app.use('/order', order)
app.use('/daily/task', dailyTask)












































// Mulai server
connectDB().then(() => {
    app.listen(port, () => {
        console.log("listening for requests", port)
    })
})