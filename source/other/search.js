import express from 'express'
import Book from '../database/schema/BookSchema.js'
import User from '../database/schema/UserSchema.js'
import DailyTask from '../database/schema/DailyTaskSchema.js'
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

router.get('/dailyTask', async (req, res) => {
    const key = req.query.value
    try {
        const resTask = await DailyTask.find({ 'detail.title': { $regex: '^' + key, $options: 'i' } }).select('detail _id list followers author')
        const mapping = [
            ...resTask.map(x => {
                return ({
                ...x.detail,
                list: x.list.map(x => x.title),
                followersLength: x.followers.length,
                author_name: x.author.name,
                isUserInclude: x.followers.some(user => user._id === req.query.myId),
                _id: x._id
                })
        })
        ].sort((a, b) => a.followers.length - b.followers.length)
        res.json(mapping)
    } catch (error) {
        console.log(error);
    }
})

export default router