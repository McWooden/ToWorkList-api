import express from 'express'
import multer from 'multer'
import { supabaseAndDuplexTrue as supabase } from './mongoose.js'
const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({storage: storage})
import sharp from 'sharp'
import { Book } from './schema.js'

router.post('/addBook', upload.single('image'), async (req, res) => {
    try {
        const dataClient = JSON.parse(req.body.data)
        const currentDate = +new Date()
        let book = new Book({
            profile: {
                book_title: dataClient.book_title,
                avatar_url: '',
                created_at: currentDate,
                author: dataClient.author,
            },
            pages: [{
                details: {
                    page_title: 'Halaman Pertama',
                    icon: 'faCheck',
                    jadwal_url: 'hello',
                },
                list: [{
                    details: {
                        item_title: 'Daftar pertama',
                        desc: 'ini adalah daftar pertamamu',
                        color: 'yellowgreen',
                        deadline: currentDate
                    },
                    dones: [],
                    notes: [{
                        context: 'catatan tentang list berada disini',
                        by: dataClient.author.nickname,
                        date: currentDate,
                        color: 'royalblue'
                    }],
                    images: [{
                        pic: 'hello',
                        desc: 'gambar disimpan disini',
                        date: currentDate,
                        by: dataClient.author.nickname
                    }],
                    chat: [{
                        nickname: 'Tutorial',
                        msg: 'kamu bisa membahas list disini',
                        date: currentDate
                    }]
                }]
            }],
            roles: [{
                name: 'Admin',
                color: 'greenyellow',
            }],
            users: [{
                nickname: dataClient.author.nickname, 
                tag: dataClient.author.tag,
                role: [],
                avatar: dataClient.author_avatar,
                status: '-',
                _id: dataClient.author._id,
                joined_at: +new Date()
            }]
        })
        try {
            const resizeImage = sharp(req.file.buffer).resize({
                height: 128,
            width: 128,
            fit: 'cover'
            })
            const { data, error} = await supabase.storage.from('book').upload(
                `${book._id}/avatar-${+new Date()}`,
                resizeImage, {
                    contentType: req.file.mimetype,
                    cacheControl: '3600',
                    upsert: true,
                    duplex: 'half'
                },
            )
            const avatar_path = data.path
            book.profile.avatar_url = avatar_path
        } catch (error) {
            book.profile.avatar_url = 'default'
            console.log(error)
        }
        book.save((err, book) => {
            if (err) {
                console.error(err)
            } else {
                const filteredData = {
                    profile: book.profile,
                    _id: book._id
                }
                res.json(filteredData)
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send('error idk')
    }
})


router.post('/jadwal/:bookId/:pageId', upload.single('image'), async (req, res) => {
    try {
        const namaLama = req.body.jadwal_url
        const namaBaru = `${req.params.bookId}/${req.params.pageId}/jadwal-${+new Date()}`
        const resizeImage = sharp(req.file.buffer).resize({
            height: 1920,
            width: 1080,
            fit: 'contain'
        })
        const { dataMove, errorMove } = await supabase.storage.from('book').move(namaLama, namaBaru)
        const { data } = await supabase.storage.from('book').upload(
            namaBaru,
            resizeImage, {
                contentType: req.file.mimetype,
                cacheControl: '3600',
                upsert: true,
                duplex: 'half'
            }
        )
        const query = { _id: req.params.bookId }
        const update = { $set: { 'pages.$[page].details.jadwal_url': data.path } }
        const options = {
            new: true,
            arrayFilters: [{ 'page._id': req.params.pageId }]
        }
        const result = await Book.findOneAndUpdate(query, update, options)
        if (!result) {return res.status(404).json({ success: false, error: 'book or page not found' })}
        const page = result.pages.find(obj => obj._id.toString() === req.params.pageId)
        return res.json(page)
    } catch (err) {
        return res.status(404).json({ success: false, error: err })
    }
})
// pp guild
router.delete('/:bookId/pp', async (req, res) => {
    await supabase.storage.from('book').remove([req.query.avatar_url])
    const query = req.params.bookId
    const update = { $set: { 'profile.avatar_url': 'default' } }
    const options = { 
        new: true,
    }
    Book.findByIdAndUpdate(query, update, options, (err, book) => {
        if (err) return res.send('buku tidak ditemukan :)')
        res.json({profile: book.profile})
    })
})
router.put('/:bookId/pp', upload.single('image'), async (req, res) => {
    try {
        const namaLama = req.body.avatar_url
        const namaBaru = `${req.params.bookId}/avatar-${+new Date()}`
        const resizeImage = sharp(req.file.buffer).resize({
            height: 128,
            width: 128,
            fit: 'cover'
        })
        const { dataMove, errorMove } = await supabase.storage.from('book').move(namaLama, namaBaru)
        const { data } = await supabase.storage.from('book').upload(
            namaBaru,
            resizeImage, {
                contentType: req.file.mimetype,
                cacheControl: '3600',
                upsert: true,
                duplex: 'half'
            }
        )
        const query = { _id: req.params.bookId }
        const update = { $set: { 'profile.avatar_url': data.path } }
        const options = { new: true }
        const result = await Book.findOneAndUpdate(query, update, options)
        if (!result) {return res.status(404).json({ success: false, error: 'book' })}
        return res.json({profile: result.profile})
    } catch (err) {
        console.log(err)
        return res.status(404).json({ success: false, error: err })
    }
})
router.post('/:bookId/:pageId/:listId', upload.single('image'), async (req, res) => {
    try {
        const resizeImage = sharp(req.file.buffer).resize({
            height: 1920,
            width: 1080,
            fit: 'contain'
        })
        const { data } = await supabase.storage.from('book').upload(
            `${req.params.bookId}/${req.params.pageId}/${req.params.listId}/${req.body.nickname}-${+new Date()}`,
            resizeImage,
            {
                contentType: req.file.mimetype,
                cacheControl: '3600',
                upsert: true,
                duplex: 'half'
            }
        )
        const query = {
        pages: {
            $elemMatch: {
                _id: req.params.pageId,
                list: { $elemMatch: { _id: req.params.listId } }
            }
        }
        }
        const update = {
        $push: {
            'pages.$[page].list.$[list].images': {
                pic: data.path,
                desc: req.body.desc,
                date: +new Date(),
                by: req.body.nickname
            }
        }
        }
        const options = {
            new: true,
            arrayFilters: [{ 'page._id': req.params.pageId }, { 'list._id': req.params.listId }]
        }
        const result = await Book.findOneAndUpdate(query, update, options)
        if (!result) {
            return res.status(404).json({ success: false, error: 'Page or List not found' })
        }
        const page = result.pages.find(obj => obj._id.toString() === req.params.pageId)
        const list = page.list.find(obj => obj._id.toString() === req.params.listId)
        return res.json(list)
    } catch (err) {
        return res.status(404).json({ success: false, error: err })
    }
})
router.delete('/:pageId/:listId/:imageId', async (req, res) => {
    await supabase.storage.from('book').remove([req.body.path])
    const query = {
        'pages': {$elemMatch: { _id: req.params.pageId, 'list': {$elemMatch: { _id: req.params.listId, 'images': {$elemMatch: {_id: req.params.imageId}}}}}}
    }
    const update = {
        $pull: {
            'pages.$[page].list.$[list].images': {_id: req.params.imageId}
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
            res.json(list)
        } else {
            res.status(404).json({ success: false, error: 'Page or List not found' })
        }
    }).catch(err => {
        console.log(err)
        res.status(404).json({ success: false, error: err })
    })
})

export default router