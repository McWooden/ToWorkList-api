import express from 'express'
const router = express.Router()
import { Book } from './schema.js'
router.get('/:guildId/:pageTitle', (req, res) => {
    Book.findById(req.params.guildId).select('pages').exec((err, result) => {
        if (err) {
            res.status(500).send(err)
        }
        let filteredResult = result.pages.filter(page => page.details.page_title === req.params.pageTitle)
        res.send(filteredResult)
    })
})
export default router