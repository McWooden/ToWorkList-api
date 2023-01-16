import express from 'express'
const router = express.Router()
import { Book } from './schema.js'
router.get('/', (req, res) => {
    Book.find({}).select('profile').exec((err, books) => {
        if(err) {
            return res.status(500).send(err)
        }
        res.send(books)
    })
})

router.get('/', (req, res) => {
    Book.find({}, (err, books) => {
        res.send(books)
    })
})
// get rooms
router.get('/:bookId/get/pages/details', (req, res) => {
    Book.findById(req.params.bookId).select('pages.details pages._id').exec((err, pages) => {
        if(err) {
            return res.status(500).send(err)
        }
        res.send(pages)
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
                        pic: 'https://source.unsplash.com/random/introduce',
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
    let book = new Book({
        profile: {
            book_title: 'Buku Huddin',
            avatar_url: 'https://source.unsplash.com/random/buku panduan',
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
                    pic: 'https://source.unsplash.com/random/introduce',
                    desc: 'gambar disimpan disini',
                    date: '12/30/2022',
                    by: 'developer'
                }],
                chat: [{
                    nickname: 'Mimo',
                    msg: 'kamu bisa membahas list disini',
                    time: '22.50',
                    date: '12/30/2022'
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