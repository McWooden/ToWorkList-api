import mongoose from "mongoose"
export const Book = mongoose.model('books', {
    profile: {
        book_title: String,
        avatar_url: String,
        author: {
            nickname: String,
            tag: String
        },
    },
    pages: [Object],
    users: [Object],
})
export const User = mongoose.model('users', {
    name: String,
    nickname: String,
    avatar: String,
    email: String,
    password: String,
    tag: String
})

