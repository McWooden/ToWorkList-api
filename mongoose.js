import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
mongoose.set('strictQuery', false)
export const connectDB = async () => {
    console.log('Connecting...')
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}