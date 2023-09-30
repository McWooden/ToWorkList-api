import mongoose from "mongoose"
import { nanoid } from "nanoid"
const ShortUrlSchema = new mongoose.Schema({
    origin: {
        bookId: {type: mongoose.Schema.Types.ObjectId, default: null},
        pageId: {type: mongoose.Schema.Types.ObjectId, default: null},
        todoId: {type: mongoose.Schema.Types.ObjectId, default: null}
    },
    short: {type: String, default: nanoid()},
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '7d'
    },
})
const ShortUrl = mongoose.model('shortUrl', ShortUrlSchema)
export default ShortUrl