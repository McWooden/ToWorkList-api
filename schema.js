import mongoose, { isObjectIdOrHexString } from "mongoose"
export const Book = mongoose.model('books', {
    profile: {
        book_title: String,
        avatar_url: String,
        create_at: String,
        desc: String,
        author: {
            nickname: String,
            tag: String,
            _id: mongoose.Schema.Types.ObjectId
        },
    },
    pages: [{
        details: {
            page_title: String,
            icon: String,
            jadwal_url: String,
        },
        list: [{
            details: {
                item_title: String,
                desc: String,
                color: String,
                deadline: String
            },
            dones: [String],
            notes: [{
                context: String,
                by: String,
                date: String,
                color: String
            }],
            images: [{
                pic: String,
                desc: String,
                date: String,
                by: String
            }],
            chat: [{
                nickname: String,
                msg: String,
                time: String,
                date: String
            }]
        }] 
    }],
    roles: [{
        name: String,
        color: String,
    }],
    users: [{
        nickname: String,
        tag: String, 
        avatar: String, 
        status: String,
        role: [String],
        joined_at: String,
        _id: mongoose.Schema.Types.ObjectId
    }]
})
export const User = mongoose.model('users', {
    name: String,
    nickname: String,
    avatar: String,
    email: String,
    password: String,
    created_at: String,
    panggilan: String,
    tempat: String,
    posisi: String,
    kota: String,
    negara: String,
    tag: String,
    bio: String,
    label: [String]
})