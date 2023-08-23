import express from 'express'
const router = express.Router()
import { Book } from '../database/schema.js'
import { supabase } from '../database/mongoose.js'

router.get('/list/:pageId/:listId', (req, res) => {
    Book.findOne({ 'pages._id': req.params.pageId }, { 'pages.$': 1 })
    .then(result => {
        const page = result.pages[0]
        const list = page.list.id(req.params.listId)
        console.log(req.params.pageId, req.params.listId);
        if (list) {
            res.json(list)
        } else {
            res.status(404).json({ success: false, error: 'List not found' })
        }
    })
    .catch(err => res.status(404).json({ success: false, error: err }))
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

// addTodo
router.post('/addTodo/:pageId', (req, res) => {
    const currDate = req.body.deadline
    const newTodo = {
        details: {
            item_title: req.body.item_title,
            desc: req.body.desc,
            color: req.body.color,
            deadline: currDate
        },
        dones: [],
        notes: [],
        images: [],
        chat: [],
        order: 1
    }
    Book.findOneAndUpdate(
        {'pages': { $elemMatch: { _id: req.params.pageId } }},
        { $push: { 'pages.$[page].list': newTodo }},
        { new: true, arrayFilters: [{ 'page._id': req.params.pageId }] })
    .select('pages')
    .exec((err, doc) => {
        if (err) {
            res.status(500).json({ error: err.message })
        } else {
            const page = doc.pages.id(req.params.pageId)
            res.json(page)
        }
    })
})
router.delete('/addTodo/:pageId/:listId', async (req, res) => {
    const query = {
        'pages': { $elemMatch: { _id: req.params.pageId } }
    }
    const update = {
        $pull: { 'pages.$[page].list': {_id : req.params.listId} }
    }
    const options = { 
        new: true,
        arrayFilters: [{ 'page._id': req.params.pageId }]
    }
    const originalData = await Book.findOne({ 'pages._id': req.params.pageId }, { 'pages.$': 1 })

    Book.findOneAndUpdate(query, update, options)
    .then(async result => {
        if (result) {
            const pageBeforeUpdate = originalData.pages.id(req.params.pageId)
            const listBeforeUpdate = pageBeforeUpdate.list.id(req.params.listId)

            const page = result.pages.id(req.params.pageId)
            const list = page.list.id(req.params.listId)

            if (req.query.returnPage) {
                res.json(page)
            } else {
                res.json(list)
            }
            try {
                const filteredArray = listBeforeUpdate.images.reduce((acc, image) => {
                    acc.push(image.pic)
                },[]).filter((value) => {
                    return value !== 'default' && value !== 'hello'
                })
                await supabase.storage.from('book').remove(filteredArray)
            } catch (error) {
                console.log(listBeforeUpdate.images)
                console.log(error)
            }
        } else {
            res.status(404).json({ success: false, error: 'Page or List not found' })
        }
    }).catch(err => {
        console.log(err)
        res.status(404).json({ success: false, error: err })
    })
})
router.put('/addTodo/:pageId/:listId', (req, res) => {
    const query = {
        'pages': {$elemMatch: { _id: req.params.pageId, 'list': {$elemMatch: { _id: req.params.listId}}}}
    }
    const update = {
        $set: {
            'pages.$[page].list.$[list].details.color': req.body.color,
            'pages.$[page].list.$[list].details.desc': req.body.desc,
            'pages.$[page].list.$[list].details.deadline': req.body.deadline,
            'pages.$[page].list.$[list].details.item_title': req.body.item_title,
        }
    }
    const options = { 
        new: true,
        arrayFilters: [{ 'page._id': req.params.pageId }, { 'list._id': req.params.listId }]
    }
    Book.findOneAndUpdate(query, update, options)
    .then(result => {
        if (result) {
            const page = result.pages.id(req.params.pageId)
            if (req.body.returnPage) {
                res.json(page)
            } else {
                const list = page.list.id(req.params.listId)
                res.json(list)
            }
        } else {
            res.status(404).json({ success: false, error: 'Page or List not found' })
        }
    }).catch(err => {
        console.log(err)
        res.status(404).json({ success: false, error: err })
    })
})

// reverse moment
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