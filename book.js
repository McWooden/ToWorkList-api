import express from 'express'
const router = express.Router()
import { Book } from './schema.js'
import { currDate } from './utils.js'
import { supabase } from './mongoose.js'
import { supabaseAndDuplexTrue } from './mongoose.js'

router.get('/', (req, res) => {
    Book.find({}, (err, book) => {
        if(!book) {
            return res.status(500).send(err)
        }
        const filteredData = book.map(data => ({profile: data.profile, _id: data._id, users_length: data.users.length}))
        res.send(filteredData)
    })
})
router.get('/:userId', (req, res) => {
    Book.find({'users._id':  req.params.userId}, (err, book) => {
        if(!book) {
            return res.status(500).send(err)
        }
        const filteredData = book.map(data => ({profile: data.profile, _id: data._id}))
        res.send(filteredData)
    })
})
router.get('/:bookId/get/users', (req, res) => {
    Book.findById(req.params.bookId, (err, book) => {
        if(err) {
            return res.status(500).send(err)
        }
        const filteredData = {
            _id: book._id,
            roles: book.roles,
            users: book.users
        }
        res.json(filteredData)
    })
})

router.get('/join/:bookId', (req, res) => {
    Book.findById(req.params.bookId, (err, book) => {
        if(err) {
            return res.status(500).send(err)
        }
        const filteredData = {
            _id: book._id,
            profile: book.profile,
            users_length: book.users.length
        }
        res.json(filteredData)
    })
})

router.post('/join/:bookId', (req, res) => {
    const query = req.params.bookId
    const newUser = req.body
    const update = {
        $addToSet: {
            'users': {
                _id: newUser._id,
                nickname: newUser.nickname,
                tag: newUser.tag,
                avatar: newUser.avatar,
                status: '-',
                role: [],
                joined_at: +new Date()
            }
        }
    }
    const options = {new: true,}
    
    Book.findById(query, (err, book) => {
        if (err) return res.send('Buku tidak ditemukan :)')
        
        const userExists = book.users.some(user => user._id === newUser._id)
        
        if (userExists) {
            const filteredData = {
                profile: book.profile,
                _id: book._id
            }
            return res.json(filteredData)
        } else {
            Book.findByIdAndUpdate(query, update, options, (err, updatedBook) => {
                if (err) return res.send('Gagal memperbarui buku.')
                
                const filteredData = {
                    profile: updatedBook.profile,
                    _id: updatedBook._id
                }
                res.json(filteredData)
            })
        }
    })
})

router.put('/leave/:bookId', (req, res) => {
    const bookId = req.params.bookId
    const userIdToRemove = req.query.userId

    const removeUserUpdate = {
        $pull: {
            'users': { _id: userIdToRemove }
        }
    }

    Book.findByIdAndUpdate(bookId, removeUserUpdate)
    .then(result => {
        if (result) return res.json({msg: 'ok'})
        res.json({msg: 'user doesnt exist'})
    }).catch(error => {
        console.error('Error:', error)
        res.status(500).json({ msg: 'Server Error' })
    })
})


// get rooms
router.get('/:bookId/get/pages/details', (req, res) => {
    Book.findById(req.params.bookId).select('pages.details pages._id pages.order users').exec((err, pages) => {
        if(err) {
            return res.status(500).send(err)
        }
        res.json(pages)
    })
})
// get list
router.get('/:bookId/get/pages/list', (req, res) => {
    Book.findById(req.params.bookId).select('pages.list').exec((err, pages) => {
        if(err) {
            return res.status(500).send(err)
        }
        res.send(pages)
    })
})
// ganti judul dan deskripsi
router.put('/:bookId/judul', (req, res) => {
    const update = {$set: {'profile.book_title' : req.body.book_title }}
    const options = { new: true }
    Book.findByIdAndUpdate(req.params.bookId, update, options, (err, book) => {
        if(err) {
            return res.status(500).send(err)
        }
        res.json({profile: book.profile})
    })
})
router.put('/:bookId/desc', (req, res) => {
    const update = {$set: {'profile.desc' : req.body.desc }}
    const options = { new: true }
    Book.findByIdAndUpdate(req.params.bookId, update, options, (err, book) => {
        if(err) {
            return res.status(500).send(err)
        }
        res.json({profile: book.profile})
    })
})
// add page
router.post('/:bookId/page', (req, res) => {
    const currentDate = currDate()
    const data = {
        details: {
            page_title: req.body.page_title,
            icon: req.body.icon,
            jadwal_url: 'hello',
        },
        list: [{
            details: {
                item_title: 'daftar pertama',
                desc: 'ini adalah daftar pertamamu',
                color: 'yellowgreen',
                deadline: currentDate
            },
            dones: [],
            notes: [],
            images: [],
            chat: []
        }],
        order: 1,
    }

    const query = { '_id': req.params.bookId }
    const update = { $push: { 'pages': data } }
    const options = { new: true }
    Book.findOneAndUpdate(query, update, options)
    .then(result => {
        if (result) {
            const pagesDetails = result.pages.map(p => ({details: p.details, _id: p._id }))
            res.json({pages: pagesDetails})
        } else {
            res.status(404).json({ success: false, error: 'book or page not found' })
        }
    }).catch(err => {
        console.log(err)
        res.status(404).json({ success: false, error: err })
    })
})

