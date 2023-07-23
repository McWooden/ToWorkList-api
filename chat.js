import express from 'express'
const router = express.Router()
import { Book } from './schema.js'

router.post('/:pageId/:listId', (req, res) => {
    const query = {
        'pages': { $elemMatch: { _id: req.params.pageId, 'list': { $elemMatch: { _id: req.params.listId } } } }
    }

    const newItem = {
        nickname: req.body.nickname,
        msg: req.body.msg,
        date: +new Date()
    }

    Book.findOne(query)
        .then(book => {
            if (!book) {
                return res.status(404).json({ success: false, error: 'Page or List not found' })
            }

            const page = book.pages.find(obj => obj._id.toString() === req.params.pageId)
            const list = page.list.find(obj => obj._id.toString() === req.params.listId)
            const chatArray = list.chat

            if (chatArray.length >= 20) {
                chatArray.shift()
            }

            chatArray.push(newItem)

            return book.save()
        })
        .then(savedBook => {
            const page = savedBook.pages.find(obj => obj._id.toString() === req.params.pageId)
            const list = page.list.find(obj => obj._id.toString() === req.params.listId)
            res.json({ success: true, chat: list.chat })
        })
        .catch(err => {
            console.log(err)
            res.status(404).json({ success: false, error: err })
        })
})

router.put('/:pageId/:listId/:chatId', (req, res) => {
    const query = {
        'pages': {$elemMatch: { _id: req.params.pageId, 'list': {$elemMatch: { _id: req.params.listId, 'chat': {$elemMatch: {_id: req.params.chatId}}}}}}
    }
    const update = {
        $set: {
            'pages.$[page].list.$[list].chat.$[chat].msg': 'Pesan ini telah dihapus',
        }
    }
    const options = { 
        new: true,
        arrayFilters: [{ 'page._id': req.params.pageId }, { 'list._id': req.params.listId }, { 'chat._id': req.params.chatId }]
    }
    Book.findOneAndUpdate(query, update, options)
    .then(result => {
        if (result) {
            const page = result.pages.find(obj => obj._id.toString() === req.params.pageId)
            const list = page.list.find(obj => obj._id.toString() === req.params.listId)
            res.json({ success: true, data: list.chat })
        } else {
            res.status(404).json({ success: false, error: 'Page or List not found' })
        }
    }).catch(err => {
        console.log(err)
        res.status(404).json({ success: false, error: err })
    })
})

export default router