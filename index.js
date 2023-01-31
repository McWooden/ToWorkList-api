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
import book from './book.js'
import user from './user.js'
import source from './source.js'
import chat from './chat.js'
import notes from './note.js'

// import { createServer } from "http";
// import { Server } from "socket.io"

// const server = createServer(app)
// const io = new Server(server, {
//     cors: {
//         origin: '*'
//     }
// })

// io.on("connection", (socket) => {
//     console.log(`User terkoneksi ${socket.id}`)
//     socket.on("join_room", (data) => {
//         socket.join(data)
//         console.log(`User ${socket.id} memasuki ruangan ${data}`)
//     })
//     socket.on("send_message", ({data, id}) => {
//         let newData = {
//             ...data,
//             time: `${new Date().getHours().toString().padStart(2, '0')}.${new Date().getMinutes().toString().padStart(2, '0')}`,
//             date: `${new Date().getMonth().toString().padStart(2, '0')}/${new Date().getDate().toString().padStart(2, '0')}/${new Date().getFullYear().toString().slice(-2)}`
//         }
//         socket.to(id).emit("receive_message", newData)
//         // console.log(`User ${socket.id} mengirim pesan ${data.msg} di ruangan ${id}`)
//     })
// })


// app
app.get('/', (req, res) => {
    res.send('<h1>sepertinya antum sedang kehilangan arah</h1><a href="https://mcwooden.netlify.app/">kembali ke aplikasi</a>')
})
app.use('/book', book)
app.use('/user', user)
app.use('/source', source)
app.use('/notes', notes)
app.use('/chat', chat)













































// Mulai server
connectDB().then(() => {
    app.listen(port, () => {
        console.log("listening for requests", port)
    })
})