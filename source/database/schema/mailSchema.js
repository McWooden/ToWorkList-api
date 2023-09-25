import mongoose from "mongoose"
const mailSchema = new mongoose.Schema({
    pengirim: {type: {
        nama: {type: String, default: 'Anonymous'},
        avatar: String,
        _id: mongoose.Schema.Types.ObjectId,
    }, default: {
        nama: 'Anonymous',
        _id: 'anon'
    }},
    penerima: [Object], default: [],
    subjek: {type: String, default: 'Tanpa Subject'},
    body: {type: String, default: 'Kosong'},
    dibaca: {type: [mongoose.Schema.Types.ObjectId], default: []},
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '14d'
    },
    balasan: {
        type: [Object],
        default: []
    }
})
const Mail = mongoose.model('email', mailSchema)
export default Mail