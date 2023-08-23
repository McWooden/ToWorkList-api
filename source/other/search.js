import express from 'express'
import { Book, User } from '../database/schema.js'
const router = express.Router()

router.get('/key', async (req, res) => {
    const key = req.query.value
    const resBook = await Book.find({ 'profile.book_title': { $regex: '^' + key, $options: 'i' } }).select('profile _id users')
    const resUser = await User.find({ nickname: { $regex: '^' + key, $options: 'i' } }).select('nickname tag avatar _id')
    const mapping = [
        ...resBook.map(x => ({type: 'book', book_title: x.profile.book_title, created_at: x.profile.created_at, author_nickname: x.profile.author.nickname, author_tag: x.profile.author.tag, _id: x._id, membersLength: x.users.length, avatar_url: x.profile.avatar_url})),
        ...resUser.map(x => ({type: 'user', nickname: x.nickname, tag: x.tag, _id: x._id, avatar: x.avatar, created_at: x.created_at}))
    ].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

    res.json(mapping)
})

export default router