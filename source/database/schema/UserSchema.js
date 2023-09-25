import mongoose from "mongoose"
const User = mongoose.model('users', {
    name: String,
    nickname: String,
    avatar: String,
    email: String,
    password: String,
    created_at: {type: Date, default: Date.now},
    panggilan: String,
    tempat: String,
    posisi: String,
    kota: String,
    negara: String,
    tag: String,
    bio: String,
    label: [String],
    last_changes: {
        nickname_change_date: {
            type: Date,
            default: null
        },
        password_change_date: {
            type: Date,
            default: null
        },
    },
    pengikut: [mongoose.Schema.Types.ObjectId]
})

export default User