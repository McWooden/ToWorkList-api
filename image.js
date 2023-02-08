import express from 'express'
import multer from 'multer'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({storage: storage})
import sharp from 'sharp'
import { Book } from './schema.js'

// app.post('/x6/image', upload.single('image'), async (req, res) => {
//     const resizeImage = sharp(req.file.buffer).resize({
//         height: 1920,
//         width: 1080,
//         fit: "contain"
//     })
//     const { data, error } = await supabase.storage.from('tugas')
//     .upload(`${req.body.id}/${req.body.nickname}-${+new Date}`, resizeImage, {
//         contentType: req.file.mimetype,
//         cacheControl: '3600',
//         upsert: true
//     })
//     await Task.findByIdAndUpdate(req.body.id, {
//         $addToSet: {
//             "images": data.path
//         }
//     })
//     res.send({msg: data, error})
// })

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
                upsert: true
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
                date: `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`,
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
});

export default router