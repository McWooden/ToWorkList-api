import express from 'express'
const router = express.Router()
import { Book } from './schema.js'
import { currDate } from './utils.js'
router.get('/', (req, res) => {
    Book.find({}).select('profile').exec((err, books) => {
        if(err) {
            return res.status(500).send(err)
        }
        res.send(books)
    })
})
router.get('/:bookId/get/users', (req, res) => {
    Book.findById(req.params.bookId).select('users').exec((err, pages) => {
        if(err) {
            return res.status(500).send(err)
        }
        res.json(pages)
    })
})
// get rooms
router.get('/:bookId/get/pages/details', (req, res) => {
    Book.findById(req.params.bookId).select('pages.details pages._id users').exec((err, pages) => {
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
// add page
router.put('/:bookId/page', (req, res) => {
    const currentDate = currDate()
    const data = {
        details: {
            page_title: req.body.page_title,
            icon: req.body.icon,
            jadwal_url: 'https://source.unsplash.com/random/Welcome-buku panduan',
        },
        list: [{
            details: {
                item_title: 'daftar pertama',
                desc: 'ini adalah daftar pertamamu',
                color: 'yellowgreen',
                deadline: currentDate
            },
            dones: [],
            notes: [{
                context: 'catatan tentang list berada disini',
                by: 'developer',
                date: currentDate,
                color: 'royalblue'
            }],
            images: [{
                pic: 'https://source.unsplash.com/random/introduce',
                desc: 'gambar disimpan disini',
                date: currentDate,
                by: 'developer'
            }],
            chat: [{
                nickname: 'Mimo',
                msg: 'kamu bisa membahas list disini',
                time: '22.50',
                date: currentDate
            }]
        }]
    }

    const query = { '_id': req.params.bookId }
    const update = { $push: { 'pages': data } }
    const options = { new: true }
// cyclic give us empety data
    Book.findOneAndUpdate(query, update, options)
    .then(result => {
        if (result) {
            const pagesDetails = result.pages.map(p => ({details: p.details }))
            res.json({pages: pagesDetails})
        } else {
            res.status(404).json({ success: false, error: 'Page or List not found' })
        }
    }).catch(err => {
        console.log(err)
        res.status(404).json({ success: false, error: err })
    })
})
// add
router.get('/:bookId/add/page', async (req, res) => {
    try {
        const updatedDocument = await Book.findOneAndUpdate(
            { _id: req.params.bookId },
            { $push: { 'pages': {
                details: {
                    page_title: 'Page Test',
                    icon: 'faCheck',
                    jadwal_url: 'https://source.unsplash.com/random/test',
                },
                list: [{
                    details: {
                        item_title: 'First list',
                        desc: 'ini adalah list pertamamu',
                        color: 'yellowgreen',
                        deadline: '12/31/2022'
                    },
                    dones: [],
                    notes: [{
                        context: 'catatan tentang list berada disini',
                        by: 'developer',
                        date: '12/30/2022',
                        color: 'royalblue'
                    }],
                    images: [{
                        pic: 'hello',
                        desc: 'gambar disimpan disini',
                        date: '12/30/2022',
                        by: 'developer'
                    }],
                    chat: [{
                        nickname: 'developer',
                        msg: 'kamu bisa membahas list disini',
                        time: '22.50',
                        date: '12/30/2022'
                    }]
                }]
            } } },
            { new: true }
        )
        res.json(updatedDocument)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
router.get('/addBook', (req, res) => {
    const currentDate = currDate()
    let book = new Book({
        profile: {
            book_title: 'Buku Huddin',
            avatar_url: 'https://source.unsplash.com/random/buku panduan',
            create_at: currentDate,
            author: {
                nickname: 'Huddin',
                tag: '2145'
            },
        },
        pages: [{
            details: {
                page_title: 'Tugas harian',
                icon: 'faAddressBook',
                jadwal_url: 'https://source.unsplash.com/random/Welcome-buku panduan',
            },
            list: [{
                details: {
                    item_title: 'First list',
                    desc: 'ini adalah list pertamamu',
                    color: 'yellowgreen',
                    deadline: currentDate
                },
                dones: [],
                notes: [{
                    context: 'catatan tentang list berada disini',
                    by: 'developer',
                    date: currentDate,
                    color: 'royalblue'
                }],
                images: [{
                    pic: 'https://source.unsplash.com/random/introduce',
                    desc: 'gambar disimpan disini',
                    date: currentDate,
                    by: 'developer'
                }],
                chat: [{
                    nickname: 'Mimo',
                    msg: 'kamu bisa membahas list disini',
                    time: '22.50',
                    date: currentDate
                }]
            }]
        }],
        users: [{
            details: {
                role: 'Admin',
                role_color: 'goldenrod'
            },
            member: [{
                nickname: 'Huddin', 
                tag: '4235', 
                avatar: 'https://source.unsplash.com/random/McWooden', 
                status: 'learning'
            }]
        }],
    })
    book.save()
    console.log(book)
    res.send('buku baru dibuat')
})

export default router