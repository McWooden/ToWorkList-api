import express from 'express'
const router = express.Router()
import { Book } from './schema.js'
router.get('/:pageId', (req, res) => {
    Book.findOne({'pages': { $elemMatch: { _id: req.params.pageId } }}, {'pages.$': 1})
    .exec((err, doc) => {
        if (err) {
            res.json(err)
        } else {
            res.json(doc.pages[0])
        }
    })
})
export default router