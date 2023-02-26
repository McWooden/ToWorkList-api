import express from 'express'
const router = express.Router()
import { Book } from './schema.js'
import { currDate } from './utils.js'
router.get('/', (req, res) => {
    Book.find({}, (err, book) => {
        if(!book) {
            return res.status(500).send(err)
        }
        const filteredData = book.map(data => ({profile: data.profile, _id: data._id, users_length: data.users.length}))
        res.send(filteredData)
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
            notes: [{
                context: 'catatan tentang list berada disini',
                by: 'developer',
                date: currentDate,
                color: 'royalblue'
            }],
            images: [{
                pic: 'hello',
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
router.delete('/:bookId/page/:pageId', (req, res) => {
    const query = { '_id': req.params.bookId }
    const update = { $pull: { 'pages': {_id: req.params.pageId} } }
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
// auto add
// router.get('/:bookId/add/page', async (req, res) => {
//     try {
//         const updatedDocument = await Book.findOneAndUpdate(
//             { _id: req.params.bookId },
//             { $push: { 'pages': {
//                 details: {
//                     page_title: 'Page Test',
//                     icon: 'faCheck',
//                     jadwal_url: 'https://source.unsplash.com/random/test',
//                 },
//                 list: [{
//                     details: {
//                         item_title: 'First list',
//                         desc: 'ini adalah list pertamamu',
//                         color: 'yellowgreen',
//                         deadline: '12/31/2022'
//                     },
//                     dones: [],
//                     notes: [{
//                         context: 'catatan tentang list berada disini',
//                         by: 'developer',
//                         date: '12/30/2022',
//                         color: 'royalblue'
//                     }],
//                     images: [{
//                         pic: 'hello',
//                         desc: 'gambar disimpan disini',
//                         date: '12/30/2022',
//                         by: 'developer'
//                     }],
//                     chat: [{
//                         nickname: 'developer',
//                         msg: 'kamu bisa membahas list disini',
//                         time: '22.50',
//                         date: '12/30/2022'
//                     }]
//                 }]
//             } } },
//             { new: true }
//         )
//         res.json(updatedDocument)
//     } catch (err) {
//         res.status(500).json({ message: err.message })
//     }
// })
// router.get('/addBook', (req, res) => {
//     const currentDate = currDate()
//     let book = new Book({
//         profile: {
//             book_title: 'Buku Huddin',
//             avatar_url: 'https://source.unsplash.com/random/buku panduan',
//             create_at: currentDate,
//             author: {
//                 nickname: 'Huddin',
//                 tag: '2145'
//             },
//         },
//         pages: [{
//             details: {
//                 page_title: 'Tugas harian',
//                 icon: 'faAddressBook',
//                 jadwal_url: 'https://source.unsplash.com/random/Welcome-buku panduan',
//             },
//             list: [{
//                 details: {
//                     item_title: 'First list',
//                     desc: 'ini adalah list pertamamu',
//                     color: 'yellowgreen',
//                     deadline: currentDate
//                 },
//                 dones: [],
//                 notes: [{
//                     context: 'catatan tentang list berada disini',
//                     by: 'developer',
//                     date: currentDate,
//                     color: 'royalblue'
//                 }],
//                 images: [{
//                     pic: 'https://source.unsplash.com/random/introduce',
//                     desc: 'gambar disimpan disini',
//                     date: currentDate,
//                     by: 'developer'
//                 }],
//                 chat: [{
//                     nickname: 'Mimo',
//                     msg: 'kamu bisa membahas list disini',
//                     time: '22.50',
//                     date: currentDate
//                 }]
//             }]
//         }],
//         users: [{
//             details: {
//                 role: 'Admin',
//                 role_color: 'goldenrod'
//             },
//             member: [{
//                 nickname: 'Huddin', 
//                 tag: '4235', 
//                 avatar: 'https://source.unsplash.com/random/McWooden', 
//                 status: 'learning'
//             }]
//         }],
//     })
//     book.save()
//     console.log(book)
//     res.send('buku baru dibuat')
// })

export default router