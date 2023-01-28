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
router.put('/chat/:pageId/:listId/:chatId', (req, res) => {
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
router.post('/addTodo/:pageId', (req, res) => {
    const currTime = `${new Date().getHours().toString().padStart(2, '0')}.${new Date().getMinutes().toString().padStart(2, '0')}`
    const currDate = `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`
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
    Book.findOneAndUpdate({'pages': { $elemMatch: { _id: req.params.pageId } }}, { $push: { 'pages.0.list': newTodo }}, {new: true}).select('pages')
    .exec((err, doc) => {
        if (err) {
            res.status(500).json({error: err.message})
        } else {
            const page = doc.pages.id(req.params.pageId)
            res.json(page)
        }
    })
})
router.delete('/addTodo/:pageId/:listId', (req, res) => {
    Book.findOneAndUpdate({'pages': { $elemMatch: { _id: req.params.pageId } }}, { $pull: { 'pages.0.list': {_id : req.params.listId} }}, {new: true}).select('pages')
    .exec((err, doc) => {
        if (err) {
            res.status(500).json({error: err.message})
        } else {
            const page = doc.pages.id(req.params.pageId)
            res.json(page)
        }
    })
})

router.get('/uncheck/:pageId/:listId/:nickname', (req, res) => {
    Book.findOneAndUpdate(
        { 'pages': {$elemMatch: { _id: req.params.pageId, 'list': {$elemMatch: { _id: req.params.listId }}}}}, 
        {
            $pull: {
                'pages.$[i].list.$[j].dones': req.params.nickname
            }
        }, 
        { 
            new: true,
            arrayFilters: [{ 'i._id': req.params.pageId }, { 'j._id': req.params.listId }]
        }
    ).then(result => {
        if (result) {
            const page = result.pages.id(req.params.pageId)
            res.json(page)
        } else {
            res.status(404).json({ success: false, error: 'Page or List not found'})
        }
    }).catch(err => {
        res.status(404).json({ success: false, error: err })
    })
})
router.get('/checkTodo/:pageId/:listId/:nickname', (req, res) => {
    Book.findOneAndUpdate(
        { 'pages': {$elemMatch: { _id: req.params.pageId, 'list': {$elemMatch: { _id: req.params.listId }}}}}, 
        {
            $addToSet: {
                'pages.$[i].list.$[j].dones': req.params.nickname
            },
        }, 
        { 
            new: true,
            arrayFilters: [{ 'i._id': req.params.pageId }, { 'j._id': req.params.listId }]
        }
    ).then(result => {
        if (result) {
            const page = result.pages.id(req.params.pageId)
            res.json(page)
        } else {
            res.status(404).json({ success: false, error: 'Page or List not found'})
        }
    }).catch(err => {
        res.status(404).json({ success: false, error: err })
        console.log(err)
    })
})

export default router