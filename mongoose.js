import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('terkoneksi dengan atlas'))
.catch(() => console.log('ERROR saat koneksi ke atlas'))
