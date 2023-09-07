import express from 'express'
const router = express.Router()
import { Book } from '../database/schema.js'
import { supabase } from '../database/mongoose.js'
import cloneDeep from 'lodash.clonedeep'

// get source
router.get('/list/:pageId/:listId', (req, res) => {
    Book.findOne({ 'pages._id': req.params.pageId }, { 'pages.$': 1 })
    .then(result => {
        const page = result.pages[0]
        const list = page.list.id(req.params.listId)
        console.log(req.params.pageId, req.params.listId)
        if (list) {
            res.json(list)
        } else {
            res.status(404).json({ success: false, error: 'List not found' })
        }
    })
    .catch(err => res.status(404).json({ success: false, error: err }))
})

// get page
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
        order: 999
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

// reverse todo
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

// add daily
router.post('/daily/:pageId', (req, res) => {
    const data = req.body
    Book.findOneAndUpdate(
        {'pages': { $elemMatch: { _id: req.params.pageId } }},
        { 
            $push: { 'pages.$[page].dailyList': {...data} },
        },
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
router.delete('/daily/:pageId/:taskId', async (req, res) => {
    const query = {
        'pages': { $elemMatch: { _id: req.params.pageId } }
    }
    const update = {
        $pull: { 'pages.$[page].dailyList': {_id : req.params.taskId} }
    }
    const options = { 
        new: true,
        arrayFilters: [{ 'page._id': req.params.pageId }]
    }
    try {
        const deletedTask = await Book.findOneAndUpdate(query, update, options)
        if (!deletedTask) {
            return res.status(404).json({ success: false })
        }
        res.json({ success: true })
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message })
    }
})
// reverse daily
router.put('/daily/reverse/:pageId/:taskId/:listId', async (req, res) => {
    try {
        const book = await Book.findOne({ 'pages': {$elemMatch: { _id: req.params.pageId, 'dailyList': {$elemMatch: { _id: req.params.taskId }}}}})
        if (!book) return res.status(404).json({ error: 'Book not found' })

        const page = book.pages.id(req.params.pageId)
        if (!page) return res.status(404).json({ error: 'Page not found' })

        const task = page.dailyList.id(req.params.taskId)
        if (!task) return res.status(404).json({ error: 'Task not found' })

        const list = task.list.id(req.params.listId)
        if (!list) return res.status(404).json({ error: 'Task not found' })


        const userId = req.body._id
        const userExists = list.check.includes(userId)

        if (userExists) {
            list.check.remove(userId)
        } else {
            list.check.push(userId)
        }

        await book.save()
        res.json({ task: task })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' })
    }
})

router.get('/daily/reset', async (req, res) => {
    try {
        const books = await Book.find({})

        let returnedData = []

// Buat objek Date untuk tanggal dan waktu saat ini
var tanggalHariIni = new Date();

// Kurangi satu hari dari tanggal saat ini
tanggalHariIni.setDate(tanggalHariIni.getDate() - 1);

// Atur jam, menit, detik, dan milidetik menjadi 00:00:00.000
tanggalHariIni.setHours(0, 0, 0, 0);

console.log(tanggalHariIni);


        for (const book of books) {
            for (const page of book.pages) {
                if (page.details.icon === 'faChartBar') {
                    const filteredDailyList = page.dailyList?.map(item => {
                        const hasCheckedItem = item.list.some(checkItem => checkItem.check.length > 0)
                        if (hasCheckedItem) {
                            const parentSpace = page.history.id(item._id)
                            
                            // Create a deep copy of item.list
                            const deepCopyList = cloneDeep(item.list)

                            const pushItem = {
                                date: isoString,
                                list: deepCopyList, // Use the deep copy
                            }
                            if (parentSpace) {
                                parentSpace.box.push(pushItem)
                            } else {
                                page.history.push({
                                    detail: item.detail,
                                    box: [pushItem],
                                    _id: item._id,
                                })
                            }
                            return pushItem
                        }
                    }).filter(Boolean)

                    returnedData.push(...filteredDailyList)

                    // Reset data
                    page.dailyList.forEach(item => {
                        item.list.forEach(checkItem => {
                            checkItem.check = []
                        })
                    })
                }
            }
        }

        await Promise.all(books.map(book => book.save()))

        res.status(200).json({ message: 'Reset successful', returnedData })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred', errorMessage: error.message })
    }
})



router.get('/resetAllHistory', async (req, res) => {
    try {
      // Find all books
      const books = await Book.find()
  
      // Iterate through all books and reset the history field
      for (const book of books) {
        book.pages.forEach(page => {
          page.history = []
        })
  
        // Save each updated book
        await book.save()
      }
  
      res.json({ message: 'History reset for all books successfully' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal server error' })
    }
})

router.get('/:pageId/history')
export default router