router.put('/:bookId/page/:pageId', (req, res) => {
    const query = { '_id': req.params.bookId }
    const update = { $set: { 'pages.$[page].details.page_title': req.body.page_title } }
    const options = { 
        new: true,
        arrayFilters: [{ 'page._id': req.params.pageId }]
    }
    Book.findOneAndUpdate(query, update, options)
    .then(result => {
        if (result) {
            const pagesDetails = result.pages.map(p => ({details: p.details, _id: p._id }))
            res.json({pages: pagesDetails})
        } else {
            res.status(404).json({ success: false, error: 'book or page not found' })
        }
    }).catch(err => {
        console.log(err)
        res.status(404).json({ success: false, error: err })
    })
})
router.delete('/:bookId/page/:pageId', async (req, res) => {
    const originalData = await Book.findOne({ 'pages._id': req.params.pageId }, { 'pages.$': 1 })

    const query = { '_id': req.params.bookId }
    const update = { $pull: { 'pages': {_id: req.params.pageId} } }
    const options = { new: true }

    Book.findOneAndUpdate(query, update, options)
    .then(async result => {
        if (result) {
            const pageOriginal = originalData.pages.id(req.params.pageId)
            const picArray = pageOriginal.list.reduce((accumulator, item) => {
                item.images.forEach((image) => {
                    accumulator.push(image.pic)
                })
                return accumulator
            }, [])
            const filteredArray = [...picArray, pageOriginal.details.jadwal_url].filter((value) => {
                return value !== 'default' && value !== 'hello'
            })
            await supabase.storage.from('book').remove(filteredArray)

            const pagesDetails = result.pages.map(p => ({details: p.details, _id: p._id }))
            res.json({pages: pagesDetails})
        } else {
            res.status(404).json({ success: false, error: 'book or page not found' })
        }
    }).catch(err => {
        console.log(err)
        res.status(404).json({ success: false, error: err })
    })
})
router.get('/addRoles', (req, res) => {
    const options = {new: true}
    const update = {
        $push: {'users': {
            nickname: 'Huddin', 
            tag: '2521', 
            avatar: 'https://source.APIsh.com/random/Huddin', 
            status: 'programming',
            role: [],
            joined_at: +new Date()
        }}
    }
    Book.findOneAndUpdate({}, update, options, (err, book) => {
        res.json(+new Date())
    })
})

// delete book
router.delete('/:bookId', async (req, res) => {
    try {
        Book.findOne({_id: req.params.bookId, 'profile.author.nickname': req.body.profile.author.nickname, 'profile.author.tag': req.body.profile.author.tag}, async (err, book) => {
            try {
                if (book.profile.author.nickname !== req.body.userClientProfile.nickname || book.profile.author.tag !== req.body.userClientProfile.tag) return res.status(500).send('Bukan milik anda!')
                const picArray = book.pages.reduce((accumulator, page) => {
                    page.list.forEach((item) => {
                            item.images.forEach((image) => {
                            accumulator.push(image.pic)
                            })
                        })
                        return accumulator
                }, [])
                const jadwalUrlArray = book.pages.map((page) => page.details.jadwal_url)
                const filteredArray = [...picArray, ...jadwalUrlArray, book.profile.avatar_url].filter((value) => {
                    return value !== 'default' && value !== 'hello'
                })
                await supabaseAndDuplexTrue.storage.from('book').remove(filteredArray)
                await Book.deleteOne({_id: book._id})
                res.send('book has been delete, say good bye :)')
            } catch (error) {
                console.log('This the findOne', req.params.bookId, req.body.profile, error)
            }
        })
    } catch (error) {
        res.status(404).send(error)
    }
})

export default router