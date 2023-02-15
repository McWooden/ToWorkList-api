import mongoose from "mongoose"
export const Book = mongoose.model('books', {
    profile: {
        book_title: String,
        avatar_url: String,
        create_at: String,
        author: {
            nickname: String,
            tag: String
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
    users: [{
        details: {
            role: String,
            role_color: String
        },
        member: [{
            nickname: String, 
            tag: String, 
            avatar: String, 
            status: String
        }]
    }]
})
export const User = mongoose.model('users', {
    name: String,
    nickname: String,
    avatar: String,
    email: String,
    password: String,
    created_at: String,
    tag: String
})

