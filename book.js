import express from 'express'
const router = express.Router()
import { Book } from './schema.js'
router.get('/', (req, res) => {
    Book.find({}, (err, books) => {
        res.send(books)
    })
})
router.get('/addBook', (req, res) => {
    let book = new Book({
        profile: {
            book_title: 'buku udin',
            avatar_url: 'https://source.unsplash.com/random/bukuudin',
            author: {
                nickname: 'McWooden',
                tag: '2521'
            },
        },
        pages: [{
            page_title: 'Welcome',
            icon: 'faAddressBook',
            jadwal_url: 'https://source.unsplash.com/random/Welcome',
            list: [
                {
                    title: 'First list',
                    desc: 'ini adalah list pertamamu',
                    list_color: 'yellowgreen',
                    user_done: [],
                    deadline: '12/31/2022',
                    chat: [
                        {
                            nickname: 'Book',
                            msg: 'kamu bisa membahas list disini',
                            time: '22.50',
                            date: '12/30/2022'
                        }
                    ],
                    notes: [
                        {
                            context: 'catatan tentang list berada disini',
                            by: 'pengenalan',
                            date: '12/30/2022',
                            color: 'royalblue'
                        },
                    ],
                    images: [
                        {
                            pic: 'https://source.unsplash.com/random/introduce',
                            desc: 'gambar disimpan disini',
                            date: '12/30/2022',
                            by: 'Book'
                        },
                    ]
                }
            ]
        }],
        users: [{
            role: 'Admin',
            role_color: 'goldenrod',
            role_member: [
                {name: 'McWooden', tag: '2521', pic: 'https://source.unsplash.com/random/McWooden', status: 'ngoding'},
            ]
        }]
    })
    book.save()
    console.log(book)
    res.send('buku baru dibuat')
})
export default router