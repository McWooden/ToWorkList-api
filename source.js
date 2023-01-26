import express from 'express'
const router = express.Router()
import { Book } from './schema.js'
router.get('/list/:pageId/:listId', (req, res) => {
    Book.findOne({ 'pages._id': req.params.pageId }, { 'pages.$': 1 })
    .then(result => {
        const page = result.pages[0]
        const list = page.list.id(req.params.listId)
        if (list) {
            res.json(list)
        } else {
            res.status(404).json({ success: false, error: 'List not found' })
        }
    })
    .catch(err => res.status(404).json({ success: false, error: err }))
})

router.post('/chat/:pageId/:listId', (req, res) => {
    Book.findOneAndUpdate(
        { 'pages': {$elemMatch: { _id: req.params.pageId, 'list': {$elemMatch: { _id: req.params.listId }}}}}, 
        {
            $push: {
                'pages.$.list.0.chat': {
                    nickname: req.body.nickname,
                    msg: req.body.msg,
                    time: `${new Date().getHours().toString().padStart(2, '0')}.${new Date().getMinutes().toString().padStart(2, '0')}`,
                    date: `${new Date().getMonth().toString().padStart(2, '0')}/${new Date().getDate().toString().padStart(2, '0')}/${new Date().getFullYear().toString().slice(-2)}`
                }
            }
        }, 
        { new: true }
    ).then(result => {
        if (result) {
            res.json({ success: true, data: result })
            console.log('successfull')
        } else {
            res.status(404).json({ success: false, error: 'Page or List not found' })
        }
    }).catch(err => {
        res.status(404).json({ success: false, error: err })
        console.log(err)
    })
})


router.get('/page/:pageId', (req, res) => {
    Book.findOne({'pages': { $elemMatch: { _id: req.params.pageId } }}, {'pages.$': 1})
    .exec((err, doc) => {
        if (err) {
            res.json(err)
        } else {
            res.json(doc.pages[0])
        }
    })
})

router.get('/uncheck/:pageId/:listId/:nickname', (req, res) => {
    Book.findOneAndUpdate(
        { 'pages': {$elemMatch: { _id: req.params.pageId, 'list': {$elemMatch: { _id: req.params.listId }}}}}, 
        {
            $pull: {
                'pages.$.list.0.dones': req.params.nickname
            }
        }, 
        { new: true }
    ).then(result => {
        if (result) {
            res.json({ success: true, data: result })
        } else {
            res.status(404).json({ success: false, error: 'Page or List not found'})
        }
    }).catch(err => {
        res.status(404).json({ success: false, error: err })
    })
})
router.post('/addTodo/:pageId', (req, res) => {
    const currTime = `${new Date().getHours().toString().padStart(2, '0')}.${new Date().getMinutes().toString().padStart(2, '0')}`
    const currDate = `${new Date().getMonth().toString().padStart(2, '0')}/${new Date().getDate().toString().padStart(2, '0')}/${new Date().getFullYear().toString().slice(-2)}`
    const newTodo = {
        details: {
            item_title: req.body.item_title,
            desc: req.body.desc,
            color: req.body.color,
            deadline: currDate
        },
        dones: [],
        notes: [{
            context: 'catatan',
            by: 'mimo',
            date: currDate,
            color: 'royalblue'
        }],
        images: [{
            pic: 'https://source.unsplash.com/random/introduce',
            desc: 'gambar disimpan disini',
            date: currDate,
            by: 'mimo'
        }],
        chat: [{
            nickname: 'mimo',
            msg: 'chat disini!',
            time: currTime,
            date: currDate
        }]
    }
    Book.updateOne({'pages': { $elemMatch: { _id: req.params.pageId } }}, { $push: { 'pages.0.list': newTodo }})
    .exec((err, doc) => {
        if (err) {
            res.status(500).json({error: err.message})
            console.log(err)
        } else {
            res.json(doc)
        }
    })
})

router.get('/checkTodo/:pageId/:listId/:nickname', (req, res) => {
    Book.findOneAndUpdate(
        { 'pages': {$elemMatch: { _id: req.params.pageId, 'list': {$elemMatch: { _id: req.params.listId }}}}}, 
        {
            $addToSet: {
                'pages.$.list.0.dones': req.params.nickname
            }
        }, 
        { new: true }
    ).then(result => {
        if (result) {
            res.json({ success: true, data: result })
        } else {
            res.status(404).json({ success: false, error: 'Page or List not found'})
        }
    }).catch(err => {
        res.status(404).json({ success: false, error: err })
    })
})

export default router