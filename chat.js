import express from 'express'
const router = express.Router()
import { Book } from './schema.js'

router.post('/:pageId/:listId', (req, res) => {
    const query = {
        'pages': {$elemMatch: { _id: req.params.pageId, 'list': {$elemMatch: { _id: req.params.listId }}}}
    }
    const update = {
        $push: {
            'pages.$[page].list.$[list].chat': {
                nickname: req.body.nickname,
                msg: req.body.msg,
                time: `${new Date().getHours().toString().padStart(2, '0')}.${new Date().getMinutes().toString().padStart(2, '0')}`,
                date: `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`
            }
        }
    }
    const options = { 
        new: true,
        arrayFilters: [{ 'page._id': req.params.pageId }, { 'list._id': req.params.listId }]
    }
    Book.findOneAndUpdate(query, update, options)
    .then(result => {
        if (result) {
            const page = result.pages.find(obj => obj._id.toString() === req.params.pageId)
            const list = page.list.find(obj => obj._id.toString() === req.params.listId)
            res.json({ success: true, data: list })
        } else {
            res.status(404).json({ success: false, error: 'Page or List not found' })
        }
    }).catch(err => {
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
            res.json({ success: true, data: list })
        } else {
            res.status(404).json({ success: false, error: 'Page or List not found' })
        }
    }).catch(err => {
        console.log(err)
        res.status(404).json({ success: false, error: err })
    })
})

export default router